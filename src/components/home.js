define(
    [
        'antie/widgets/widget',
        'antie/widgets/component',
        'antie/widgets/container',
        'antie/widgets/horizontallist',
        'antie/widgets/button',
        'antie/widgets/label',
        'antie/events/keyevent',
        'antie/events/networkstatuschangeevent',
        'antie/runtimecontext',
        'antie/devices/mediaplayer/mediaplayer',
        'hope/devices/screensaver/screensaver',
        'hope/devices/network/network',
        'i18n!hope/nls/strings'
    ],
    function (
        Widget,
        Component,
        Container,
        HorizontalList,
        Button,
        Label,
        KeyEvent,
        NetworkStatusChangeEvent,
        RuntimeContext,
        MediaPlayer,
        ScreenSaver,
        Network,
        $
    ) {
        return Component.extend({
            init: function () {
                var self = this;
                this._super('homePage');

                this.screenSaver = this.createScreenSaver();
                this.initElements();
                this.registerNetworkManager();
                this.visibilityChangeListener();

                this.keyHandler = this.createKeyHandler();
                this.setActiveChildWidget(this.keyHandler);

                this.initMediaPlayer();
                this.onAfterShow(function(){
                    self.startLive();
                });
            },

            /**
             * Media player
             */
            initMediaPlayer: function () {
                var self = this;
                this.mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();

                this.mediaPlayer.addEventCallback(this, function (e) {
                    switch (e.type) {
                        case MediaPlayer.EVENT.ERROR:
                            self.showErrorMessage('Media Player', e.errorMessage);
                            break;

                        case MediaPlayer.EVENT.PLAYING:
                            self.setElementVisible(self.elements.loader, false);
                            self.setElementVisible(self.elements.play, false);
                            break;

                        case MediaPlayer.EVENT.PAUSED:
                            self.setElementVisible(self.elements.play);
                            break;

                        case MediaPlayer.EVENT.BUFFERING:
                            self.setElementVisible(self.elements.loader);
                            break;

                        case MediaPlayer.EVENT.STOPPED:
                            break;
                    }

                    if (e.type === MediaPlayer.EVENT.PLAYING) {
                        self.toggleScreenSaver(false);
                    } else if (e.type !== MediaPlayer.EVENT.STATUS) {
                        self.toggleScreenSaver(true);
                    }
                });
            },

            /**
             * Start live
             */
            startLive: function () {
                try {
                    this.mediaPlayer.setSource(
                        MediaPlayer.TYPE.VIDEO,
                        'https://bcliveunivsecure-lh.akamaihd.net/i/HopeChannelUkraine_1@432955/master.m3u8',
                        'application/x-mpegurl'
                    );
                    this.mediaPlayer.beginPlayback();
                } catch (e) {
                    if (e.message) {
                        this.showErrorMessage('Start Live', e.message);
                    }
                }
            },

            initElements: function () {
                var elements = {
                    loader: this.createLoader(),
                    play: this.createPlayButton(),
                    network: this.createNetworkStatusPopup(),
                    error: this.createErrorMessagePopup(),
                    exit: this.createExitPopup()
                };

                for (var id in elements) {
                    if (!elements.hasOwnProperty(id)) {
                        continue;
                    }

                    var el = elements[id];
                    this.appendChildWidget(el);
                }

                this.elements = elements;
            },

            registerNetworkManager: function () {
                var network = RuntimeContext.getDevice().getNetworkManager();
                network.addEventCallback(this, function (e) {
                    if (e.type === 'networkstatuschange') {
                        switch (e.networkStatus) {
                            case NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE:
                                this.toggleNetworkStatusAlert(true);
                                break;

                            case NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE:
                                this.toggleNetworkStatusAlert(false);
                                switch (this.mediaPlayer.getState()) {
                                    case MediaPlayer.STATE.ERROR:
                                        this.mediaPlayer.reset();
                                    case MediaPlayer.STATE.EMPTY:
                                        this.startLive();
                                        break;
                                }
                                break;
                        }
                    }
                });
            },

            createPlayButton: function () {
                var playButton = new Container('playButton');

                return playButton;
            },

            createExitPopup: function () {
                var self = this;

                var exitPopup = new Container('exitPopup');
                exitPopup.addClass('popup');

                var message = new Label('exitMessage', $.exit.message);
                message.addClass('message');
                exitPopup.appendChildWidget(message);

                var buttonContainer = new HorizontalList('buttonContainer');

                var yesButton = new Button('yesButton');
                yesButton.appendChildWidget(new Label($.exit.yes));
                yesButton.addEventListener('select', function () {
                    try {
                        self.getCurrentApplication().exit();
                    } catch (error) {
                        self.toggleExitConfirmation(false);
                        self.showErrorMessage('Exit', error.message);
                    }
                });
                buttonContainer.appendChildWidget(yesButton);

                var noButton = new Button('noButton');
                noButton.appendChildWidget(new Label($.exit.no));
                noButton.addEventListener('select', function () {
                    self.toggleExitConfirmation(false);
                });
                buttonContainer.appendChildWidget(noButton);

                exitPopup.appendChildWidget(buttonContainer);
                exitPopup.addEventListener('keydown', function (e) {
                    if (e.keyCode === KeyEvent.VK_BACK) {
                        self.toggleExitConfirmation(false);
                    }
                });

                return this.wrapPopup(exitPopup);
            },

            createErrorMessagePopup: function () {
                var self = this;

                var errorPopup = new Container('errorPopup');
                errorPopup.addClass('popup');

                var title = new Label('errorTitle', 'error');
                title.addClass('title');
                errorPopup.appendChildWidget(title);

                var message = new Label('errorMessage', '');
                message.addClass('message');
                errorPopup.appendChildWidget(message);

                var okButton = new Button('okButton');
                okButton.appendChildWidget(new Label('OK'));
                okButton.addEventListener('select', function () {
                    self.setElementVisible(self.elements.error, false);
                    self.keyHandler.focus();
                });
                okButton.addEventListener('keydown', function (e) {
                    if (e.keyCode === KeyEvent.VK_BACK) {
                        self.setElementVisible(self.elements.error, false);
                        self.keyHandler.focus();
                    }
                });

                errorPopup.appendChildWidget(okButton);

                return this.wrapPopup(errorPopup);
            },

            createLoader: function () {
                var loader = new Container('loader');

                return loader;
            },

            createNetworkStatusPopup: function () {
                var networkStatusPopup = new Container('networkStatusPopup');
                networkStatusPopup.addClass('popup');

                var message = new Label('networkStatusMessage', $.network);
                message.addClass('message');
                networkStatusPopup.appendChildWidget(message);

                return this.wrapPopup(networkStatusPopup);
            },

            createKeyHandler: function () {
                var self = this;
                var keyHandler = new Button('keyHandler');
                keyHandler.addEventListener('select', function () {
                    if (self.mediaPlayer.getState() === MediaPlayer.STATE.PLAYING) {
                        self.mediaPlayer.pause();
                    } else if (self.mediaPlayer.getState() === MediaPlayer.STATE.PAUSED) {
                        self.mediaPlayer.resume();
                    }
                });
                keyHandler.addEventListener('keydown', function (e) {
                    switch (e.keyCode) {
                        case KeyEvent.VK_PLAY:
                            if (self.mediaPlayer.getState() === MediaPlayer.STATE.PAUSED) {
                                self.mediaPlayer.resume();
                            }
                            break;

                        case KeyEvent.VK_PAUSE:
                            if (self.mediaPlayer.getState() === MediaPlayer.STATE.PLAYING) {
                                self.mediaPlayer.pause();
                            }
                            break;

                        case KeyEvent.VK_PLAY_PAUSE:
                            if (self.mediaPlayer.getState() === MediaPlayer.STATE.PLAYING) {
                                self.mediaPlayer.pause();
                            } else if (self.mediaPlayer.getState() === MediaPlayer.STATE.PAUSED) {
                                self.mediaPlayer.resume();
                            }
                            break;

                        // RETURN button
                        case KeyEvent.VK_BACK:
                            self.toggleExitConfirmation(true);
                            break;
                    }
                });
                this.appendChildWidget(keyHandler);

                return keyHandler;
            },

            createScreenSaver: function () {
                var ss = RuntimeContext.getDevice().getScreenSaver();

                return ss;
            },

            wrapPopup: function(popup) {
                var popupWrap = new Container();
                popupWrap.addClass('popupWrap');
                popupWrap.appendChildWidget(popup);

                return popupWrap;
            },

            /**
             * App ready
             */
            onAfterShow: function (next) {
                var self = this;
                this.addEventListener('aftershow', function appReady() {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                    next();
                });
            },

            setElementVisible: function (el, visible) {
                var options = {
                    skipAnim: false,
                    fps: 25,
                    duration: 100,
                    easing: 'ease'
                };
                visible = visible === undefined || visible;
                visible ? el.show(options) : el.hide({ skipAnim: true });
            },

            showErrorMessage: function (title, message) {
                var $errorPopup = this.elements.error.getChildWidget('errorPopup');

                var $title = $errorPopup.getChildWidget('errorTitle');
                $title.setText(title + ' Error');

                var $message = $errorPopup.getChildWidget('errorMessage');
                $message.setText(message);

                this.elements.error.focus();
                this.setElementVisible(this.elements.error);
            },

            toggleExitConfirmation: function(show) {
                if (show === undefined) {
                    return false;
                }

                if (show) {
                    this.elements.exit.focus();
                } else {
                    var exitPopup = this.elements.exit.getChildWidget('exitPopup');
                    var buttonContainer = exitPopup.getChildWidget('buttonContainer');
                    var yesButton = buttonContainer.getChildWidget('yesButton');

                    buttonContainer.setActiveChildWidget(yesButton);
                    this.keyHandler.focus();
                }
                this.setElementVisible(this.elements.exit, show);
            },

            toggleNetworkStatusAlert: function(show) {
                this.setElementVisible(this.elements.network, show);
            },

            toggleScreenSaver: function(show) {
                if (show === undefined) {
                    show = true;
                }

                try {
                    show ? this.screenSaver.on() : this.screenSaver.off();
                } catch (error) {
                    this.showErrorMessage('Screen Saver', error.message);
                }
            },

            /**
             * Multitasking
             */
            visibilityChangeListener: function () {
                var self = this;
                document.addEventListener('visibilitychange', function () {
                    if(document.hidden) {
                        self.mediaPlayer.stop();
                        self.mediaPlayer.reset();
                    } else {
                        self.startLive();
                    }
                });
            }
        });
    }
);
