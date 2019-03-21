const empty = () => {}

export class Countdown {
	constructor(config) {
		let {
			deadline,
			during,
			end,
			error,
			now,
		} = config
		this.deadline = deadline
		this.during = during || empty
		this.end = end || empty
		this.error = error || empty
		this.now = now ? new Date(now) : new Date()
		this.init()
	}
	static friendly(t) {
		let d = Math.floor(t / 864e5)
		let h = Math.floor(t / 36e5 - d * 24)
		let m = Math.floor(t / 6e4 - d * 24 * 60 - h * 60)
		let s = Math.floor(t / 1e3 - d * 24 * 60 * 60 - h * 60 * 60 - m * 60)
		return `${d} ${h}:${m}:${s}`
	}
	init() {
		this.record = new Date(this.deadline)
		if(this.record < this.now) {
			this.error(this.record - this.now)
		}
		this.timer()
	}
	timer() {
		if(this.record - this.now < 1000) {
			return this.end(this.record - this.now)
		}
		setTimeout(() => {
			this.record -= 1000
			this.during(this.record - this.now)
			this.timer()
		}, 1000)
	}
}