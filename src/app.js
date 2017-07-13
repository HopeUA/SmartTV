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
            "pageStrategy": "html5",
            "modules": {
                "base": "antie/devices/browserdevice",
                "modifiers": [
                    "antie/devices/anim/css3",
                    "hope/devices/mediaplayer/samsung_tizen",
                    "antie/devices/mediaplayer/live/seekable",
                    "antie/devices/broadcastsource/tizentvsource",
                    "antie/devices/data/json2",
                    "antie/devices/storage/cookie",
                    "antie/devices/logging/onscreen",
                    "antie/devices/logging/xhr",
                    "antie/devices/logging/jstestdriver",
                    "antie/devices/exit/samsung_tizen",
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
                    "38": "UP",
                    "40": "DOWN",
                    "37": "LEFT",
                    "39": "RIGHT",
                    "13": "ENTER",
                    "415": "PLAY",
                    "19": "PAUSE",
                    "10252": "PLAY_PAUSE",
                    "413": "STOP",
                    "417": "FAST_FWD",
                    "412": "REWIND",
                    "10233": "NEXT",
                    "10232": "PREV",
                    "48": "0",
                    "49": "1",
                    "50": "2",
                    "51": "3",
                    "52": "4",
                    "53": "5",
                    "54": "6",
                    "55": "7",
                    "56": "8",
                    "57": "9",
                    "10225": "SEARCH",
                    "10009": "BACK",
                    "457": "INFO",
                    "403": "RED",
                    "404": "GREEN",
                    "405": "YELLOW",
                    "406": "BLUE",
                    "10221": "SUBTITLE"

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
                    "width": 1920,
                    "height": 1080,
                    "module": "src/layouts/1080p",
                    "classes": [
                        "browserdevice1080p"
                    ]
                }
            ],
            "networking": {
                "supportsJSONP": true,
                "supportsCORS": true
            },
            "broadcast": {
                "aitProfile": "dtg_local",
                "currentChannelValidation": {
                    "enabled": true
                }
            },
            "capabilities": ["dial_capable"],
            "statLabels": {
                "deviceType": "smarttv",
                "serviceType": "retail",
                "osType": "tizen",
                "browserType": "tizen"
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
        var App = Application.extend( {
            init: function (appDiv, styleDir, imgDir, callback) {
                var self = this;

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
var keys = ['MediaPlay','MediaPause','MediaPlayPause'];
tizen.tvinputdevice.registerKeyBatch(keys);
