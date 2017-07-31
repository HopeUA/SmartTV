var require = requirejs;
var antie;

requirejs.config({
    baseUrl: '',
    paths: {
        antie: 'vendor/tal',
        hope: 'src',
        app: '.',
        i18n: 'vendor/requirejs/i18n',
        json: 'vendor/requirejs/json',
        text: 'vendor/requirejs/text'
    }
});

require(['json!app/config.json'], function(config){
    antie = config;

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
});
