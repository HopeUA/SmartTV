define(
    'hope/devices/network/network',
    [
        'antie/class',
        'antie/callbackmanager'
    ],
    function(Class, CallbackManager) {
        'use strict';

        var Network = Class.extend({
            init: function () {
                this._callbackManager = new CallbackManager();
                this.registerNetworkStatusListener();
            },

            addEventCallback: function (thisArg, callback) {
                this._callbackManager.addCallback(thisArg, callback);
            },

            emitEvent: function (event) {
                this._callbackManager.callAll(event);
            },

            registerNetworkStatusListener: function () {
                throw new Error('registerNetworkStatusListener method has not been implemented');
            }
        });

        return Network;
    }
);
