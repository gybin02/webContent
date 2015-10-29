/*
 * 公共js脚本，一些全局的方法写在这里  zhongyi 2015-10-28
 */

/*将所有页面动态插入下载app的dom*/
	function appendDownLoad() {
        var downHtml = "";
		downHtml += '<nav id="downLoadDialog" style="display: none; top:0;z-index:9999; position: fixed; width: 100%; background: #434343;">';
		downHtml += '<div id="textTip-logo">';
		downHtml += '<img style="float:left;margin:8px;height:30px; margin-left:15px" src="/images/logo.png" style="height:25px;">';
		downHtml += '</div>';
		downHtml += '<div>';
		downHtml += '<a class="close"  href="javascript:hideDownloadAppLink()" style="float:right;margin-top:0px; margin-right:4px">';
		downHtml += '<span aria-hidden="true" style="color: #ffffff;font-size: 20px;margin-right:10px">&times;</span>';
		downHtml += '</a>';
		downHtml += '<a  style="float:right;margin:8px; margin-right:10px; padding:6px;border-radius: 4px; font-size:12px; background:#007AFF;color:#FFFFFF" class="btn-dowLoad" href="javascript:downloadAppLink()">点击下载APP</a>';
		downHtml += '</div>';
		downHtml += '</nav>';
		//$(downHtml).appendTo($("body"));
		$("body").prepend(downHtml);
		if ($(window).width() < 560) {
			$("#downLoadDialog").show();
		}
    }

	$(document).ready(function() {
		appendDownLoad();
	})

function downloadAppLink() {
		if (/android/i.test(navigator.userAgent)) {
			window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.gelonghui.glhapp";
		}
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
			window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.gelonghui.glhapp";
		}
		
	}

function hideDownloadAppLink(){
	$("#downLoadDialog").hide();
}
