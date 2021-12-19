import confetti from 'canvas-confetti'

// ©️ AlterClassIO https://github.com/AlterClassIO/ecommerce-nextjs-stripe-checkout/blob/main/lib/utils.js (License: MIT)
// function is adjusted, not in original form
const shootFireworks = () => {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    const ticks = 50 * -(timeLeft / duration - 1) + 60

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        ticks,
        origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.2 },
        disableForReducedMotion: true,
      })
    )
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.2 },
        disableForReducedMotion: true,
      })
    )
  }, 350)
}

const shootConfettiCorner = () => {
  const corners = [
    { origin: { x: 0, y: 0 }, angle: -45 },
    { origin: { x: 0, y: 1 }, angle: 45 },
    { origin: { x: 1, y: 0 }, angle: -135 },
    { origin: { x: 1, y: 1 }, angle: 135 },
  ]

  const randCorner = () => {
    const rand = Math.floor(Math.random() * 4)
    return corners[rand]
  }
  
  confetti(
    Object.assign({}, randCorner(), {
      spread: 90,
      zIndex: 0
    })
  )
}

export { shootFireworks, shootConfettiCorner as default, shootConfettiCorner }