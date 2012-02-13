(function(){
	var endPjaxTimer = 0;
	W('#content').on('pjax.start', function(cache){
		W('.loading').show();
		endPjaxTimer = setTimeout(function(){
			endPjaxTimer = 0;
			W('#content').fire('pjax.end');
		}, 3000);
	});
	var li = W('header nav li');
	W('#content').on('pjax.end', function(cache){
		if(endPjaxTimer){
			clearTimeout(endPjaxTimer);
			endPjaxTimer = 0;
		}
		W('.loading').hide();
		li.removeClass('current_page_item');
		li.forEach(function(el){
			var href = W('a', el).attr('href'), h;
			href = QW.pjax.util.getRealUrl(href);
			h = QW.pjax.util.getRealUrl(location.href);
			if(href == h || (href+'/') == h || href == (h+'/')){
				W(el).addClass('current_page_item');
				return false;
			}
		});
		typeof pjaxCallback != 'undefined' && pjaxCallback && pjaxCallback();
	});
	QW.pjax({
		selector: 'a[href^="'+pjaxHomeUrl+'"]',
		container: '#content',
		show: typeof pjaxFx == 'undefined' ? '' : pjaxFx,
		cache: typeof pjaxCacheTime == 'undefined' ? true : pjaxCacheTime,
		storage: typeof pjaxUseStorage == 'undefined' ? true : pjaxUseStorage,
		titleSuffix: pjaxTitleSuffix,
		filter: function(href){
			if(href.indexOf('wp-content/') > -1 || href.indexOf('wp-admin/') > -1){
				return true;
			}
		}
	})
})();