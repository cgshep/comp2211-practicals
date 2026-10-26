"use strict";
document.querySelectorAll(".copy").forEach(button => {
  button.addEventListener("click", async () => {
    const code = button.closest(".codebox").querySelector("code");
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = "Code copied.";
      button.textContent = "Copied";
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Code selected. Press Ctrl+C or Command+C to copy.";
      button.textContent = "Selected";
    }
    setTimeout(() => { button.textContent = "Copy"; }, 1800);
  });
});
