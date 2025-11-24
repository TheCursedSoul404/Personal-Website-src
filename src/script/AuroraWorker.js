
function smoothNoise(x) {
    return (
        Math.sin(x * 0.8) * 0.5 +
        Math.cos(x * 0.2) * 0.3 +
        Math.tan(x * 0.005) * 0.02
    );
}

onmessage = function (e) {
    const { width, height, time, segLength } = e.data;

    const baseY = height / 2;
    const t = time * 0.00005;

    const segments = [];

    for (let x = 0; x < width; x += segLength) {
        const y1 =
            baseY +
            smoothNoise(x * 0.01 + t * 3) * 160 +
            smoothNoise(x * 0.003 + t) * 100;

        const y2 =
            baseY +
            smoothNoise((x + segLength) * 0.01 + t * 3) * 80 +
            smoothNoise((x + segLength) * 0.003 + t) * 50;

        const widthVal =
            2 +
            (Math.sin(x * 0.002 + t * 0.8) +
                smoothNoise(x * 0.0008 + t * 0.3)) * 50;

        segments.push({
            x,
            y1,
            y2,
            width: Math.max(25.0, widthVal),
        });
    }

    postMessage({ segments });
};