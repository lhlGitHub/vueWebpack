//v1.2

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const observe = (obj, prop, fn = n => {}) => {
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

export const Tween = {
	easeOut(t, b, c, d) {
	    return -c * (t /= d) * (t - 2) + b
	},
	easeOutQuart(t, b, c, d) {
	    return -c * ((t = t/d - 1) * t * t * t - 1) + b
	},
	Linear(t, b, c, d) {
	    return c * t / d + b
	}
}

export const Cset = (A, S) => Math.abs(A - S)// 取较大数与较小数的差，位置不影响，类似补集

export const copyProp = (o, t) => Object.keys(o).forEach(e => t[e] = o[e])

export class Sequence {
	constructor(params = {}) {
		const DEFAULT_OPTIONS = {
			speed			: 200, // 初速度
			acceleration	: 4, // 加速的倍率
			n				: 5, // 表示数量 0-5
			plan			: [1000, 1000, 1000], // 耗时控制  加速阶段，匀速阶段，减速阶段
			easing			: 'easeOutQuart' //缓动函数
		}
		copyProp({...DEFAULT_OPTIONS, ...params}, this)
		this.defaultSpeed	= this.speed
		this.T 				= this.n
		this.state 			= null
		this.stopId 		= 0 // 停止id
		this.node 			= {} // 关键节点事件
		this.ing			= false
	}
	on(state, fn = n => {}) {
		this.node[state] ? this.node[state].push(fn) : (this.node[state] = [fn])
	}
	emit(state) {
		if(!this.ing) return
		this.state = state
	}
	wait(state) {
		return new Promise(resolve => this.state === state ? resolve() : this.on(state, resolve))
	}
	shift(inject = n => n) {
		// inject 注入对结果的修改
		let step = this.acceleration
		let time = this.plan[0] / step
		// 加速 acceleration 幅度越大,step 需要越多才不卡顿
		while(--step){
			(step => {
				setTimeout(() => {
					let [t, b, c, d] = [time * (step + 1), 0, this.defaultSpeed, this.plan[0]]
					this.speed = inject(Tween[this.easing](t, b, c, d))
				}, time * step)
			})(step)
		}
	}
	callback(state) {
		this.node[state] ? this.node[state].forEach(fn => fn(this.n)) : null
	}
	async factory(n) {
		if(this.state === 'finalize' && this.n == this.stopId) {
			this.emit('stop')
			this.ing = false
			return
		}
		if(this.state === 'stop') return
		await sleep(this.speed)
		// 修饰为周期流
		if(!this.ing) return 
		this.n = (this.n + 1) % (this.T + 1)
		this.factory()
	}
	async start(n = this.T) {
		if(this.ing) return 
		this.ing = true
		
		observe(this, 'state', state => this.callback(state))

		observe(this, 'n', n => {
			this.callback('flow')
		})
		this.emit('start')
		this.emit('initialize')
		this.n = n

		this.factory()

		await sleep(this.plan[0])
		
		this.emit('accelerate')
		this.shift(Cset.bind(null, this.defaultSpeed + this.defaultSpeed / this.acceleration))

		await sleep(this.plan[1])
		this.emit('constant')
		console.log(this.plan)
	}
	stop(control = true){
		if(control) this.emit('stop')
		this.ing = false
	}
	async stopAt(n = 0) {
		this.stopId = n

		await this.wait('constant')

		this.emit('decelerate')
		this.shift()
		
		await sleep(this.plan[2])
		this.emit('finalize')
	}
}