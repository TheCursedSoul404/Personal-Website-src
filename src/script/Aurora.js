(() => {
    const auroraCanvas = document.getElementById("aurora");
    const auroraCtx = auroraCanvas.getContext("2d");

    function resizeAuroraCanvas() {
        auroraCanvas.width = window.innerWidth;
        auroraCanvas.height = window.innerHeight;
    }
    resizeAuroraCanvas();
    window.addEventListener("resize", resizeAuroraCanvas);

    const worker = new Worker("script/AuroraWorker.js");

    function drawFrame(time) {
        worker.postMessage({
            width: auroraCanvas.width,
            height: auroraCanvas.height,
            time,
            segLength: 10,
        });
    }

    worker.onmessage = function (e) {
        const { segments } = e.data;

        auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);

        const grad = auroraCtx.createLinearGradient(
            0,
            0,
            auroraCanvas.width,
            auroraCanvas.height
        );

        grad.addColorStop(0, "rgba(0,255,200,0.15)");
        grad.addColorStop(0.5, "rgba(0,180,255,0.4)");
        grad.addColorStop(1, "rgba(255,0,255,0.15)");

        auroraCtx.strokeStyle = grad;
        auroraCtx.globalAlpha = 0.85;
        auroraCtx.lineCap = "round";

        for (const seg of segments) {
            auroraCtx.lineWidth = seg.width;
            auroraCtx.beginPath();
            auroraCtx.moveTo(seg.x, seg.y1);
            auroraCtx.lineTo(seg.x + 10, seg.y2);
            auroraCtx.stroke();
        }

        requestAnimationFrame(drawFrame);
    };

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            requestAnimationFrame(drawFrame);
        }, 1000);
    });
})();