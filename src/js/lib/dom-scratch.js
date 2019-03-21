import { q } from './mJQ'

const DEFAULT_OPTIONS = {
	el			: 'body', // 容器
	cover		: '', //刮卡涂层
	degree		: 0.1, //刮去百分之几完成刮卡
	radius		: 15, // 半径
	init(){},
	touchstart(){},
	touchmove(){},
	touchend(){},
	finish(){}	//完成后回调
}

export const copyProp = (o, t) => Object.keys(o).forEach(e => t[e] = o[e])

export class Scratch {
	constructor(params = {}){
		copyProp({...DEFAULT_OPTIONS, ...params}, this)
		this.allowStart = false
		this.allowMove = false
		this.img = new Image()
		this.img.crossOrigin = '*'
		this.img.src = this.cover
		this.img.addEventListener('load', () => {
			this.allowStart = true
			this.allowMove = true
			this.render()
			this.init()
		})
	}
	reinit(){
		this.render()
		this.init()
		this.allowMove = true
	}
	render(){
		let container = q(this.el)
		this.canvas = document.createElement("canvas")
		this.ctx = this.canvas.getContext('2d')
		
		container[0].innerHTML = ''
		container[0].appendChild(this.canvas)
		
		this.w = this.canvas.width
		this.h = this.canvas.height
		
		this.area = this.w * this.h
		this.ctx.drawImage(this.img, 0, 0, this.w, this.h)
		this.ctx.globalCompositeOperation = 'destination-out'
			
		q(this.canvas)
		.on('touchstart', e => {
			if(!this.allowStart) return
			this.box = this.canvas.getBoundingClientRect()
			this.touchstart(e)
		})
		.on('touchmove', e => {
			this.touchmove(e)
			if(!this.allowMove) return
			let finger = e.touches[0]
			let {
				clientX,
				clientY
			} = finger
			let x = clientX - this.box.left
			let y = clientY - this.box.top
			this.ctx.beginPath()
			this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, 0)
			this.ctx.fill()
			e.preventDefault()
		})
		.on('touchend', e => {
			this.checkArea()
			this.touchend(e)
		})
	}
	checkArea(){
		if(!this.allowStart) return
		if(!this.allowMove) return
		let data = this.ctx.getImageData(0, 0, this.w, this.h).data
		let scrapeNum = 0;
		for(var i = 3, len = data.length; i < len; i += 4) {
			if(data[i] === 0) {
				scrapeNum++
			}
		}
		if(scrapeNum > this.area * this.degree) {
			this.ctx.clearRect(0, 0, this.w, this.h)
			this.allowStart = false
			this.allowMove = false
			this.finish()
		}
	}
}