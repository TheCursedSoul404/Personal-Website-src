// Purpose: Animate a pixelated background gradient to smoothly transition
// through day/night phases (midnight → sunrise → midday → sunset → midnight).
// We use JavaScript instead of pure CSS because many browsers treat
// gradients as static images and won't interpolate them smoothly.
// The "pixel effect" is created by rendering the gradient at a very low
// resolution on a <canvas> and scaling it up with image-rendering: pixelated.



// ================== Canvas Setup, initial variable values, and general helper functions ========================

// _______________ Variables and Constants _________________________
(() => {
  const canvas = document.getElementById("Gradient_Shifter");
  const ctx = canvas.getContext("2d");
  const pixelSize = 30;                                       // Internal resolution of the canvas.
  canvas.width = pixelSize;                                   // Smaller values → chunkier pixels when scaled to full screen.
  canvas.height = pixelSize;                            
  const duration = 60000;                                     // Length of one full cycle is measured in milliseconds (60,000ms = 60s = 1 day/night cycle here).
  let backgroundMode = "cycle";                               // backgroundMode = "midnight" | "morning" | "twilight"  are fixed gradients; cycle is the normal animation.

  const gradients = [                                             // Key gradient checkpoints (top + bottom color); Each pair represents a phase of the sky.
    ["rgba(8, 16, 43, 1)", "rgba(2, 6, 18, 1)"],       // Aurora Midnight
    ["rgba(25, 255, 168, 1)", "rgba(4, 63, 102, 1)"],  // Emerald Veil
    ["rgba(46, 178, 255, 1)", "rgba(0, 45, 104, 1)"],  // Polar Dawn
    ["rgba(168, 105, 255, 1)", "rgba(32, 11, 83, 1)"], // Violet Drift
    ["rgba(8, 16, 43, 1)", "rgba(2, 6, 18, 1)"]        // Back to Aurora Midnight
  ];

  // _______________ Helper Functions ______________________________


  function blendRGB(c1, c2, t) {                              // Blend two RGB colors by percentage t (0 → start, 1 → end).
    const r = Math.round(c1[0] + t * (c2[0] - c1[0]));
    const g = Math.round(c1[1] + t * (c2[1] - c1[1]));
    const b = Math.round(c1[2] + t * (c2[2] - c1[2]));
    return [r, g, b];                                         // return as [r,g,b] so we can reuse in pixel painting
  }

  function parseRGB(rgb) {                                    // Convert a CSS "rgb(r,g,b)" string into [r,g,b].
    return rgb.match(/\d+/g).map(Number);
  }

  function getModeColors(mode) {
    switch (mode) {
      case "midnight": return [
        parseRGB("rgba(8, 16, 43, 1)"),
        parseRGB("rgba(2, 6, 18, 1)")
      ];
      case "emerald": return [
        parseRGB("rgba(25, 255, 168, 1)"),
        parseRGB("rgba(4, 63, 102, 1)")
      ];
      case "polar": return [
        parseRGB("rgba(46, 178, 255, 1)"),
        parseRGB("rgba(0, 45, 104, 1)")
      ];
      case "twilight": return [
        parseRGB("rgba(168, 105, 255, 1)"),
        parseRGB("rgba(32, 11, 83, 1)")
      ];
      case "cycle":
        const now = Date.now();
        const time = (now % duration) / duration;
        const step = 1 / (gradients.length - 1);
        const index = Math.floor(time / step);
        const t = (time - index * step) / step;
        const [c1Start, c2Start] = gradients[index];
        const [c1End, c2End] = gradients[index + 1];
        const blended1 = blendRGB(parseRGB(c1Start), parseRGB(c1End), t);
        const blended2 = blendRGB(parseRGB(c2Start), parseRGB(c2End), t);
        return [blended1, blended2];
      default:
        return [parseRGB("rgb(0, 0, 0)"), parseRGB("rgb(0, 0, 0)")];          // fallback if somehow mode is invalid
    }
  }

  function getCurrentColors() {
    if (backgroundMode === "cycle") {
      const now = Date.now();
      const time = (now % duration) / duration;
      const step = 1 / (gradients.length - 1);
      const index = Math.floor(time / step);
      const t = (time - index * step) / step;

      const [c1Start, c2Start] = gradients[index];
      const [c1End, c2End] = gradients[index + 1];
      const blended1 = blendRGB(parseRGB(c1Start), parseRGB(c1End), t);
      const blended2 = blendRGB(parseRGB(c2Start), parseRGB(c2End), t);

      return [blended1, blended2];
    } else {
      return getModeColors(backgroundMode);
    }
  }

  function drawGradient(blended1, blended2) {
    const img = ctx.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      const p = y / canvas.height;                                            // top → bottom interpolation
      const color = blendRGB(blended1, blended2, p);
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        img.data[idx] = color[0];
        img.data[idx + 1] = color[1];
        img.data[idx + 2] = color[2];
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  // __________________________________________________________________________________________________________________

  // ======================= Below is the function that orchastrates the animation ====================================

  function animate() {
    let blended1, blended2;

    if (transitionActive) {                                           // Handle transition if active
      const elapsed = Date.now() - transitionStart;
      const t = Math.min(elapsed / transitionDuration, 1);            // clamp 0-1

      blended1 = blendRGB(transitionFrom[0], transitionTo[0], t);
      blended2 = blendRGB(transitionFrom[1], transitionTo[1], t);

      if (t >= 1) {                                                   // When done, finalize the mode
        transitionActive = false;
        backgroundMode = nextMode;
      }
    }

    else if (backgroundMode === "cycle") {                            // Normal behavior if not transitioning
      const now = Date.now();
      const time = (now % duration) / duration;
      const step = 1 / (gradients.length - 1);
      const index = Math.floor(time / step);
      const t = (time - index * step) / step;

      const [c1Start, c2Start] = gradients[index];
      const [c1End, c2End] = gradients[index + 1];
      blended1 = blendRGB(parseRGB(c1Start), parseRGB(c1End), t);
      blended2 = blendRGB(parseRGB(c2Start), parseRGB(c2End), t);
    }

    else {                                                           // Fixed Background
      [blended1, blended2] = getModeColors(backgroundMode);
    }

    drawGradient(blended1, blended2);
    requestAnimationFrame(animate);
  }

  // _____________________________________________________________________________________________________________________

  // ============ Below are the variables and functions that control the transition phase between mode shifts ============

  let transitionActive = false;
  let transitionStart = 0;
  let transitionDuration = 2000;
  let transitionFrom = null;
  let transitionTo = null;
  let nextMode = "cycle";                                          // target mode to switch to after transition

  function transitionToMode(mode) {
    if (transitionActive) return;

    const [currentTop, currentBottom] = getCurrentColors();
    const [targetTop, targetBottom] = getModeColors(mode);

    transitionFrom = [currentTop, currentBottom];
    transitionTo = [targetTop, targetBottom];
    nextMode = mode;

    transitionActive = true;
    transitionStart = Date.now();
  }

  function setBackgroundMode(mode) {
    console.log("Switching background to:", mode);
    backgroundMode = mode;
  }

  // _______________________________________________________________________________________________________________

  // ======================== initial page background mode and the button hookups ==================================

  document.addEventListener('DOMContentLoaded', () => {
    backgroundMode = "midnight";

    document.getElementById("Midnight-btn").addEventListener("click", () => transitionToMode("midnight"));
    document.getElementById("Emerald-Veil").addEventListener("click", () => transitionToMode("emerald"));
    document.getElementById("Polar-Dawn").addEventListener("click", () => transitionToMode("polar"));
    document.getElementById("Violet-Drift").addEventListener("click", () => transitionToMode("twilight"));
    document.getElementById("Cycle-btn").addEventListener("click", () => transitionToMode("cycle"));
  });

  // ________________________________________________________________________________________________________________

  animate();                                                        // make sure to call the function if you want it used!  - Levi
  window.getCurrentGradientColors = getCurrentColors;
})();