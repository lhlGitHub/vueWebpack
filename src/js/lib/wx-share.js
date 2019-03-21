import Api from "../lib/Api"
import wx from 'weixin-js-sdk'

const DEFAULT_FN = n => n
const DEFAULT_OPTIONS = {
	link: window.location.href,
	type: 'link',
	dataUrl: '',
	success: DEFAULT_FN,
	error: DEFAULT_FN,
	cancel: DEFAULT_FN,
	debug: GD.URLparams.wxdebug || false,
	apiList: ['onMenuShareTimeline','onMenuShareAppMessage']
}

export default function(params = {}) {
   
	let { title, desc, img:imgUrl, link, success, error, cancel, type, dataUrl, debug, apiList } = {
		...DEFAULT_OPTIONS,
		...params
	}
	
	Api.require('share', {
        ct: 'user',
        ac: 'ajax_ticket',
        url: encodeURIComponent(link)
    },{
        domain: '//' + pList[ENV] + '/',
        dataType: 'jsonp',
        urlModel: 1,
        debug
    }).then(res => {
    	if(!res.data) return console.warn('get share config error!', res)
    	
    	let { app_id:appId, noncestr:nonceStr, signature, timestamp, sign_url:link } = res.data.info
    	let shareMsg = {
            title,
            desc,
            link,
            imgUrl,
            type,
            dataUrl,
            success,
            cancel
        }
    	wx.config({
            debug,
            appId,
            timestamp,
            nonceStr,
            signature,
            jsApiList: [
                'checkJsApi',
                ...apiList
            ]
        })
    	wx.error(error)
    	wx.ready(function() {
            console.log('share',shareMsg)
            wx.checkJsApi({
                jsApiList: [...apiList],
                success
            })
            apiList.forEach(api => wx[api](shareMsg))
        })
    }).catch(e => {
    	console.log('share.error:',e)
    })
}
