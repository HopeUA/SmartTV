define(
    'hope/devices/screensaver/none',
    [
        'antie/devices/device',
        'hope/devices/screensaver/screensaver'
    ],
    function(Device, ScreenSaver) {
        'use strict';

        var SS = ScreenSaver.extend({
            on: function () {
            },

            off: function () {
            }
        });

        var instance = new SS();

        // Mixin this Screen Saver implementation, so that device.getScreenSaver() returns the correct implementation for the device
        Device.prototype.getScreenSaver = function() {
            return instance;
        };

        return SS;
    }
);
