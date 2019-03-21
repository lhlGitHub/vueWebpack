import Api from '../lib/Api'

//请求事例
Api.define("getNowTime", {
	input: {
		'ct': 'index',
		'ac': 'get_activity_time',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},

	mock: {
		'code': 0, //错误码
		'error': '', //错误信息
		'data': {
			'now_time': '2018/05/10 20:29:55',
		}
	}
})

//1、获取用户信息
Api.define("initInfo", {
	input: {
		'ct': 'xinyou',
		'ac': 'main_init',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0,
		'error': '活动不存在',
		'data': {
			'activity_info': {
				'a_id': 0, // 活动id
				'a_name': 'xxx', // 活动名称
				'a_title': 'xxxx', // 活动页面标题
				'a_type': 2, // 活动类型，1预约活动，2主页
				'start_time': '2018-03-23', // 活动开始时间
				'end_time': '2018-04-23', // 活动结束时间
				'start_msg': '活动暂未开放',
				'end_msg': '活动已结束',
				'download_link': 'xxx',
				'music_url': 'http://xxxxxx.mp3', // 活动背景音乐
				'win_record_url': 'xxx', // 中奖记录url
				'address_url': 'ccc', // 收货地址url
				'course_url': 'bbb', // 代金券教程url
				'bind_guid_img': 'zzz', // 绑定ID弹窗引导图片
				'commit_role_img': '', // 确认角色图片
				'can_draw': 1, // 是否可以抽奖，1是，0否
			},
			'userInfo': {
				"guid": 1,
				"role_name": '', //游戏角色
				"role_id": 0, //角色ID
				"role_level": 60, //角色等级
				"server_id": '1',	//区服
				"server_name": '花样少女',	//区服
				"pay_num": 0,		//充值金额
			},
			'modules': {
				// 头图模块
				//banner
				'head': {
					'sort': 0,
					'top_img': require('../../img/head.jpg'), // 顶部悬浮窗图片
					'back_img': require('../../img/banner.jpg'),  // 背景图片
					'role_img': require('../../img/login-box.png'),  // 选择游戏背景

					'download_img': require('../../img/btn-load.jpg'), // 下载链接按钮图片
					'download_link': 'http://www.baidu.com', // 下载链接跳转
				},
				// 导航模块
				'nav': {
					'sort': 0,
					'back_img': require('../../img/tab-bg.jpg'),  // 背景图片
					'nav_list': [
						{
							'nav_img': require('../../img/tab-1.png'),   // 导航名称
							'nav_module': 'draw' // 跳转的模块
						},
						{
							'nav_img': require('../../img/tab-2.png'),   // 导航名称
							'nav_module': 'package' // 跳转的模块
						},
						{
							'nav_img': require('../../img/tab-3.png'),   // 导航名称
							'nav_module': 'pay' // 跳转的模块
						}
					]
				},
				// 抽奖模块
				'draw': {
					'sort': 3,
					'back_img': require('../../img/win-bg.jpg'),  // 背景图片
					'draw_type': 2,  // 抽奖类型，此处是九宫格
					'record_link': 'http://www.baidu.com',
					'draw_img': {    // 抽奖类型相关图片，其他类型可能不一样，目前先做6
						'draw_btn_img': require('../../img/draw-btn.png'),  // 抽奖按钮图片
						'prize_back': require('../../img/prize-bg.png'),    // 奖品背景图片,
						'prize_back_light': require('../../img/prize-on-bg.png'),  // 奖品背景图片,
						'prize_img': [
							{
								'p_id': 1, // 奖品id
								'p_img': require('../../img/prize-1.png'), // 奖品图片，8张
							},
							{
								'p_id': 2, // 奖品id
								'p_img': require('../../img/prize-2.png'), // 奖品图片，8张
							}, {
								'p_id': 3, // 奖品id
								'p_img': require('../../img/prize-3.png'), // 奖品图片，8张
							}, {
								'p_id': 4, // 奖品id
								'p_img': require('../../img/prize-4.png'), // 奖品图片，8张
							},
							{
								'p_id': 9, // 奖品id
								'p_img': require('../../img/prize-5.png'), // 奖品图片，8张
							}, {
								'p_id': 8, // 奖品id
								'p_img': require('../../img/prize-6.png'), // 奖品图片，8张
							}, {
								'p_id': 10, // 奖品id
								'p_img': require('../../img/prize-7.png'), // 奖品图片，8张
							}, {
								'p_id': 5, // 奖品id
								'p_img': require('../../img/prize-8.png'), // 奖品图片，8张
							}
						]
					}
				},
				// 领取礼包模块
				'package': {
					'sort': 4,
					'pkg_id': 1,
					'back_img': require('../../img/welfare-bg.jpg'),  // 背景图片
					'btn_img': require('../../img/btn-get.png'),   // 领取按钮图片
					'is_receive': 0, // 是否已领取，1是，0否
					'pkg_code': 'xxxxxx',    // 领取的礼包码
					'server_name': 'xxx', // 领取礼包角色服务器
					'role_name': 'xxx', // 领取礼包角色名
				},
				// 等级冲刺礼包模块
				'level': {
					'sort': 2,
					'back_img': require('../../img/level-bg.jpg'),   // 背景图片
					'red_btn_img': require('../../img/btn-redbag.png'),   // 领取按钮图片
					'pkg_btn_img': require('../../img/btn-redbag.png'),   // 领取按钮图片
					'type': 3, // 类型，1红包，2礼包，3红包+礼包
					'pkg_list': [    // 礼包列表
						{
							'pkg_id': 1, // 礼包id
							'role_level': 80, // 礼包等级
							'pkg_img': require('../../img/level-1.jpg'),   // 礼包图片
							'is_receive': 1, // 是否已领取，1是，0否
							'server_name': '1111', // 领取礼包角色服务器
							'role_name': '12222', // 领取礼包角色名
						},
						{
							'pkg_id': 1, // 礼包id
							'role_level': 15, // 礼包等级
							'pkg_img': require('../../img/level-1.jpg'),   // 礼包图片
							'is_receive': 0, // 是否已领取，1是，0否
							'server_name': 'xxx', // 领取礼包角色服务器
							'role_name': 'xxx', // 领取礼包角色名
						},
						{
							'pkg_id': 1, // 礼包id
							'role_level': 15, // 礼包等级
							'pkg_img': require('../../img/level-1.jpg'),   // 礼包图片
							'is_receive': 0, // 是否已领取，1是，0否
							'server_name': 'xxx', // 领取礼包角色服务器
							'role_name': 'xxx', // 领取礼包角色名
						},
						{
							'pkg_id': 1, // 礼包id
							'role_level': 15, // 礼包等级
							'pkg_img': require('../../img/level-1.jpg'),   // 礼包图片
							'is_receive': 0, // 是否已领取，1是，0否
							'server_name': 'xxx', // 领取礼包角色服务器
							'role_name': 'xxx', // 领取礼包角色名
						}
					]
				},
				// 充值礼包模块
				'pay': {
					'sort': 12,
					'back_img': require('../../img/recharge-bg.jpg'),   // 背景图片
					'btn_img': require('../../img/btn-get-small.png'),   // 领取按钮图片
					'pkg_list': [    // 礼包列表
						{
							'pkg_id': 1, // 礼包id
							'pay_num': 15,   // 充值的金额
							'pkg_img': require('../../img/libao-bg.png'),   // 礼包图片
							'pkg_code': 'xxxxx', // 领取获得的礼包码
							'is_receive': 1, // 是否已领取，1是，0否
							'server_name': '1212', // 领取礼包角色服务器
							'role_name': '3333', // 领取礼包角色名
						},
						{
							'pkg_id': 1, // 礼包id
							'pay_num': 15,   // 充值的金额
							'pkg_img': require('../../img/libao-bg.png'),   // 礼包图片
							'pkg_code': 'xxxxx', // 领取获得的礼包码
							'is_receive': 1, // 是否已领取，1是，0否
							'server_name': 'xxx', // 领取礼包角色服务器
							'role_name': 'xxx', // 领取礼包角色名
						},
						{
							'pkg_id': 1, // 礼包id
							'pay_num': 15,   // 充值的金额
							'pkg_img': require('../../img/libao-bg.png'),   // 礼包图片
							'pkg_code': 'xxxxx', // 领取获得的礼包码
							'is_receive': 0, // 是否已领取，1是，0否
							'server_name': 'xxx', // 领取礼包角色服务器
							'role_name': 'xxx', // 领取礼包角色名
						},
						{
							'pkg_id': 1, // 礼包id
							'pay_num': 15,   // 充值的金额
							'pkg_img': require('../../img/libao-bg.png'),   // 礼包图片
							'pkg_code': 'xxxxx', // 领取获得的礼包码
							'is_receive': 0, // 是否已领取，1是，0否
							'server_name': 'xxx', // 领取礼包角色服务器
							'role_name': 'xxx', // 领取礼包角色名
						}
					]
				},
				// 精彩抢先看模块
				'game_image': {
					'sort': 0,
					'back_img': require('../../img/foreshow-bg.jpg'),   // 背景图片
					'img_list': [    // 滚动图片列表
						require('../../img/pic-1.jpg'),
						require('../../img/pic-2.jpg'),
						require('../../img/pic-3.jpg')
					]
				},
				// 游戏视频模块
				'game_video': {
					'sort': 0,
					'back_img': require('../../img/video-bg.jpg'),   // 背景图片
					'video_url': 'http://yxfile.3k.com/2017/03/02/upload_u2f0hrrvgwhjcgetlxbpza2zuhwg1pxa.mp4'
				},
				// 游戏规则模块
				'rule': {
					'sort': 0,
					'back_img': require('../../img/rule.jpg'),   // 背景图片
					'content': 'xxxxxxxx'    // 规则内容，图片包含内容时可为空
				}
			}
		}
	}
})

