const DEFAULT_FN = n => n
const attr = (el, prop) => el.getAttribute(prop) || ''
const validate = (unit, fn = DEFAULT_FN, notify = window.alert, pass = DEFAULT_FN, forbid = DEFAULT_FN, warn = DEFAULT_FN) => {
	let value = fn(unit.el.value, unit)
	let {
		required,
		pattern,
		not,
		error
	} = unit
	let rv = !(new RegExp(pattern)).test(value)

	if(required && (!value || value === required)) {
		notify(required)
		return false
	}
	if((required && (pattern && rv)) || (pattern && value && rv)) {
		notify(error)
		return false
	}
	if((required && (not && not === value)) || (not && value && not === value)) {
		notify(forbid(not))
		return false
	}

	pass(value, unit)
	return true
}

const buildKeyValue = (vs, fn = DEFAULT_FN) => {
	let data = {}
	vs.forEach(o => data[o.ok] = fn(o.el.value, o))
	return data
}

export class OK {
	constructor(el) {
		this.el = el
		this.ok = attr(el, 'ok')
		this.not = attr(el, 'ok-not')
		this.error = attr(el, 'ok-error')
		this.pattern = attr(el, 'ok-pattern')
		this.required = attr(el, 'ok-required')
	}
	static test(scope, config = {}) {
		let vs = []
		let {
			pass,
			input,
			output,
			notify,
			not,
			error
		} = config
		const els = document.querySelectorAll(`[ok-form="${scope}"]`)[0]
		console.log('ok-el',els.querySelectorAll('[ok]'))
		return new Promise((resolve, reject) => {
			Array.from(els.querySelectorAll('[ok]')).forEach(el => vs.push(new OK(el)))
			for(let i = 0, l = vs.length; i < l; i++) {
				if(!validate(vs[i], input, notify, pass, not, error)) return reject(vs[i])
			}
			resolve(buildKeyValue(vs, output))
		})
	}
}