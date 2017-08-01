define(
    'hope/devices/screensaver/screensaver',
    [
        'antie/devices/device'
    ],
    function(Device) {
        'use strict';

        var ScreenSaver = Device.extend({
            init: function () {
                this.state = undefined;
            },

            on: function () {
                throw new Error('on method has not been implemented');
            },

            off: function () {
                throw new Error('off method has not been implemented');
            }
        });

        return ScreenSaver;
    }
);
