import { isObject, isFunction, isString, isNumber, isEmptyString, isValid } from './validator';
import { typeLimit, hasElement } from './decorator';

const operateDOM = {
	html(el, fragment) {
		el.innerHTML = fragment;
	},
	append(el, fragment) {
		el.insertAdjacentHTML('beforeend', fragment);
	},
	prepend(el, fragment) {
		el.insertAdjacentHTML('afterbegin', fragment);
	}
}

class Di {}

Di.prototype = new Array();

export class Query extends Di {
	constructor(...arg) {
		super();
		let wrap = [...arg].filter(e => e);// 初步过滤 无效值
		wrap.__proto__ = this;
		return wrap;
	}
	static each(fn) {
		this::Array.prototype.forEach(fn);
		return this;
	}
	@typeLimit(isValid)
	static DOMDirective(content, controller) {

		if(content instanceof Query) {
			let fragment = '';
			content.forEach(dom => fragment += dom.outerHTML);
			return this[controller](fragment);
		}
		return this::Query.each(el => content.outerHTML ? operateDOM[controller](el, content.outerHTML) : operateDOM[controller](el, content));
	}
	@typeLimit(isValid, isString)
	find(select) {
		let els = new Query();
		this.forEach(el => els.push(...el.querySelectorAll(select)));
		return els;
	}
	@typeLimit(isValid, isString)
	not(select) {
		let arr = Array.from(this);
		document.querySelectorAll(select).forEach(n => {
			arr = arr.filter(el => el != n);
		});
		return new Query(...arr);
	}
	@hasElement
	siblings() {
		return new Query(...[...this[0].parentNode.children].filter(child => child !== this[0]));
	}
	@typeLimit(isNumber)
	@hasElement
	eq(index) {
		return (index < this.length) ? new Query(this[index]) : new Query();
	}
	
	first(){
		return this.eq(0);
	}
//	 TODO
	each(fn){
		return this::Query.each(fn);
	}
	fadeIn(time = 300){
		return this::Query.each(el => {
			el.style.opacity = '0';
			el.style.transition = 'opacity ' + time + 'ms';
			el.style.opacity = '1';
			el.style.display = 'block'
		});
	}
	fadeOut(time = 300){
		return this::Query.each(el => {
			el.style.transition = 'opacity ' + time + 'ms';
			el.style.opacity = '0';
			setTimeout(() => {
				el.style.display = 'none'
			},time)
		});
	}
	
	
	@hasElement
	index() {
		let index;
		this.parent().children().forEach((e, i) => {
			if(e === this[0]) index = i;
		});
		return index;
	}
	@hasElement
	parent() {
		return new Query(this[0].parentNode);
	}
	@hasElement
	children() {
		return new Query(...this[0].children);
	}
	@hasElement
	prev(){
		return new Query(this[0].previousElementSibling);
	}
	@hasElement
	next(){
		return new Query(this[0].nextElementSibling);
	}
	@typeLimit(isValid, isString)
	@hasElement
	addClass(classList) {
		return this::Query.each(el => el.classList.add(...classList.split(' ')));
	}
	@typeLimit(isValid, isString)
	@hasElement
	removeClass(classList) {
		return this::Query.each(el => el.classList.remove(...classList.split(' ')));
	}
	@typeLimit(isValid, isString)
	@hasElement
	toggleClass(classList) {
		return this::Query.each(el.classList.toggle(...classList.split(' ')));
	}
	@typeLimit(isValid, isString)
	@hasElement
	hasClass(className) {
		return this[0].classList.contains(className);
	}
	show(display = 'block') {
		return this::Query.each(el => el.style.display = display);
	}
	hide() {
		return this::Query.each(el => el.style.display = 'none');
	}
	toggle(display = 'block') {
		return this::Query.each(el => el.style.display = (el.style.display == 'none') ? display : 'none');
	}
	css(key, value) {
		if(value === undefined) return window.getComputedStyle(this[0], null)[key];

		if(isObject(key)) {
			Object.keys(key).forEach(k => this.css(k, key[k]));
			return this;
		}

		return this::Query.each(el => el.style[key] = value);
	}
	@hasElement
	attr(...arg) {
		return arg.length > 1 ? this::Query.each(el => el.setAttribute(...arg)) : this[0].getAttribute(...arg);
	}
	removeAttr(attrName) {
		return this::Query.each(el => el.removeAttribute(attrName));
	}
	@hasElement
	val(value) {
		return value ? this::Query.each(el => el.value = value) : this[0].value;
	}
	@hasElement
	html(content) {
		if(content === undefined) return this[0].innerHTML;
		return this::Query.DOMDirective(content, 'html');
	}
	append(content) {
		return this::Query.DOMDirective(content, 'append');
	}
	prepend(content) {
		return this::Query.DOMDirective(content, 'prepend');
	}
	@typeLimit(isValid, isString)
	@hasElement
	on(eventName, handler = e => {}) {
		return this::Query.each(el => {
//			if(Array.isArray(el[eventName])){
//				if(el[eventName].includes(handler)) {
//					console.log('includes handler')
//				} else {
//					el[eventName].push(handler)
//					
//					el.addEventListener(eventName, handler);
//				}
//			} else {
//				el[eventName] = [handler]
//				
//				el.addEventListener(eventName, handler);
//			}
			
			
			Array.isArray(el[eventName]) ? el[eventName].push(handler) : (el[eventName] = [handler]);
			
			el.addEventListener(eventName, handler);
		});
	}
	@typeLimit(isValid, isString)
	@hasElement
	// TODO
	off(eventName) {
		return this::Query.each(el => {
			if(Array.isArray(el[eventName])) {
				el.handler.forEach(handler => el.removeEventListener(eventName, handler));
			}
		});
	}
	@typeLimit(isValid)
	@hasElement
	trigger(eventName, data = {}) {
		const event = new CustomEvent(eventName, {
			detail: data
		});
		return this::Query.each(el => el.dispatchEvent(event));
	}
}

export const q = select => {
	if(select instanceof Query) return select;
	
	if(select instanceof NodeList) return new Query(...select);

	if(!isValid(select) || isObject(select) ) return new Query();
	
	if(select === document ||  select === window) return new Query(select);

	if(isFunction(select)) return document.addEventListener('DOMContentLoaded', select, false);

	return select.outerHTML ? new Query(select) : new Query(...document.querySelectorAll(select));
}