//2、获取奖励（红包、礼包）
Api.define("getReward", {
	input: {
		'ct': 'xinyou',
		'ac': 'main_package',
		'pkg_id': 0,
		'type': '',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名

	},
	mock: {
		'code': 0, //错误码
		'error': '', //错误信息
		'data': {  //奖品类型 2-礼包码、6-定额红包
			'p_name': 'xxx', // 奖品名称
			'p_img': '', // 奖品图片
			'p_remark': '', // 奖品说明
			'p_type': 6, // 奖品类型
			'p_data': 1, // 礼包码或红包数额或k钻数额
		}
	}
})
//3、获取获取区服列表
Api.define("getServerList", {
	input: {
		'ct': 'xinyou',
		'ac': 'main_get_role_list',
		"guid": '',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名

	},
	mock: {
		'code': 0,//错误码
		'error': '',//错误信息
		'data': {
			'guid': '',
			'list': [{
				'server_id': '1',
				'server_name': '豆蔻年华',
				'role_list': [
					{
						'role_name': '花样少女',
						'role_id': 0,
						'role_level': 0,
						'pay_num': 20,
					},
					{
						'role_name': '花样少女2',
						'role_id': 0,
						'role_level': 0,
						'pay_num': 20,
					}
				]
			}, {
				'server_id': '2',
				'server_name': '白玫瑰',
				'role_list': [
					{
						'role_name': '白衣少年',
						'role_id': 0,
						'role_level': 45,
						'pay_num': 60,
					}]
			}, {
				'server_id': '3',
				'server_name': 'xxx',
				'role_list': [
					{

						'role_name': '000',
						'role_id': 0,
						'role_level': 30,
						'pay_num': 40,
					}]
			}, {
				'server_id': '4',
				'server_name': 'xxx',
				'role_list': [
					{

						'role_name': '000',
						'role_id': 0,
						'role_level': 30,
						'pay_num': 40,
					}]
			}]
		}
	}
})
//4、确认角色
Api.define("chooseRole", {
	input: {
		'ct': 'xinyou',
		'ac': 'main_choose_role',
		'role_id': 1, //1红包2K钻
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0, //错误码
		'error': '', //错误信息
		'data': {
			'num': '1.5', //对应红包金额或K钻数
		}
	}
})
//5、创角抽奖
Api.define("drawPrize", {
	input: {
		'ct': 'xinyou',
		'ac': 'main_draw',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0, //错误码
		'error': '222', //错误信息
		'data': {
			'p_id': 10, // 奖品id
			'p_name': 'kkkz', // 奖品名称
			'p_img': require('../../img/prize.png'), // 奖品图片
			'p_remark': '活动结束后14个工作日内快递发放，快递免邮', // 奖品说明
			'p_type': 1, // 奖品类型
			'card_num': 'aaaaaaaaa', // 充值卡卡号
			'card_pwd': '123123123', // 充值卡卡密
		}
	}
})
//6.分享
Api.define("shareInfo", {
	input: {
		'ct': 'xinyou',
		'ac': 'get_share_info',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		"code": 0,
		"error": "操作成功",
		"data": {
			"title": "",
			"content": "",
			"img": ""
		}
	}
})

