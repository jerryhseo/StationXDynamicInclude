// 
// 需要 jQuery 库支持
// 只是一个弹出菜单的函数，任何形式都可以调用
// 作者：tianlunvip
// 更多插件，请访问 www.tianlunvip.com
// 
function popmenu($tag, options) {

	var opts = {
		x : event.clientX,
		y : event.clientY,
		items : {},
		callback : null,
		position: 'offset'
}
	
    if (typeof options === 'object') {
        $.extend(opts, options);
    } else {
    	alert("请参考 options 选项正确设置")
    	return false;
    }
	
	var menu_items = '';

	for (var item in opts.items) {

		var name = '';
		if($.type(opts.items[item].name) === "string") {
			name = opts.items[item].name + " ";
		}
		var icon = '';
		if($.type(opts.items[item].icon) === "string") {
			icon = opts.items[item].icon + " ";
		}
		var divid = '';
		if(opts.items[item].divid === true) {
			divid = "<hr>";
		} 

		menu_items += "<li id='" + item + "' name='"+ name +"'>" + icon + opts.items[item].name + "</li>" + divid;
	}
	menu_items = $("<div role='popmenu-layer' class='popmenu-layer'><ul role='popmenu'>" + menu_items + "</ul></div>");

	$("body").append(menu_items);

	let left = opts.x;
	let top = opts.y;
	
	if( opts.position === 'left' ){
		left = left - menu_items.find("[role='popmenu']").width() - 10;
	}
	else if( opts.position === 'right' ){
		left = left + $tag.width() - 10;
	}
	
	$("[role='popmenu']").css({'left' : left , 'top' : top });

	$("[role='popmenu']>li").bind("click",function(e){

		if($.type(opts.callback) === "function") {
			var id = $(this).attr('id');
			this.id = id;
			opts.callback(this);
		} else {
			alert("菜单ID【"+$(this).attr('id')+"】被点击");
		}
		$(this).parent().hide();
		$("[role='popmenu-layer']").remove();
	});

	$("[role='popmenu']").focus();

	$("[role='popmenu']>li").hover(function() {
		$(this).addClass('popmenu-hover');
	}, function() {
		$(this).removeClass('popmenu-hover');
	});
	// 图层被点击
	$(".popmenu-layer").mousedown(function(event) {
		$("[role='popmenu']").hide();
		$("[role='popmenu-layer']").remove();
	});
	// 浏览器窗口失去焦点
	$(window).blur(function(event) {
		$("[role='popmenu']").hide();
		$("[role='popmenu-layer']").remove();
	});
	// 
	$(window).mousedown(function(event){
		$("[role='popmenu']").hide();
		$("[role='popmenu-layer']").remove();
	})
	// 不响应浏览器右键系统菜单 任何消息
	$("[role='popmenu']").mousedown(function(event){
		event.stopPropagation();		// 忽略事件
	})
	// 窗口大小被改变
	$(window).resize(function(event) {
		$("[role='popmenu']").hide();
		$("[role='popmenu-layer']").remove();
	});
	
	return menu_items;
}
