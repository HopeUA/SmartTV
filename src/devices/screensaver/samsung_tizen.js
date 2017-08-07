define(
    'hope/devices/screensaver/samsung_tizen',
    [
        'antie/devices/device',
        'hope/devices/screensaver/screensaver'
    ],
    function(Device, ScreenSaver) {
        'use strict';

        var SS = ScreenSaver.extend({
            init: function () {
                this.state = undefined;
            },

            on: function () {
                if (this.state === ScreenSaver.STATE.SCREEN_SAVER_ON) {
                    return;
                }
                webapis.appcommon.setScreenSaver(webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_ON);
                this.state = ScreenSaver.STATE.SCREEN_SAVER_ON;
            },

            off: function () {
                if (this.state === ScreenSaver.STATE.SCREEN_SAVER_OFF) {
                    return;
                }
                webapis.appcommon.setScreenSaver(webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF);
                this.state = ScreenSaver.STATE.SCREEN_SAVER_OFF;
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
