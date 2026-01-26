import confetti from "canvas-confetti";
export function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });

  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { x: 0.2, y: 0.4 },
    });
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { x: 0.8, y: 0.4 },
    });
  }, 300);
}
