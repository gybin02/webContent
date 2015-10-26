/**
 * 展示内容Html（解析@和$）
 * Created by vincent.chang on 4/28/2015.
 */
GLHApp.directive('contentHtml', ['ApiService', 'CommService', '$compile', function (ApiService, CommService, $compile) {

    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            bindHtml: "@"
        },
        template: "<span ng-transclude='' ></span>",
        link: function (scope, element, attrs) {
            scope.bindHtml = attrs.bindHtml;

            //处理@和$
            scope.crossUAndS = function (text) {
                if (text == null) {
                    return text;
                }
                //var uReg=/@[^\s]+\s?/;
                //匹配开头已@结尾是空格或者冒号 远端原则
                //var uReg = /@\S+?\s|@\S+?\s|@\S+?:/
                var uReg = /@([^(|:| |<|@|&)]*)(|:| |<|@|&)/g;
                //var uReg = /@(.*?)(@| |:|<)/g
                var uRegLen = 0;

                var regText = angular.copy(text);
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
                var regSText = angular.copy(regText);
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
                            var sHtml = '<a ng-href="#/stockDetail/' + stockCode + '" target="flag">' + sArr[0] + '</a>';
                            //var replaceTarget = sArr[2].replace("(", "/(").replace(")", "/)");
                            text = text.replace(new RegExp(replaceTarget, 'gm'), sHtml);
                        }
                    }
                } while (sRegLen > 0)

                return text;
            }
            var html = "<p class='content-html'>" + scope.crossUAndS(attrs.bindHtml) + "</p>";
            var htmlResult = $compile(html)(scope);
            element.append(htmlResult);
        }
    }
}]);