var require = requirejs;

requirejs.config({
    baseUrl: '',
    paths: {
        antie: 'node_modules/tal/static/script',
        hope: 'src'
    }
});

var antie = {
    framework: {
        deviceConfiguration: {
            "pageStrategy": "samsungmaple",
            "modules": {
                "base": "antie/devices/browserdevice",
                "modifiers": [
                    "antie/devices/anim/css3",
                    "antie/devices/mediaplayer/samsung_maple",
                    "antie/devices/broadcastsource/samsungtvsource",
                    "antie/devices/data/nativejson",
                    "antie/devices/storage/cookie",
                    "antie/devices/logging/onscreen",
                    "antie/devices/logging/xhr",
                    "antie/devices/logging/jstestdriver",
                    "antie/devices/exit/samsung_maple",
                    "antie/devices/exit/broadcast/samsung_maple",
                    "antie/devices/parentalguidance/appdefaultpghandler"
                ]
            },
            "logging": {
                "level": "none"
            },
            "streaming": {
                "video": {
                    "mediaURIFormat": "%href%",
                    "supported": [
                        {
                            "protocols": [
                                "http"
                            ],
                            "encodings": [
                                "h264"
                            ],
                            "transferFormat": [
                                "hls",
                                "plain"
                            ],
                            "maximumBitRate": 3600,
                            "maximumVideoLines": 1080
                        }
                    ]
                },
                "audio": {
                    "mediaURIFormat": "%href%",
                    "supported": [
                        {
                            "protocols": [
                                "http"
                            ],
                            "encodings": [
                                "aac"
                            ],
                            "maximumBitRate": 192
                        }
                    ]
                }
            },
            "input": {
                "map": {
                    "29460": "UP",
                    "29461": "DOWN",
                    "4": "LEFT",
                    "5": "RIGHT",
                    "29443": "ENTER",
                    "71": "PLAY",
                    "74": "PAUSE",
                    "70": "STOP",
                    "72": "FAST_FWD",
                    "69": "REWIND",
                    "101": "1",
                    "98": "2",
                    "6": "3",
                    "8": "4",
                    "9": "5",
                    "10": "6",
                    "12": "7",
                    "13": "8",
                    "14": "9",
                    "17": "0",
                    "0": "SPACE",
                    "259": "BACK_SPACE",
                    "88": "BACK",
                    "652": "SUBTITLE",
                    "31": "INFO",
                    "108": "RED",
                    "20": "GREEN",
                    "21": "YELLOW",
                    "22": "BLUE"
                }
            },
            "accessibility": {
                "captions": {
                    "supported": [
                        "application/ttaf+xml"
                    ]
                }
            },
            "layouts": [
                {
                    "width": 960,
                    "height": 540,
                    "module": "src/layouts/540p",
                    "classes": [
                        "browserdevice540p"
                    ]
                }
                // {
                //     "width": 1280,
                //     "height": 720,
                //     "module": "src/layouts/720p",
                //     "classes": [
                //         "browserdevice720p"
                //     ]
                // }
            ],
            "networking": {
                "supportsJSONP": true
            },
            "broadcast": {
                "aitProfile": "dtg_local"
            },
            "capabilities": [],
            "statLabels": {
                "deviceType": "smarttv",
                "serviceType": "retail"
            }
        }
    }
};

require(
    [
        'antie/application',
        'antie/widgets/container'
    ],
    function (Application, Container) {
        // antie.framework.deviceConfiguration = DeviceConfig(navigator.userAgent);
        var self = this;

        var App = Application.extend({
            init: function (appDiv, styleDir, imgDir, callback) {
                var self;
                self = this;

                self._super(appDiv, styleDir, imgDir, callback);

                // Sets the root widget of the application to be
                // an empty container
                self._setRootContainer = function () {
                    var container = new Container();
                    container.outputElement = appDiv;
                    self.setRootWidget(container);
                };
            },

            run: function () {
                // Called from run() as we need the framework to be ready beforehand.
                this._setRootContainer();
                // Create maincontainer and add simple component to it
                this.addComponentContainer('maincontainer', 'hope/components/home');
            }
        });

        var onReady = function () {
            var staticLoadingScreen = document.getElementById('loading-screen');
            staticLoadingScreen.parentNode.removeChild(staticLoadingScreen);
        };

        new App(
            document.getElementById('app'),
            'src/theme/',
            'src/theme/images/',
            onReady
        );
    }
);

// TIZEN
var keys = ['MediaPlay','MediaPause','MediaPlayPause', 'ColorF0Red', 'ColorF2Yellow', 'ColorF3Blue'];
tizen.tvinputdevice.registerKeyBatch(keys);
