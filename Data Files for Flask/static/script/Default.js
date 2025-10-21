document.querySelectorAll("button[data-url]").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = btn.dataset.url;
  });
});