Api.define("count", {
	input: {
		'ct': 'logapi',
		'ac': 'page',
		'param': 'xinyou', //特定参数
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
		'event_id': 1, //事件ID，对应下面事件列表
		'url': 'http://h.3k.com' //当前页面链接
	},
	mock: {
		'code': 0, //错误码
		'error': '', //错误信息
		'data': {}
	}
})

//预约
//1、获取用户信息
Api.define("bookInit", {
	input: {
		'ct': 'xinyou',
		'ac': 'book_init',
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0,
		'error': '活动不存在',
		'data': {
			'activity_info': {
				'a_id': 0, // 活动id
				'a_name': 'xxx', // 活动名称
				'a_type': 1,//1预约 2主页
				'a_title': 'xxxx', // 活动页面标题
				'start_time': '2018-05-09', // 活动开始时间
				'end_time': '2018-05-12', // 活动结束时间
				'start_msg': '活动未开始', // 活动开始语
				'end_msg': '活动结束了', // 活动结束语

			},

			'modules': {
				// 头图模块
				'head': {
					'sort': 0,
					'back_img': require('../../img/banner.jpg'),  // 背景图片
					'music_url': 'http://hrh5.3k.com/static/audio/audio.mp3', // 活动背景音乐
					'music_icon_play': require('../../img/appointment/music-bg.png'),  // 活动背景音乐图标，有音乐
					'music_icon_none': require('../../img/appointment/stop-music-bg.png'), // 活动背景音乐图片，无音乐
					'download_img': require('../../img/btn-load.jpg'), // 下载链接按钮图片
					'download_link': 'http://www.baidu.com', // 下载链接跳转
				},
				'draw': {
					'sort': 4,
					'draw_type': 6,
					'back_img': require('../../img/appointment/draw-bg.jpg'),  // 背景图片
					'draw_img': {    // 抽奖类型相关图片，其他类型可能不一样，目前先做6
						'red_small_img': require('../../img/appointment/redbag-small.png'), // 红包1小图
						'red_big_img': require('../../img/appointment/redbag-big.png'), // 红包3大图
						'red_big_btn': require('../../img/appointment/btn-open.png'),
					}
				},
				'best_prize': {
					'sort': 4,
					'back_img': require('../../img/appointment/prizeshow-bg.jpg'),  // 背景图片					
				},
				// 中奖记录模块
				'record': {
					'sort': 4,
					'back_img': require('../../img/appointment/record-bg.jpg'),  // 背景图片
					'btn_img': require('../../img/btn-download.png'),   // 领取按钮图片
					// 'prize_img': require('../../img/prize.png'),
					// 'pkg_type': 1,
					// 'pkg_code': 'xxxxxx',    // 领取的礼包码
					// 'name': 'XXX',
					// 'time': '2018.05.17'
				},
				// 领取礼包模块
				'package': {
					'sort': 4,
					'pkg_id': 1,
					'back_img': require('../../img/welfare-bg.jpg'),  // 背景图片
					'btn_img': require('../../img/btn-get.png'),   // 领取按钮图片
					'btn_got_img': require('../../img/btn-check.png'),   // 领取按钮图片				
					'pkg_code': 'xxxxxx',    // 领取的礼包码				
				},

				// 精彩抢先看模块
				'game_image': {
					'sort': 0,
					'back_img': require('../../img/foreshow-bg.jpg'),   // 背景图片
					'img_list': [    // 滚动图片列表
						require('../../img/pic-1.jpg'),
						require('../../img/pic-2.jpg'),
						require('../../img/pic-3.jpg')
					]
				},
				// 游戏视频模块
				'game_video': {
					'sort': 0,
					'back_img': require('../../img/video-bg.jpg'),   // 背景图片
					'video_url': 'http://yxfile.3k.com/2017/03/02/upload_u2f0hrrvgwhjcgetlxbpza2zuhwg1pxa.mp4'
				},
				// 游戏规则模块
				'rule': {
					'sort': 0,
					'back_img': require('../../img/rule.jpg'),   // 背景图片
					'content': 'xxxxxxxx'    // 规则内容，图片包含内容时可为空
				}
			}
		}
	}
})

