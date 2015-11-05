function userList(val) {
	var val = val;
	var resultBox = $(".simditor-mention-popover>.items");
	$.ajax({
		type: "GET",
		url: "/api/post/lastCalls?key=" + val + "&page=1&count=10",
		async: true,
		beforeSend: function() {},
		success: function(data) {
			data = data.result;
			var htmls = "";
			//如果没关注用户
			if (data == null) {
				data = [{
					userNick: "搜索用户"
				}];
			}
			var len = data.length;

			if (len > 0) {
				for (var i = 0; i < len; i++) {
					$nick = data[i].userNick.replace(/<\/?[^>]*>/g, '');
					htmls += "<span  data-url='xxx' class='item' data-pinyin='' data-name='" + $nick + " '><span>" + $nick + " </span></span>";
				}
			}
			resultBox.html(htmls);
			/*给第一元素增加class*/
			resultBox.find(".item").first().addClass('selected');

		}
	});
	
}

function stockList(val) {

	var val = val;
	var resultBox1 = $(".simditor-stock-popover>.items");
	$.ajax({
		type: "GET",
		url: "/api/search/stock?keyword=" + val + "&count=10&page=1",
		async: true,
		beforeSend: function() {},
		success: function(data) {
			data = data.result;
			var htmls1 = "";
			console.log(data.result);
			if (data.stockList.length < 1) {
				data.stockList = [{
					stockName: "搜索股票",
					stockCode: 001
				}];
			}
			var len1 = data.stockList.length;

			if (len1 > 0) {
				for (var i = 0; i < len1; i++) {
					$stock = data.stockList[i].stockName.replace(/<\/?[^>]*>/g, '');
					console.log($stock);
					htmls1 += "<span class='item'  data-abbr='" + data.stockList[i].type + "' data-pinyin='" + data.stockList[i].stockCode + "'  data-name='" + $stock + "'><span>" + $stock + "(" + data.stockList[i].type + data.stockList[i].stockCode + ")</span></span>";
				}
			}
			resultBox1.html(htmls1);
			resultBox1.find(".item").first().addClass('selected');
		}
	});
}

/*提交文章*/
$("#glh-submit").click(function() {

	/*先验证*/
	title = $("#doc-title").val();
	content = $("#doc-content").val();
	//过滤掉外链
	//content = clearAlink(content);
	/*在提交时候处理不合适*/
   // content=addLink(content);
   //alert(content);return;
	var $this = $(this);
	if (!title || !content) {

		$(this).attr("disabled", true).text("标题或内容不能为空!"), setTimeout(function() {
			$this.removeAttr("disabled").text("发布")
		}, 3e3);
		return false;

	}

	$.ajax({
		type: "POST",
		url: "/api/post/add",
		async: true,
		dataType: "json",
		contentType: "application/json;charset=UTF-8",
		data: JSON.stringify({
			type: 1,
			title: title,
			content: content
		}),
		beforeSend: function() {
			$this.attr("disabled", true).text($this.data("disable-with"));
		},
		success: function(data) {
			if (data.statusCode == 200) {
				var e = simple.dialog({
					width: 360,
					content: "发表成功，你可以选择以下操作",
					buttons: [{
						text: "查看文章",
						callback: function() {
							clearData();
							window.location = '/p/' + data.result+".html";
						}
					}, {
						text: "再来一发",
						//cls: "btn-x btn-warn",
						callback: function() {
							//删除本地数据继续发表
							e.remove();
							clearData();
							$this.removeAttr("disabled").text("发表文章");

						}
					}]
				})
				$this.attr("disabled", true).addClass("success").text($this.data("success-text") + " \u2713");
			} else if (data.statusCode == 403) {
				/*去登录*/
				glhLogin.showLogin();
			} else {
				$this.attr("disabled", true).text("发布失败"),
					setTimeout(function() {
						$this.removeAttr("disabled").text("发表文章")
					}, 3e3);
			}
		}
	});

})

/*清除预设内容*/
function clearData() {
		localStorage.removeItem("localData_"+$.parseJSON(localStorage.user).user.userId);
		$("#doc-title").val("");
		$("#doc-content").val("");
		$(".simditor-body").html("");
	}

	/*过滤函数*/
function clearAlink(text) {
		var linkReg = /<a href="([\s\S]*?)"([\s\S]*?)>([^<>]*?)<\/a>/g;
		var newC = text.match(linkReg); //取出所有连接
		var newText = text;
		/*替换掉外链*/
		for (var i = 0; i < newC.length; i++) {
			var pa = /.*<a[^>]*>/gm;
			var pea = /<\/a>[.]*/gm;
			hrefReg = /href="(.*?)"/
			linkUrl = hrefReg.exec(newC[i]);
			if (linkUrl[1].indexOf('gelonghui.com') == -1) {
				newText = newText.replace(newC[i], newC[i].replace(pa, "").replace(pea, ""));
			}
		}
		return newText;
	}


           function addLink (text) {
                if (text == null) {
                    return text;
                }
                //var uReg=/@[^\s]+\s?/;
                //匹配开头已@结尾是空格或者冒号 远端原则
                //var uReg = /@\S+?\s|@\S+?\s|@\S+?:/
                var uReg = /@([^(|:| |<|@|&)]*)(|:| |<|@|&)/g;
                //var uReg = /@(.*?)(@| |:|<)/g
                var uRegLen = 0;

                var regText = text;
                do {
                    var uArr = uReg.exec(regText);
                    uRegLen = uArr == null ? 0 : uArr.length;
                    if (uArr != null && uArr.length > 0) {
                        for (var i = 0; i < uArr.length; i++) {
                            if (uArr[i].indexOf("@") >= 0 && uArr[i].length > 1) {
                                var nick = uArr[i].substring(1, uArr[i].length);
                                var uHtml = '<a user-popover user-Nick="' + nick + '">' + uArr[i] + '</a>';
                                text = text.replace(new RegExp(uArr[i], 'gm'), uHtml);
                            }
                        }
                    }
                } while (uRegLen > 0)


                //匹配以$开头,$+空格结尾的字符
                var sReg = /\$(.*?)\((.*?)\)\$/g;
                var sRegLen = 0;
                var regSText = text;
                do {
                    var sArr = sReg.exec(regSText);
                    sRegLen = sArr == null ? 0 : sArr.length;
                    if (sArr != null && sArr.length >= 3) {
                        if (sArr[0].indexOf("$") >= 0 && sArr[0].indexOf("(") >= 0 && sArr[0].indexOf(")") >= 0
                            && sArr[0].length > 3 && sArr[1].length > 0 && sArr[2].length > 0) {
                            //提取股票代码
                            sArrNew=sArr[2].replace(')','\\)').replace('(','\\(');
                            dReg=/[a-zA-Z.0-9]+|[0-9]+/;
                            stockCode=dReg.exec(sArrNew);
                            var replaceTarget = '\\$' + sArr[1] + '\\(' + sArrNew+ '\\)\\$';
                            var sHtml = '<a href="/#/stockDetail/' + stockCode + '" target="flag">' + sArr[0] + '</a>';
                            //var replaceTarget = sArr[2].replace("(", "/(").replace(")", "/)");
                            text = text.replace(new RegExp(replaceTarget, 'gm'), sHtml);
                        }
                    }
                } while (sRegLen > 0)

                return text;
            }



	/*验证登录*/
$(document).ready(function() {
glhLogin.loginStatus(1)
})