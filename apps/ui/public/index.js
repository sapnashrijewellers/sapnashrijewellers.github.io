let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent default prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show a custom button or toast
  const installBtn = document.createElement("button");
  installBtn.textContent = "Install Sapna Shri Jewellers App";
  installBtn.style.position = "fixed";
  installBtn.style.bottom = "20px";
  installBtn.style.right = "20px";
  installBtn.style.padding = "10px 20px";
  installBtn.style.background = "#FFD700";
  installBtn.style.color = "#000";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "8px";
  installBtn.style.zIndex = "9999";
  document.body.appendChild(installBtn);

  installBtn.addEventListener("click", async () => {
    installBtn.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the install prompt`);
    deferredPrompt = null;
  });
});
