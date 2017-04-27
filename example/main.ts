import DaydreamController = DaydreamControllerTS.DaydreamController;
import IDaydreamControllerState = DaydreamControllerTS.IDaydreamControllerState;

document.getElementById("connect-daydream").addEventListener("click", function () {

    let daydreamController: DaydreamController = new DaydreamController();

    daydreamController.onStateChange((state: IDaydreamControllerState) => {

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
