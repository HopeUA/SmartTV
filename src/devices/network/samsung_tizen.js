define(
    'hope/devices/network/samsung_tizen',
    [
        'antie/devices/device',
        'antie/events/networkstatuschangeevent',
        'hope/devices/network/network'
    ],
    function(Device, NetworkStatusChangeEvent, Network) {
        'use strict';

        var NetworkManager = Network.extend({
            registerNetworkStatusListener: function () {
                var self = this;
                webapis.network.addNetworkStateChangeListener(function (value) {
                    switch (value) {
                        case webapis.network.NetworkState.GATEWAY_DISCONNECTED:
                            self.emitEvent(new NetworkStatusChangeEvent(NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE));
                            break;

                        case webapis.network.NetworkState.GATEWAY_CONNECTED:
                            self.emitEvent(new NetworkStatusChangeEvent(NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE));
                            break;
                    }
                });
            }

        });

        var instance = new NetworkManager();

        // Mixin this Network Manager implementation, so that device.getNetworkManager() returns the correct implementation for the device
        Device.prototype.getNetworkManager = function() {
            return instance;
        };

        return NetworkManager;
    }
);
