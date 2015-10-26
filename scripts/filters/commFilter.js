/**
 * 公用Filter Created by vincent.chang on 4/30/2015.
 */

//文字超长截断并出现省略号
GLHApp.filter('ellipsis', function () {
    return function (text, length) {
        if (text != null && text.length > length) {
            return text.substr(0, length) + "...";
        }
        return text;
    }
});

//文字超长截断并出现省略号
GLHApp.filter('defaultImg', function () {
    return function (url) {
        if (url == null ||url.toString()=="") {
            return "images/default.jpg";
        }
        return url;
    }
});

