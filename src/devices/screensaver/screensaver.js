define(
    'hope/devices/screensaver/screensaver',
    [
        'antie/devices/device'
    ],
    function(Device) {
        'use strict';

        var ScreenSaver = Device.extend({
            on: function () {
                throw new Error('on method has not been implemented');
            },

            off: function () {
                throw new Error('off method has not been implemented');
            }
        });

        ScreenSaver.STATE = {
            SCREEN_SAVER_ON: 'SCREEN_SAVER_ON',
            SCREEN_SAVER_OFF: 'SCREEN_SAVER_OFF'
        };

        return ScreenSaver;
    }
);
