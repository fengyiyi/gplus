/*
 * @fileoverview  提供事件代理功能
 *
 * @author tconzi@gmail.com
 *
 * @version 1.0
 */
;(function(){
var delegateCache = {}, bindEventCache = {},

//quick匹配方案大多数参考自jquery1.7,thanks
rquickIs = /^(\w*)(?:#([\w\-]+))?(\.[\w\-]+)*$/,
//处理selector
quickParse = function(selector) {
    var quick = rquickIs.exec(selector);
    if(quick) {
        //   0  1    2   3
        // [ _, tag, id, class ],为支持多个class ,class为.a.b.c
        quick[1] = (quick[1] || "" ).toLowerCase();
        //quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );

    }
    return quick;
},
//比较dom节点，与selector节点是否匹配
quickIs = function(elem, m) {

    //测试className是否匹配上，为支持.a.b.c这种情况，做了一些特殊处理
    var classTest;
    if( classTest = m[3]) {//m[3] !== ""
        var cname = elem.className;
        var ct = m[3].slice(1).split(".");
        baidu.array.each(ct, function(item) {
            if(item) {
                var rClass = new RegExp("(?:^|\\s)" + item + "(?:\\s|$)");
                classTest = classTest && rClass.test(cname);
            }
        });
    } else {
        //!m[3]
        classTest = 1;
    }

    return ((!m[1] || elem.nodeName.toLowerCase() === m[1]) && (!m[2] || elem.id === m[2]) && classTest
    );
};
function match(selector, domarray) {

    //匹配selector 与冒泡上来的dom路径的相关度，从最后一级往上走
    //selector 切分：空格为界，[["#id","class","tag"],...]

    var arrs = selector.split(" ").reverse();

    var i = 0, l = arrs.length;

    for(var j = 0, len = domarray.length; j < len; j++) {
        var m = quickParse(arrs[i]);
        if(quickIs(domarray[j], m)) {
            if(++i == l) {
                return true;
            }
        }
    }

    return false;

}

//提供一个回调方法
function on(type) {
    var type = type;
    return function(e) {
        var evt = baidu.event.get(e);
        var ele = evt.target;
        var dompathCache = [];
        // [["id","classname","tagname"],[...],...],位置，eventTarget 到document
        while(ele) {
            if(ele.nodeType == 1) {//只关注元素节点,文本节点看上一级
                dompathCache.push(ele);
            }
            ele = ele.parentNode;
        }

        var selectors = delegateCache[type];
        baidu.object.each(selectors, function(item, key) {
            if(match(key, dompathCache)) {
                baidu.object.each(item, function(handle, id) {
                    if( typeof handle == "function") {
                        handle.call(e, e);
                        //console.log(id);
                    }
                });
            }
        });
        ele = null;
        dompathCache = null;
    }
}

//给document绑定一个对象，内部方法　
function bindEvent(type) {
    if(!bindEventCache[type]) {
        bindEventCache[type] = on(type);
        baidu.on(document, type, bindEventCache[type]);
    }
}

var _guid = 1;
function getId() {
    return "_fis_delegate_id__" + (++_guid);
}

/**
 *
 * 绑定代理事件
 * @type function
 * @param {String} selector ，css selector写法，仅支持" #id .class tag "
 * @param {String} type ，事件类型，可为默认的事件模型中的类型，鼠标事件暂只支持"mousedown","mouseup","click","dblclick"
 * @param {function} handle ,事件处理函数，会回传一个event对象过来
 * @param {String} 【id】 事件的id，用于销毁
 */

baidu.dom.delegate = function(selector, type, handle, id) {
    //delegateCache[type][selector]

    type = type.replace(/^on/, "");
    selector = baidu.string.trim(selector.replace(/[ ]+/g, " "));
    //将多个空格去掉

    delegateCache[type] = delegateCache[type] || {};
    delegateCache[type][selector] = delegateCache[type][selector] || {};
    id = id || getId();
    handle.fisDelegateId = id;
    delegateCache[type][selector][id] = handle;

    //给document对象绑定事件
    bindEvent(type);

    return id;

}
})();



/*!
 * pjax(ajax + history.pushState) for tangram
 * 
 * by welefen
 * @version 1.0
 * @license MIT
 * @copyright 2011-2012
 */
(function() {
	var mix = function(){
		var target = arguments[0] ,i = 1, len = arguments.length;
		for(;i<len;i++){
			target = baidu.object.extend(target, arguments[i]);
		}
		return target;
	}
	
	var Util = {
		support : {
			pjax : window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/(iPod|iPhone|iPad|WebApps\/.+CFNetwork)/),
			storage : !!window.localStorage
		},
		toInt : function(obj) {
			return parseInt(obj);
		},
		stack : {},
		getTime : function() {
			return new Date * 1;
		},
		// 获取URL不带hash的部分,切去掉pjax=true部分
		getRealUrl : function(url) {
			url = (url || '').replace(/\#.*?$/, '');
			url = url.replace('?pjax=true', '').replace('&pjax=true', '');
			return url;
		},
		// 获取url的hash部分
		getUrlHash : function(url) {
			return url.replace(/^[^\#]*(?:\#(.*?))?$/, '$1');
		},
		// 获取本地存储的key
		getLocalKey : function(src) {
			var s = 'pjax_' + encodeURIComponent(src);
			return {
				data : s + '_data',
				time : s + '_time',
				title : s + '_title'
			};
		},
		// 清除所有的cache
		removeAllCache : function() {
			if (!Util.support.storage)
				return;
			for ( var name in localStorage) {
				if ((name.split('_') || [ '' ])[0] === 'pjax') {
					delete localStorage[name];
				}
			}
		},
		// 获取cache
		getCache : function(src, time, flag) {
			var item, vkey, tkey, tval;
			time = Util.toInt(time);
			if (src in Util.stack) {
				item = Util.stack[src], ctime = Util.getTime();
				if ((item.time + time * 1000) > ctime) {
					return item;
				} else {
					delete Util.stack[src];
				}
			} else if (flag && Util.support.storage) { // 从localStorage里查询
				var l = Util.getLocalKey(src);
				vkey = l.data;
				tkey = l.time;
				item = localStorage.getItem(vkey);
				if (item) {
					tval = Util.toInt(localStorage.getItem(tkey));
					if ((tval + time * 1000) > Util.getTime()) {
						return {
							data : item,
							title : localStorage.getItem(l.title)
						};
					} else {
						localStorage.removeItem(vkey);
						localStorage.removeItem(tkey);
						localStorage.removeItem(l.title);
					}
				}
			}
			return null;
		},
		// 设置cache
		setCache : function(src, data, title, flag) {
			var time = Util.getTime(), key;
			Util.stack[src] = {
				data : data,
				title : title,
				time : time
			};
			if (flag && Util.support.storage) {
				key = Util.getLocalKey(src);
				localStorage.setItem(key.data, data);
				localStorage.setItem(key.time, time);
				localStorage.setItem(key.title, title);
			}
		},
		// 清除cache
		removeCache : function(src) {
			src = src || location.href;
			delete Util.stack[Util.getRealUrl(src)];
			if (Util.support.storage) {
				var key = Util.getLocalKey(src);
				localStorage.removeItem(key.data);
				localStorage.removeItem(key.time);
				localStorage.removeItem(key.title);
			}
		}
	};
	// pjax
	var pjax = function(options) {
		options = mix({}, {
			selector : '',
			container : '',
			callback : function() {},
			fitler : function() {}
		}, options);
		if (!options.container || !options.selector) {
			throw new Error('selector & container options must be set');
		}
		baidu.dom.delegate(options.selector, 'click', function(event) {
			event = baidu.event.getEvent(event);
			if (event.which > 1 || event.metaKey) {
				return true;
			}
			var $this = event.target || event.srcElement, href = baidu.dom.getAttr($this, 'href');
			// 过滤
			if (typeof options.filter === 'function') {
				if (options.filter.call(this, href, this) === true){
					return true;
				}
			}
			if (href === location.href) {
				return true;
			}
			// 只是hash不同
			if (Util.getRealUrl(href) == Util.getRealUrl(location.href)) {
				var hash = Util.getUrlHash(href);
				if (hash) {
					location.hash = hash;
					options.callback && options.callback.call(this, {
						type : 'hash'
					});
				}
				return true;
			}
			baidu.event.preventDefault(event);
			options = mix({}, options, {
				url : href,
				element : this
			});
			// 发起请求
			pjax.request(options);
		});
	};
	pjax.xhr = null;
	pjax.options = {};
	pjax.state = {};
	
	// 默认选项
	pjax.defaultOptions = {
		timeout : 2000,
		element : null,
		cache : 24 * 3600, // 缓存时间, 0为不缓存, 单位为秒
		storage : true, // 是否使用localstorage将数据保存到本地
		url : '', // 链接地址
		push : true, // true is push, false is replace, null for do nothing
		show : '', // 展示的动画
		title : '', // 标题
		titleSuffix : '',// 标题后缀
		type : 'GET',
		data : {
			pjax : true
		},
		dataType : 'html',
		callback : null, // 回调函数
		headers:{
			'X-PJAX': true
		},
		onfailure : function() {
			pjax.options.callback && pjax.options.callback.call(pjax.options.element, {
				type : 'error'
			});
			location.href = pjax.options.url;
		}
	};
	// 展现动画
	pjax.showFx = {
		"_default" : function(data, callback, isCached) {
			this.html(data);
			callback && callback.call(this, data, isCached);
		}
	}
	// 展现函数
	pjax.showFn = function(showType, container, data, fn, isCached) {
		var fx = null;
		if (typeof showType === 'function') {
			fx = showType;
		} else {
			if (!(showType in pjax.showFx)) {
				showType = "_default";
			}
			fx = pjax.showFx[showType];
		}
		fx && fx.call(container, data, function() {
			var hash = location.hash;
			if (hash != '') {
				location.href = hash;
				//for FF
				if(/Firefox/.test(navigator.userAget)){
					history.replaceState($.extend({}, pjax.state, {
						url : null
					}), document.title);
				}
			} else {
				window.scrollTo(0, 0);
			}
			fn && fn.call(this, data, isCached);
		}, isCached);
	}
	// success callback
	pjax.onsuccess = function(xhr, data, isCached) {
		// isCached default is success
		if (isCached !== true) {
			isCached = false;
		}
		if(typeof data ==='object'){
			data = this.requester.responseText;
		}
		if ((data || '').indexOf('<html') != -1) {
			pjax.options.callback && pjax.options.callback.call(pjax.options.element, {
				type : 'error'
			});
			location.href = pjax.options.url;
			return false;
		}
		var title = pjax.options.title, el;
		if (!title) {
			var matches = data.match(/<title>(.*?)<\/title>/);
			if (matches) {
				title = matches[1];
			}
			if (!title && pjax.options.element) {
				el = baidu.dom.query(pjax.options.element)[0];
				title = baidu.dom.getAttr(el, 'title') || el.innerHTML;
			}
		}
		if (title) {
			if (title.indexOf(pjax.options.titleSuffix) == -1) {
				title += pjax.options.titleSuffix;
			}
			document.title = title;
		}
		pjax.state = {
			container : pjax.options.container,
			timeout : pjax.options.timeout,
			cache : pjax.options.cache,
			storage : pjax.options.storage,
			show : pjax.options.show,
			title : title,
			url : pjax.options.oldUrl
		};
		var query = baidu.url.jsonToQuery(pjax.options.data);
		if (query != "") {
			pjax.state.url = pjax.options.url + (/\?/.test(pjax.options.url) ? "&" : "?") + query;
		}
		if (pjax.options.push) {
			if (!pjax.active) {
				history.replaceState(mix({}, pjax.state, {
					url : null
				}), document.title);
				pjax.active = true;
			}
			history.pushState(pjax.state, document.title, pjax.options.oldUrl);
		} else if (pjax.options.push === false) {
			history.replaceState(pjax.state, document.title, pjax.options.oldUrl);
		}
		pjax.options.showFn && pjax.options.showFn(data, function() {
			pjax.options.callback && pjax.options.callback.call(pjax.options.element,{
				type : isCached? 'cache' : 'success'
			});
		}, isCached);
		// 设置cache
		if (pjax.options.cache && ! isCached) {
			Util.setCache(pjax.options.url, data, title, pjax.options.storage);
		}
	};
	
	// 发送请求
	pjax.request = function(options) {
		options = mix({}, pjax.defaultOptions, options);
		var cache, container = baidu.dom.query(options.container)[0];
		options.oldUrl = options.url;
		options.url = Util.getRealUrl(options.url);
		var el = baidu.dom.query(options.element)[0];
		if(el){
			cache = Util.toInt(baidu.dom.getAttr(el, 'data-pjax-cache'));
			if (cache) {
				options.cache = cache;
			}
		}
		if (options.cache === true) {
			options.cache = 24 * 3600;
		}
		options.cache = Util.toInt(options.cache);
		// 如果将缓存时间设为0，则将之前的缓存也清除
		if (options.cache === 0) {
			Util.removeAllCache();
		}
		// 展现函数
		if (!options.showFn) {
			options.showFn = function(data, fn, isCached) {
				pjax.showFn(options.show, container, data, fn, isCached);
			};
		}
		pjax.options = options;
		pjax.options.onsuccess = pjax.onsuccess;
		if (options.cache && (cache = Util.getCache(options.url, options.cache, options.storage))) {
			baidu.event.fire(container, 'pjax.start');
			options.title = cache.title;
			pjax.onsuccess(null, cache.data, true);
			baidu.event.fire(container, 'pjax.end');
			return true;
		}
		if (pjax.xhr && pjax.xhr.cancel) {
			pjax.xhr.cancel();
		}
		pjax.xhr = baidu.ajax.request(pjax.options.url, pjax.options);
		baidu.event.fire(container, 'pjax.start');
		pjax.xhr.send(pjax.options.url, 'get', pjax.options.data);
		baidu.event.fire(container, 'pjax.end');
	};

	// popstate event
	var popped = ('state' in window.history), initialURL = location.href;
	baidu.event.on(window, 'popstate', function(event) {
		var initialPop = !popped && location.href == initialURL;
		popped = true;
		if (initialPop) return;
		var state = event.state;
		if (state && state.container) {
			if (W(state.container).length) {
				var data = {
					url : state.url || location.href,
					container : state.container,
					push : null,
					timeout : state.timeout,
					cache : state.cache,
					storage : state.storage
				};
				pjax.request(data);
			} else {
				window.location = location.href;
			}
		}
	});

	// not support
	if (!Util.support.pjax) {
		pjax = function() {
			return true;
		};
		pjax.request = function(options) {
			if (options && options.url) {
				location.href = options.url;
			}
		};
	}
	pjax.util = Util;
	baidu.pjax = pjax;

})();
