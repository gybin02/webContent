GLHApp.directive('tmPagination', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
    return {
        restrict: 'EA',
        templateUrl: "templates/tmPagination.html",
        replace: true,
        scope: {
            conf: '='
        },
        link: function (scope, element, attrs) {
            //分页条件
            scope.conf = {
                //当前页码
                currentPageNum: 0,
                //每页显示数
                itemsPerPage: 10,
                //页码显示个数
                pagesLength: 9,
                //总页数
                numberOfPages: 0,
                //总记录数
                totalItems: 0
            };
            //分页数据集
            scope.pageList = [];
            scope.pageSelect={};
            scope.pageSelect = { pageListSelect:[],jumpPageNum:1 };
            if (attrs.conf) {
                scope.conf = scope.$parent[attrs.conf];
            }

            // 变更当前页
            scope.changecurrentPageNum = function (item) {
                if (item == '...') {
                    return;
                } else {
                    scope.conf.currentPageNum = item;
                }
            };

            // 定义分页的长度必须为奇数 (default:9)
            scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9;
            if (scope.conf.pagesLength % 2 === 0) {
                // 如果不是奇数的时候处理一下
                scope.conf.pagesLength = scope.conf.pagesLength - 1;
            }

            // prevPage
            scope.prevPage = function () {
                if (scope.conf.currentPageNum > 1) {
                    scope.conf.currentPageNum -= 1;

                }

            };
            // nextPage
            scope.nextPage = function () {
                if (scope.conf.currentPageNum < scope.conf.numberOfPages) {
                    scope.conf.currentPageNum += 1;
                }
            };

            // 跳转页
            scope.jumpToPage = function () {
                    scope.conf.currentPageNum = scope.pageSelect.jumpPageNum;
            };

            scope.$watch('conf.currentPageNum', function (current, pre) {
                if (!scope.conf) {
                    return;
                }

                // jumpPageNum
                scope.pageSelect.jumpPageNum = scope.conf.currentPageNum;


                if (scope.conf.onChange) {
                    scope.scrollTop();
                    scope.conf.onChange();
                }
            });

            scope.$watch(function () {
                return scope.conf.currentPageNum + scope.conf.totalItems
            }, function (current, pre) {
                if (current > 0) {

                    scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.itemsPerPage);

                    scope.pageList = [];
                    if (scope.conf.numberOfPages <= scope.conf.pagesLength) {
                        // 判断总页数如果小于等于分页的长度，若小于则直接显示
                        for (var i = 1; i <= scope.conf.numberOfPages; i++) {
                            scope.pageList.push(i);
                        }
                    } else {
                        // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                        // 计算中心偏移量
                        var offset = (scope.conf.pagesLength - 1) / 2;
                        if (scope.conf.currentPageNum <= offset) {
                            // 左边没有...
                            for (var i = 1; i <= offset + 1; i++) {
                                scope.pageList.push(i);
                            }
                            scope.pageList.push('...');
                            scope.pageList.push(scope.conf.numberOfPages);
                        } else if (scope.conf.currentPageNum > scope.conf.numberOfPages - offset) {
                            scope.pageList.push(1);
                            scope.pageList.push('...');
                            for (var i = offset + 1; i >= 1; i--) {
                                scope.pageList.push(scope.conf.numberOfPages - i);
                            }
                            scope.pageList.push(scope.conf.numberOfPages);
                        } else {
                            // 最后一种情况，两边都有...
                            scope.pageList.push(1);
                            scope.pageList.push('...');

                            for (var i = Math.ceil(offset / 2); i >= 1; i--) {
                                scope.pageList.push(scope.conf.currentPageNum - i);
                            }
                            scope.pageList.push(scope.conf.currentPageNum);
                            for (var i = 1; i <= offset / 2; i++) {
                                scope.pageList.push(scope.conf.currentPageNum + i);
                            }

                            scope.pageList.push('...');
                            scope.pageList.push(scope.conf.numberOfPages);
                        }
                    }

                }

            });

            scope.$watch('conf.totalItems', function (current, pre) {
                if (current > 0) {
                    var numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.itemsPerPage);
                    scope.pageSelect.pageListSelect = [];
                    for (var i = 1; i <= numberOfPages; i++) {
                        scope.pageSelect.pageListSelect.push(i);
                    }
                }

            });

            //滚动到顶部
            scope.scrollTop = function () {
                var old = $location.hash();
                $location.hash('bodyHeader');
                $anchorScroll();
                $location.hash(old);
            }
        }
    };
}]);
