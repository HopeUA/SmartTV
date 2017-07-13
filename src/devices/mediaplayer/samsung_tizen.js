define(
    'hope/devices/mediaplayer/samsung_tizen',
    [
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer',
        'antie/runtimecontext'
    ],
    function(Device, MediaPlayer, RuntimeContext) {
        'use strict';

        var Player = MediaPlayer.extend({

            init: function () {
                this._super();
                this._state = MediaPlayer.STATE.EMPTY;
                this._playerPlugin = webapis.avplay;
            },

            /**
             * @inheritDoc
             */
            setSource: function (mediaType, url, mimeType) {
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;

                    this._playerPlugin.open(url);
                    this._playerPlugin.setDisplayRect(0, 0, 1920, 1080);

                    this._registerEventHandlers();
                    this._toStopped();
                } else {
                    this._toError('Cannot set source unless in the \'' + MediaPlayer.STATE.EMPTY + '\' state');
                }
            },

            /**
             * @inheritDoc
             */
            beginPlayback: function() {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                        this._toBuffering();
                        this._playerPlugin.prepare();
                        this._playerPlugin.play();
                        break;

                    default:
                        this._toError('Cannot beginPlayback while in the \'' + this.getState() + '\' state');
                        break;
                }
            },

            /**
             * @inheritDoc
             */
            pause: function () {
                this._postBufferingState = MediaPlayer.STATE.PAUSED;
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PAUSED:
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._playerPlugin.pause();
                        this._toPaused();
                        break;

                    default:
                        this._toError('Cannot pause while in the \'' + this.getState() + '\' state');
                        break;
                }
            },

            /**
             * @inheritDoc
             */
            stop: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._stopPlayer();
                        this._toStopped();
                        break;

                    default:
                        this._toError('Cannot stop while in the \'' + this.getState() + '\' state');
                        break;
                }
            },

            /**
             * @inheritDoc
             */
            resume : function () {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.BUFFERING:
                        break;

                    case MediaPlayer.STATE.PAUSED:
                        this._playerPlugin.play();
                        this._toPlaying();
                        break;

                    default:
                        this._toError('Cannot resume while in the \'' + this.getState() + '\' state');
                        break;
                }
            },

            /**
             * @inheritDoc
             */
            reset: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.EMPTY:
                        break;

                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        this._toEmpty();
                        break;

                    default:
                        this._toError('Cannot reset while in the \'' + this.getState() + '\' state');
                        break;
                }
            },

            /**
             * @inheritDoc
             */
            getSource: function () {
                return this._source;
            },

            /**
             * @inheritDoc
             */
            getMimeType: function () {
                return this._mimeType;
            },

            /**
             * @inheritDoc
             */
            getState: function () {
                return this._state;
            },

            /**
             * @inheritDoc
             */
            getCurrentTime: function () {
                if (this.getState() === MediaPlayer.STATE.STOPPED) {
                    return undefined;
                } else {
                    return this._currentTime;
                }
            },

            /**
             * @inheritDoc
             */
            getSeekableRange: function () {
                return this._range;
            },

            /**
             * @inheritDoc
             */
            getPlayerElement: function() {
                return this._playerPlugin;
            },
            /**
             * @inheritDoc
             */
            _getMediaDuration: function() {
                if (this._range) {
                    return this._range.end;
                }
                return undefined;
            },

            _onStatus: function() {
                var state = this.getState();
                if (state === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _onCurrentTime: function(timeInMillis) {
                this._currentTime = timeInMillis / 1000;
                this._onStatus();
                this._currentTimeKnown = true;
            },

            _registerEventHandlers: function() {
                var self = this;

                var listener = {
                    onbufferingstart: function () {
                        self._toBuffering();
                    },
                    onbufferingcomplete: function () {
                        if (self.getState() !== MediaPlayer.STATE.BUFFERING) {
                            return;
                        }

                        if (self._postBufferingState === MediaPlayer.STATE.PAUSED) {
                            self._toPaused();
                        } else {
                            self._toPlaying();
                        }
                    },
                    oncurrentplaytime: function(currentTime) {
                        self._onCurrentTime(currentTime);
                    },
                    onerror: function(error) {

                        self._toError(error);
                    }
                };

                this._playerPlugin.setListener(listener);
            },
            _unregisterEventHandlers: function() {
                this._playerPlugin.setListener({});
            },

            _reportError: function(errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._emitEvent(MediaPlayer.EVENT.ERROR, {'errorMessage': errorMessage});
            },

            _toStopped: function () {
                this._range = undefined;
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
            },

            _toBuffering: function () {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
            },

            _toPlaying: function () {
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
            },

            _toPaused: function () {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
            },

            _toComplete: function () {
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
            },

            _toEmpty: function () {
                this._wipe();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            _toError: function(errorMessage) {
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._reportError(errorMessage);
                throw 'ApiError: ' + errorMessage;
            },
            _stopPlayer: function() {
                this._playerPlugin.stop();
                this._currentTimeKnown = false;
            },
            _wipe: function () {
                this._stopPlayer();
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._unregisterEventHandlers();
            }


        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }
);