//2、领取礼包
Api.define("getGift", {
	input: {
		ct: "xinyou",
		ac: "book_package",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0, //错误码
		'error': '222', //错误信息
		'data': {
			'pkg_id': 1,
			'p_type': '',
			'code': 'xxxxx', // 礼包码
			'kz_num': '0', // k钻数量
			'red_num': '0', // 红包金额，单位元
			'card_num': 'xxx', // 卡号
			'card_pwd': '', // 卡密
		}
	}
})
//3、发送验证码
Api.define("bookVerifyCode", {
	input: {
		ct: "xinyou",
		ac: "book_verify_code",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0,
		'error': '',
		'data': {}
	}
})
//4、提交验证码
Api.define("verifyCode", {
	input: {
		ct: "xinyou",
		ac: "verify_code",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0,
		'error': '',
		'data': {}
	}
})
//5、预约抽奖
Api.define("bookDraw", {
	input: {
		ct: "xinyou",
		ac: "book_draw",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code':0,
		'error': '',
		'data': {
			'p_id': 10, // 奖品id
			'p_name': 'kkkz', // 奖品名称
			'p_img': require('../../img/prize.png'), // 奖品图片
			'p_remark': '活动结束后14个工作日内快递发放，快递免邮', // 奖品说明
			'p_type': 1, // 奖品类型
			'card_num': 'aaaaaaaaa', // 充值卡卡号
			'card_pwd': '123123123', // 充值卡卡密
			'recv_time': '2018.05.09 9:23',
		}
	}
})

