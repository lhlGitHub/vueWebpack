/*http://www.qk123.cn:8888/qk/Api.git*/
// v2.22
import { log } from './helper/log'

const REGEXP_URL = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
//const REGEXP_URL = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
const DEFAULT_OPTIONS = {
	domain: window.location.href,
	methods: 'GET',
	dataType: 'json',
	timeOut: 3000,
	useMock: false,
	sleep: false, //接口延迟返回
	input: {},
	mock: {},
	jsonpCallback: 'callback',
	jsonpCallbackId: null,
	withCredentials: false,
	urlModel: 0,
	debug: false
	// url 拼接模式
	// 0: domain + namespace => alike router 类似路由的形式组织
	// 1: just domain
} //默认配置

const generateCallback = () => {
	return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`
}

const sleep = (time = DEFAULT_OPTIONS.timeOut) => {
	return new Promise(resolve => setTimeout(resolve, time))
}

const removeScript = (id) => {
	let script = document.getElementById(id)
	document.getElementsByTagName('head')[0].removeChild(script)
}

const clearFunction = (functionName) => {
	window[functionName] = undefined
}

const obj2formData = obj => {
	let data = new FormData()
	Object.keys(obj).forEach(key => {
		data.append(key, obj[key])
	})
	return data
}

const Api = ((document) => {
	let apiSet = {} //请求接口的集合
	let mirrorSet = {} //define集合
	let globalConfig = {}
	let util = {
		ajax(entity) {
			return new Promise((resolve, reject) => {
				let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject

				let url = entity.xhr.url
				let queryString = entity.xhr.queryString

				queryString = (entity.method === 'POST') ? JSON.stringify(queryString) : queryString
				queryString = queryString.slice(1)
				entity.debug::log('===>', url, '===>', queryString)
				xhr.open(entity.methods, url, true)
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
				xhr.withCredentials = entity.xhr.withCredentials
				xhr.send(queryString)
				xhr.onreadystatechange = () => {
					if(xhr.readyState == 4) {
						if(xhr.status == 200) {
							let rep = xhr.response
							entity.debug::log(rep)
							if(typeof rep !== 'object') {
								rep = JSON.parse(rep)
							}
							resolve(rep)
						} else {
							reject(xhr)
						}
					}
				}
				xhr.onerror = () => {
					reject(entity.namespace + ': Network Error')
				}

				xhr.timeOut = entity.timeOut
				if(xhr.timeOut) {
					xhr.ontimeout = () => {
						reject(entity.namespace + ': timeOut ')
					}
				}
			})
		},
		stream(entity) {
			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest()

				let url = entity.xhr.url
				let formData = obj2formData(entity.input)
				xhr.withCredentials = entity.xhr.withCredentials
				// 此处 设定为 ture 为异步
				xhr.open(entity.methods, url, true)
				xhr.send(formData)
				xhr.onreadystatechange = () => {
					if(xhr.readyState == 4) {
						if(xhr.status == 200) {
							let rep = xhr.response
							if(typeof rep !== 'object') {
								rep = JSON.parse(rep)
							}
							resolve(rep)
						} else {
							reject(xhr)
						}
					}
				}
				xhr.onerror = () => {
					reject(entity.namespace + ': Network Error')
				}

			})
		},
		jsonp(entity) {
			return new Promise((resolve, reject) => {
				const callbackID = entity.jsonpCallbackId || generateCallback()
				const jsonpCallback = entity.jsonpCallback
				let timeOutId

				let url = entity.xhr.url
				let queryString = entity.xhr.queryString
				entity.debug::log(url + queryString)
				window[callbackID] = (response) => {
					resolve(response)

					if(timeOutId) clearTimeout(timeOutId)

					removeScript(callbackID)
					clearFunction(callbackID)
				}

				const script = document.createElement('script')
				url += queryString
				url += (/\?/.test(url)) ? '&' : '?'

				script.setAttribute('src', `${url}${jsonpCallback}=${callbackID}`)
				script.id = callbackID
				document.getElementsByTagName('head')[0].appendChild(script)
				timeOutId = setTimeout(() => {
					reject(`JSONP request to ${url} timed out`)
					clearFunction(callbackID)
					removeScript(callbackID)
				}, entity.timeOut)
			})
		}
	}
	let set = namespace => (namespace ? { ...apiSet[namespace]
	} : {})
	// 配置全局请求
	let config = (userConfig) => {
		globalConfig = { ...globalConfig,
			...userConfig
		}
	}
	// 单个请求接口混入
	let mixins = (namespace, mixinsConfig) => {
		apiSet[namespace] = { ...apiSet[namespace],
			...mixinsConfig
		}
		apiSet[namespace].debug::log({ ...apiSet[namespace],
			...mixinsConfig
		})
	}
	// 定义一个请求接口
	let define = (namespace = '', userConfig = {}) => {
		mirrorSet[namespace] = userConfig
		return apiSet[namespace] = {
			namespace,
			...DEFAULT_OPTIONS,
			...globalConfig,
			...userConfig
		}
	}
	// 优先级: userConfig(require > define(mirrorSet)) > globalConfig > DEFAULT_OPTIONS
	// 发起接口请求
	let require = async(namespace = '', data = {}, config = {}) => {
		let entity = apiSet[namespace]
		//未使用 define 定义过
		if(!entity) {
			entity = define(namespace)
		}

		entity = { ...entity,
			...globalConfig,
			...mirrorSet[namespace],
			...config
		}
		entity.input = data
		entity.debug::log('------------' + namespace + '------------')
		entity.debug::log(entity.input)
		entity.debug::log('----------------------------------------------------')

		let queryString = ''
		let url

		// TODO now  filter  input
		entity.input = entity.filter ? entity.filter(entity.input) : entity.input

		Object.keys(entity.input).forEach(key => {
			queryString += '&' + key + '=' + entity.input[key]
		})
		queryString = queryString.replace('&', '?')

		if(entity.urlModel === 1) {
			url = entity.domain
		} else {
			url = (REGEXP_URL.test(namespace)) ? namespace : (entity.domain + namespace)
		}

		entity.xhr = {
			url,
			queryString,
			withCredentials: entity.withCredentials
		}

		if(entity.useMock) {
			if(entity.sleep) {
				await sleep(entity.timeOut)
			}
			return Promise.resolve(entity.mock)

		} else if(entity.dataType === 'jsonp') {
			return util.jsonp(entity)
		} else if(entity.dataType === 'stream') {
			return util.stream(entity)
		} else {
			return util.ajax(entity)
		}
	}

	return {
		config,
		mixins,
		define,
		require,
		set
	}
})(document)

export default Api

/*
 * 定位：轻量
 * 开发(chrome)与生产分开
 * Api.main
 * 
 * Api.process
 * Api.dev
 * Api.mock
 * 
 * Api.prod
 *  
 * 
 * process ->
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */