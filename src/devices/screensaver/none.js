define(
    'hope/devices/screensaver/none',
    [
        'hope/devices/screensaver/screensaver'
    ],
    function(SS) {
        'use strict';

        var ScreenSaver = SS.extend({
            init: function () {
            },

            on: function () {
            },

            off: function () {
            }
        });

        var instance = new ScreenSaver();

        // Mixin this Screen Saver implementation, so that device.getScreenSaver() returns the correct implementation for the device
        Device.prototype.getScreenSaver = function() {
            return instance;
        };

        return ScreenSaver;
    }
);