//6、已领取礼包列表
Api.define("getGiftList", {
	input: {
		ct: "xinyou",
		ac: "get_user_package",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0,
		'error': '',
		'data': {
			'user_package': [
				{
					'pkg_id': '',
					'p_type': '',
					'code': 'xxxxx', // 礼包码
					'kz_num': '0', // k钻数量
					'red_num': '0', // 红包金额，单位元
					'card_num': 'xxx', // 卡号
					'card_pwd': '', // 卡密
					'recv_time': '2018.05.07 15:23',
				}
			],
		}
	}
})

//7、获取用户已抽奖结果
Api.define("getUserDraw", {
	input: {
		ct: "xinyou",
		ac: "get_user_draw",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock: {
		'code': 0,
		'error': '',
		'data': {
			'prize_info': {
				// 'p_name':'',
				// 'p_img':'',
				// 'p_remark':'',
				// 'p_type':0,
				// 'code':'xxxxx', // 礼包码
				// 'kz_num':'0', // k钻数量
				// 'red_num':'0', // 红包金额，单位元
				// 'card_num':'xxx', // 卡号
				// 'card_pwd':'', // 卡密
				// 'recv_time':'2018.05.07 15:23',
			}
		}
	}
})
//7、领取预约信息
Api.define("getUserBookInfo", {
	input: {
		ct: "xinyou",
		ac: "get_user_book_info",
		'from_id': '',
		'pf': 1, //1安卓2IOS
		'_': 12345678901, //时间戳
		'signature': '', //加密签名
	},
	mock:{
		'code':0,
		'error':'',
		'data':{
			// 'is_book' : 1,
			// 'phone' : '1345344353',
			// 'book_time' : '2018-05-08 17:00:00',
		}
	}
})
export default function () { }