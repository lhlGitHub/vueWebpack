window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

const DEFAULT_FN = n => n

const TWEEN = {
	Linear(t, b, c, d) {
		return c * t / d + b
	},
	QuartEaseInOut(t, b, c, d) {
        if((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
  		return -c / 2 * ((t -= 2) * t * t * t - 2) + b
	}
}

export const Tween = (from = 0, to = 0, duration = 0, fn = DEFAULT_FN, easing = 'Linear') => {
	return new Promise(resolve => {
		let t = 0
		let d = Math.ceil(duration / 17)
		const step = () => {
			let n = TWEEN[easing](t, from, to - from, d)
			++t
			if(t <= d) {
				fn(n, this)
				requestAnimationFrame(step)
			} else {
				fn(to, this)
				resolve()
			}
		}
		step()
	})
}

