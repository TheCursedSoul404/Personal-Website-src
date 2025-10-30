(() => {
    const auroraCanvas = document.getElementById("aurora");
    const auroraCtx = auroraCanvas.getContext("2d");

    function resizeAuroraCanvas() {
    auroraCanvas.width = window.innerWidth;
    auroraCanvas.height = window.innerHeight;
    }
    resizeAuroraCanvas();
    window.addEventListener("resize", resizeAuroraCanvas);

    // --- simple smooth pseudo-noise ---
    function smoothNoise(x) {
    return (
        Math.sin(x * 0.8) * 0.5 +
        Math.sin(x * 0.2) * 0.3 +
        Math.sin(x * 0.05) * 0.2
    );
    }

    // --- main draw loop ---
    function drawAuroraLine(time) {
    auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);

    // soft gradient coloring
    const grad = auroraCtx.createLinearGradient(0, 0, auroraCanvas.width, auroraCanvas.height);
    grad.addColorStop(0, "rgba(0,255,200,0.15)");
    grad.addColorStop(0.5, "rgba(0,180,255,0.4)");
    grad.addColorStop(1, "rgba(255,0,255,0.15)");

    auroraCtx.strokeStyle = grad;
    auroraCtx.globalAlpha = 0.85;
    auroraCtx.lineCap = "round";

    const segLength = 10; // pixel chunk size along x
    const baseY = auroraCanvas.height / 2;

    // slow down time dramatically (75% slower)
    const t = time * 0.00005;

    // Draw segmented path
    for (let x = 0; x < auroraCanvas.width; x += segLength) {
        const y1 =
        baseY +
        smoothNoise(x * 0.01 + t * 3) * 160 +
        smoothNoise(x * 0.003 + t) * 100;

        const y2 =
        baseY +
        smoothNoise((x + segLength) * 0.01 + t * 3) * 80 +
        smoothNoise((x + segLength) * 0.003 + t) * 50;

        // Local width varies slowly across x and time
        const width =
        2 +
        (Math.sin(x * 0.002 + t * 0.8) + smoothNoise(x * 0.0008 + t * 0.3)) * 50;

        auroraCtx.lineWidth = Math.max(25.0, width);

        auroraCtx.beginPath();
        auroraCtx.moveTo(x, y1);
        auroraCtx.lineTo(x + segLength, y2);
        auroraCtx.stroke();
    }

    // subtle glow on sides
    auroraCtx.shadowColor = "rgba(0,255,200,0.25)";
    auroraCtx.shadowBlur = 80;

    requestAnimationFrame(drawAuroraLine);
    }

    requestAnimationFrame(drawAuroraLine);
})();