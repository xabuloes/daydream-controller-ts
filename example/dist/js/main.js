var DaydreamControllerTS;
(function (DaydreamControllerTS) {
    var DaydreamController = (function () {
        function DaydreamController() {
            var _this = this;
            this.onStateChangeCallback = function (state) {
                // Default callback does nothing
            };
            this.handleData = function (event) {
                var rawSensorData = event.target.value;
                /*
                 Populate state with sensor rawSensorData
                 */
                var state = {
                    isClickDown: (rawSensorData.getUint8(18) & 0x1) > 0,
                    isAppDown: (rawSensorData.getUint8(18) & 0x4) > 0,
                    isHomeDown: (rawSensorData.getUint8(18) & 0x2) > 0,
                    isVolPlusDown: (rawSensorData.getUint8(18) & 0x10) > 0,
                    isVolMinusDown: (rawSensorData.getUint8(18) & 0x8) > 0,
                    time: ((rawSensorData.getUint8(0) & 0xFF) << 1 | (rawSensorData.getUint8(1) & 0x80) >> 7),
                    seq: (rawSensorData.getUint8(1) & 0x7C) >> 2,
                    xOri: 0,
                    yOri: 0,
                    zOri: 0,
                    xAcc: 0,
                    yAcc: 0,
                    zAcc: 0,
                    xGyro: 0,
                    yGyro: 0,
                    zGyro: 0,
                    xTouch: ((rawSensorData.getUint8(16) & 0x1F) << 3 | (rawSensorData.getUint8(17) & 0xE0) >> 5) / 255.0,
                    yTouch: ((rawSensorData.getUint8(17) & 0x1F) << 3 | (rawSensorData.getUint8(18) & 0xE0) >> 5) / 255.0
                };
                /*
                 Additional bit shifting magic in order to extract the relevant sensor rawSensorData:
                 */
                state.xOri = (rawSensorData.getUint8(1) & 0x03) << 11 | (rawSensorData.getUint8(2) & 0xFF) << 3 | (rawSensorData.getUint8(3) & 0x80) >> 5;
                state.xOri = (state.xOri << 19) >> 19;
                state.xOri *= (2 * Math.PI / 4095.0);
                state.yOri = (rawSensorData.getUint8(3) & 0x1F) << 8 | (rawSensorData.getUint8(4) & 0xFF);
                state.yOri = (state.yOri << 19) >> 19;
                state.yOri *= (2 * Math.PI / 4095.0);
                state.zOri = (rawSensorData.getUint8(5) & 0xFF) << 5 | (rawSensorData.getUint8(6) & 0xF8) >> 3;
                state.zOri = (state.zOri << 19) >> 19;
                state.zOri *= (2 * Math.PI / 4095.0);
                state.xAcc = (rawSensorData.getUint8(6) & 0x07) << 10 | (rawSensorData.getUint8(7) & 0xFF) << 2 | (rawSensorData.getUint8(8) & 0xC0) >> 6;
                state.xAcc = (state.xAcc << 19) >> 19;
                state.xAcc *= (8 * 9.8 / 4095.0);
                state.yAcc = (rawSensorData.getUint8(8) & 0x3F) << 7 | (rawSensorData.getUint8(9) & 0xFE) >>> 1;
                state.yAcc = (state.yAcc << 19) >> 19;
                state.yAcc *= (8 * 9.8 / 4095.0);
                state.zAcc = (rawSensorData.getUint8(9) & 0x01) << 12 | (rawSensorData.getUint8(10) & 0xFF) << 4 | (rawSensorData.getUint8(11) & 0xF0) >> 4;
                state.zAcc = (state.zAcc << 19) >> 19;
                state.zAcc *= (8 * 9.8 / 4095.0);
                state.xGyro = ((rawSensorData.getUint8(11) & 0x0F) << 9 | (rawSensorData.getUint8(12) & 0xFF) << 1 | (rawSensorData.getUint8(13) & 0x80) >> 7);
                state.xGyro = (state.xGyro << 19) >> 19;
                state.xGyro *= (2048 / 180 * Math.PI / 4095.0);
                state.yGyro = ((rawSensorData.getUint8(13) & 0x7F) << 6 | (rawSensorData.getUint8(14) & 0xFC) >> 2);
                state.yGyro = (state.yGyro << 19) >> 19;
                state.yGyro *= (2048 / 180 * Math.PI / 4095.0);
                state.zGyro = ((rawSensorData.getUint8(14) & 0x03) << 11 | (rawSensorData.getUint8(15) & 0xFF) << 3 | (rawSensorData.getUint8(16) & 0xE0) >> 5);
                state.zGyro = (state.zGyro << 19) >> 19;
                state.zGyro *= (2048 / 180 * Math.PI / 4095.0);
                _this.onStateChangeCallback(state);
            };
        }
        DaydreamController.prototype.connect = function () {
            var _this = this;
            return navigator.bluetooth.requestDevice({
                filters: [{
                        name: DaydreamController.DAYDREAM_CONTROLLER_LABEL
                    }],
                optionalServices: [0xfe55]
            })
                .then(function (device) { return device.gatt.connect(); })
                .then(function (server) { return server.getPrimaryService(0xfe55); })
                .then(function (service) { return service.getCharacteristic(DaydreamController.DAYDREAM_CHARACTERISTIC_IDENTIFIER); })
                .then(function (characteristic) {
                characteristic.addEventListener("characteristicvaluechanged", _this.handleData);
                return characteristic.startNotifications();
            });
        };
        DaydreamController.prototype.onStateChange = function (onStateChangeCallback) {
            this.onStateChangeCallback = onStateChangeCallback;
        };
        return DaydreamController;
    }());
    DaydreamController.DAYDREAM_CHARACTERISTIC_IDENTIFIER = "00000001-1000-1000-8000-00805f9b34fb";
    DaydreamController.DAYDREAM_CONTROLLER_LABEL = "Daydream controller";
    DaydreamControllerTS.DaydreamController = DaydreamController;
})(DaydreamControllerTS || (DaydreamControllerTS = {}));
var DaydreamController = DaydreamControllerTS.DaydreamController;
document.getElementById("connect-daydream").addEventListener("click", function () {
    var daydreamController = new DaydreamController();
    daydreamController.onStateChange(function (state) {
        document.getElementById("state-home").innerText = "" + (state.isHomeDown ? ("Pressed") : ("Not pressed"));
        document.getElementById("state-app").innerText = "" + (state.isAppDown ? ("Pressed") : ("Not pressed"));
        document.getElementById("state-click").innerText = "" + (state.isClickDown ? ("Pressed") : ("Not pressed"));
        document.getElementById("state-xori").innerText = "" + state.xOri;
        document.getElementById("state-yori").innerText = "" + state.yOri;
        document.getElementById("state-zori").innerText = "" + state.zOri;
        document.getElementById("daydream-connection-state").innerText = "Connected";
    });
    daydreamController.connect();
});
//# sourceMappingURL=main.js.map