//
(() => {
    const auroraCanvas = document.getElementById("aurora");
    const auroraCtx = auroraCanvas.getContext("2d");

    function resizeAuroraCanvas() {
    auroraCanvas.width = window.innerWidth;
    auroraCanvas.height = window.innerHeight;
    }
    resizeAuroraCanvas();
    window.addEventListener("resize", resizeAuroraCanvas);

    function smoothNoise(x) {   // the function that uses trig functions to determine aurora behavior like amplitude
    return (
        Math.sin(x * 0.8) * 0.5 +
        Math.cos(x * 0.2) * 0.3 +
        Math.tan(x * 0.005) * 0.02 
    );
    }

    function drawAuroraLine(time) {
        auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);

        const grad = auroraCtx.createLinearGradient(0, 0, auroraCanvas.width, auroraCanvas.height);     // colors for the gradient, want it to shift colors
        grad.addColorStop(0, "rgba(0,255,200,0.15)");
        grad.addColorStop(0.5, "rgba(0,180,255,0.4)");
        grad.addColorStop(1, "rgba(255,0,255,0.15)");

        auroraCtx.strokeStyle = grad;
        auroraCtx.globalAlpha = 0.85;
        auroraCtx.lineCap = "round";

        const segLength = 10;
        const baseY = auroraCanvas.height / 2;
        const t = time * 0.00005;

        for (let x = 0; x < auroraCanvas.width; x += segLength) {
            const y1 =
            baseY +
            smoothNoise(x * 0.01 + t * 3) * 160 +
            smoothNoise(x * 0.003 + t) * 100;

            const y2 =
            baseY +
            smoothNoise((x + segLength) * 0.01 + t * 3) * 80 +
            smoothNoise((x + segLength) * 0.003 + t) * 50;

            const width =
            2 +
            (Math.sin(x * 0.002 + t * 0.8) + smoothNoise(x * 0.0008 + t * 0.3)) * 50;

            auroraCtx.lineWidth = Math.max(25.0, width);

            auroraCtx.beginPath();
            auroraCtx.moveTo(x, y1);
            auroraCtx.lineTo(x + segLength, y2);
            auroraCtx.stroke();
        }

        auroraCtx.shadowColor = "rgba(0,255,200,0.25)";
        auroraCtx.shadowBlur = 80;   
        
        requestAnimationFrame(drawAuroraLine);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const delayMs = 1000;
        setTimeout(() => {
            requestAnimationFrame(drawAuroraLine);
        }, delayMs);
    });
})();