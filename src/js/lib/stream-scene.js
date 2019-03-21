const DEFAULT_FN = n => n
const DEFAULT_OPTIONS = {
	auto: false,
	interval: 3000,
	loop: true,
	n: 1,
	now: 0,
	goto: 0,
	init: DEFAULT_FN
}

export const copyProp = (o, t) => Object.keys(o).forEach(e => t[e] = o[e])

export const observe = (obj, prop, fn = DEFAULT_FN) => {
	let oldValue
	Object.defineProperty(obj, prop, {
		set(newValue) {
			oldValue = newValue
			fn(newValue)
		},
		get() {
			return oldValue
		}
	})
}

export class Guide {
	constructor(...arg) {
		let [config = {}, fn = DEFAULT_FN] = arg
		copyProp({ ...DEFAULT_OPTIONS,
			...config
		}, this)
		
		this.writable = true
		
		this.queue && this.queue.length ? this.queue.push(fn) : (this.queue = [fn])
		
		let n = this.n
		observe(this, 'n', n => {
			this.goto = n
			this::Guide.being()
			this.now = this.goto
		})
		
		this.T = n
		this.n = this.goto
		this.checkAuto()
		
		this.init = false
	}
	static being() {
		this[this.init ? 'init' : 'callback'](this)
	}
	checkAuto() {
		if(this.auto) {
			setTimeout(() => {
				this.next()
				this.checkAuto()
			}, this.interval)
		}
	}
	callback(){
		this.queue.forEach(fn => fn(this))
	}
	go(n = this.n) {
		if(!this.writable) return
		this.n = n
	}
	next() {
		if(!this.writable || !this.loop && this.n === this.T) return
		this.n = (this.n + 1) % (this.T + 1)
	}
	prev() {
		if(!this.writable || !this.loop && this.n < 1) return
		this.n = this.n < 1 ? this.T : this.n - 1
	}
	enable(){
		this.writable = true
	}
	freeze(){
		this.writable = false
	}
}

export class Scene {
	constructor() {}
	static my(...arg) {
		return new Guide(...arg)
	}
	static slide(container, config = {}, fn = DEFAULT_FN) {
		const els = document.querySelectorAll(`${container} ${config.dom}`)
		config.n = els.length - 1
		
		const callback = slide => {
			slide.els = els
			fn(slide.els[slide.now], slide.els[slide.goto], slide)	
		}
		config.init = callback
		return new Guide(config, callback)
	}
}