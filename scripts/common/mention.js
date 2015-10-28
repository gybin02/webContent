function Mention(opts) {

	this.opts = $.extend(this.defaultOpts, opts);

};

Mention.prototype.defaultOpts = {
	items: [],
	url: "",
	symbol: "@",
	textInput: "",

};

Mention.prototype.active = false;
Mention.prototype.module = 0;
Mention.prototype.textInput = function() {
	return this.opts.textInput;
};
/*初始化*/
Mention.prototype._init = function(symbol) {
	var $this = this;
	//初始化隐藏编辑器
	if (!this.opts.textInput) {
		throw new Error("Must provide textarea");
	}
	var textarea = this.opts.textInput;

	setTimeout(function() {
		/*初始化编辑器*/
		if ($("#u-editor").length < 1) {
			$("<div id='u-editor'></div>").appendTo("body");
			$("#u-editor").css({
				"width": textarea.width(),
				"height": textarea.height(),
				"position": "absolute",
				"top": textarea.offset().top + 0,
				"left": textarea.offset().left,
				"background": "none",
				"z-index": -10,
				"padding": textarea.css("padding"),
				"font-size": textarea.css("font-size"),
				"font-family": textarea.css("font-family"),
				"line-height": textarea.css("line-height")

			})
		}

		if ($("#user-search-box").length < 1) {
			userDiv = "";
			userDiv += '<div id="user-search-box" style="display:none">';
			userDiv += '<div class="inputs">';
			userDiv += '<input name="user-keywords" placeholder="" id="user-keywords" />';
			userDiv += '</div>';
			userDiv += '<div class="placeholder">想用@提到谁？</div>';
			userDiv += '<div class="user-list">';
			userDiv += '<ul></ul>';
			userDiv += '</div>';
			userDiv += '</div>';
			$(userDiv).appendTo("body");



		}

	}, 1000)

   textarea.css({
		opacity: 1
	});
	textarea.keydown(function(e){
		if(e.keyCode==50 || e.keyCode==52 ){
		 $this.active=true;
		}
		console.log(e.keyCode);
	});
	this.oninput();
	$("#user-keywords").blur(function() {
		setTimeout(function() {
			$this._hide();
		}, 250);

	})
	

};

Mention.prototype._getData = function() {

}

/*获取数据*/
Mention.prototype._getItems = function(val) {

	var $this, url, items;
	$this = this,
		url = this.opts.url,
		items = this.opts.items;
	$this.url = this.opts.config[this.module].url;
	$this.items = this.opts.config[this.module].items;
	$this.symbol = this.opts.config[this.module].symbol;
	console.log(this.opts.config[this.module].symbol);
	val = val == "" ? "*" : val;

	if (!$.isArray($this.items)) {

		return $.ajax({
			type: 'get',
			url: $this.url + val + "&page=1&count=10",
			cache: false,
		}).done((function($this) {
			return function(result) {
				if ($this.symbol == "$") {
					return $this._renderPopover(result.result.stockList);
				} else {
					return $this._renderPopover(result.result);
				}

			};
		})(this));
	} else {

		return $this.items;

	}

};

/*装载html*/

Mention.prototype._renderPopover = function(result) {

	var userList = [];
	data = result;
	if (!data) {
		//$(".user-list ul").html("");
		return false;
	}
	var len = data.length,
		li = "";

	if (len > 0) {
		for (var i = 0; i < len; i++) {



			name = data[i].userNick || data[i].stockName;
			pinyin = data[i].pinyin || data[i].stockCode;
			type = data[i].type || data[i].type;


			$nick = name.replace(/<\/?[^>]*>/g, '');
			if (this.module == 1) {
				li += "<li>" + $nick + "(" + type + pinyin + ")" + "</li>";
			} else {
				li += "<li>" + $nick + "</li>";
			}

		}

		$(".user-list ul").html(li);
	}

};

/*搜索字符串*/
Mention.prototype._filter = function() {
	var $this = this;

	$("#user-keywords").bind('input propertychange', function(e) {

		console.log(e);
		var p = 0;
		var s = $(this).val();
		console.log(s.length);
		if (s.length < 1) return false;
		setTimeout(function() {

			userlist = $this._getItems(s);


		}, 0)



	})

}

Mention.prototype.oninput = function() {
	var $this = this;
	var textObj = document.getElementById("comment-text");


	$("#comment-text").bind("input propertychange", function(event) {

		var target = event.target,
			cursor = target.selectionStart; //通过 selectionStart 获得光标所在位置
		symbol = target.value.charAt(cursor - 1);

		//检测符号是否有被设置
		var key = 0;
		if ($this.opts.symbols) {
			for (i in $this.opts.symbols) {
				if ($this.opts.symbols[i] == symbol) {
					key = i;
				}
			}
		}
		$this.module = key;
        if(!$this.active) return false;
		if ($.inArray(symbol, $this.opts.symbols) > -1) { //判断光标前的字符是不是'@'
			$this._getItems("*");
            $this.showSearchBox(target, symbol);
		} else {
			html = target.value;
			html = html.replace(/([\n\r])/g, "<br />");
			$("#u-editor").html(html);
			$this.active = false;
		}

		$(".user-list ul ").delegate("li", "click", function() {
			    if($this.active){
                $this.show(target, $(this).text() + $this.opts.config[$this.module].attach);
				$this.active = false;
				}
		 });
		console.log($this.active);

	})


};

Mention.prototype.show = function(target, name) {

	insertAtCursor(target, name + " ");

	this._hide();
}

Mention.prototype.showSearchBox = function(target, symbol) {

	var a = target.value;
	var b = a.substring(a.lastIndexOf(symbol)); //这样就获取到了最后的'ba'
	var c = a.substring(0, a.lastIndexOf(symbol));
	html = c + "<span>" + symbol + "</span>";
	html = html.replace(/([\n\r])/g, "<br />");
	$("#u-editor").html(html);
	//浮窗的位置
	var pos = {};
	span = $("#u-editor").find("span:last");
	console.log(span);
	pos.left = span.offset().left;
	pos.top = span.offset().top;
	console.log(pos);
	$("#user-search-box").show();
	$("#user-search-box").css({
		"left": pos.left + 26,
		"top": pos.top,
		"z-index": 999999
	});
	$("#user-search-box input").val("");
	$("#user-search-box input").focus();
	$("#user-search-box .placeholder").text(this.opts.config[this.module].title);
	this._filter();
	//console.log(this.opts.config[this.module].title);

};

Mention.prototype._hide = function() {
	setTimeout(function() {
		$("#user-search-box").hide();
	})

}

Mention.prototype._getConfig = function() {

		return this.opts.config;
	}
	/*光标处插入文本*/

function insertAtCursor(myField, myValue) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		sel.select();
	}
	//MOZILLA/NETSCAPE support 
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		// save scrollTop before insert www.keleyi.com
		var restoreTop = myField.scrollTop;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
		if (restoreTop > 0) {
			myField.scrollTop = restoreTop;
		}
		myField.focus();
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
	} else {
		myField.value += myValue;
		myField.focus();
	}
}