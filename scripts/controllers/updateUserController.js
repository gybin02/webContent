GLHApp.controller('UserUpdateController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'ApiService', '$UserService', 'FileUploader', 'DialogService', '$q',
    function ($scope, $rootScope, $http, $location, $routeParams, ApiService, $UserService, FileUploader, DialogService, $q) {

        //未登录的情况
        if (!$UserService.isLoggedIn()) {
            //通知打开登录框
            $UserService.authPage($scope);
        }

        //初始默认显示个人资料
        $scope.active = 0;

        $scope.confirmError = false;

        //定义上传对象
        var uploader = $scope.uploader = new FileUploader({
            url: ApiService.getApiUrl().screenShot.url
        });

        //修改头像的情况下默认显示修改头像Tab
        if ($routeParams.type == "avatar") {
            $scope.active = 1;
        }

        $scope.sexModel = "M";

        $scope.errSpan = false;

        $scope.loginShow = false;

        $scope.obj = {}

        // The url or the data64 for the image
        // $scope.obj.src = 'sample_img/img01.png';
        $scope.obj.selection = [100, 100, 200, 200, 100, 100];

        // You can add a thumbnail if you want
        $scope.obj.thumbnail = true;

        if (!$UserService.isLoggedIn()) {
            $scope.setNick = false;
        } else {
            $scope.setNick = true;
        }

        $scope.setUserUpTab = function (active) {
            $scope.active = active;

            //修改头像的情况下需要默认显示头像裁剪
            if (active == 1) {
                $location.path('/userUpdate/avatar/' + $routeParams.userId);
            }
        };

        $scope.loginShow = $UserService.isLoggedIn();

        $scope.getUserInfoMsg = function () {
            var deferred = $q.defer();
            var successCallBack = function (response) {
                var resultData = response.result;
                $scope.countrys = resultData.country;
                $scope.tmpCountrys = resultData.country;
                $scope.states = resultData.state;
                $scope.tmpstates = resultData.state;
                $scope.citys = resultData.city;
                $scope.tmpcitys = resultData.city;
                $scope.giscs = resultData.gisc;
                var yearCounts = "[";
                for (var i = 0; i <= 80; i++) {
                    yearCounts += "{value:" + i + ",count:'" + i + "年'},"
                }
                yearCounts = yearCounts.substr(0, yearCounts.length - 1);
                yearCounts += "]"
                $scope.years = eval("(" + yearCounts + ")");
                $scope.isbaseLoaded = true;
                deferred.resolve();
            };

            ApiService.get(ApiService.getApiUrl().getInfo, {}, successCallBack,
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        $scope.isbaseLoaded = true;
                        deferred.reject(response.message);
                    }
                }
            );
            return deferred.promise;
        }

        var getUserInfocallback = function(response){
            var user = response.result.user;
            $scope.nickName = user.nick;
            if (user.sex) {
                $scope.sexModel = user.sex;
            }
            $scope.briefModel = user.userBrief;
            if (user.country) {
                for (var i in $scope.tmpCountrys) {
                    if (user.country == $scope.tmpCountrys[i].code) {
                        $scope.countryModel = $scope.tmpCountrys[i];
                        $scope.changeCountry();
                        break;
                    }
                }
            }

            if (user.state) {
                for (var i in $scope.tmpstates) {
                    if (user.state == $scope.tmpstates[i].code) {
                        $scope.stateModel = $scope.tmpstates[i];
                        $scope.changeState();
                        break;
                    }
                }
            }

            if (user.city) {
                for (var i in $scope.tmpcitys) {
                    if (user.city == $scope.tmpcitys[i].code) {
                        $scope.cityModel = $scope.tmpcitys[i];
                        break;
                    }
                }
            }

            var professions = response.result.professions;
            if (professions.length > 0) {
                if (professions.length > 1) {
                    $scope.canDel = true;
                }
                $scope.addgics = [];
                for (var i = 0; i < professions.length; i++) {
                    var gisc;
                    var year;
                    for (var n in $scope.giscs) {
                        if (professions[i].professions == $scope.giscs[n].clsName) {
                            gisc = $scope.giscs[n];
                            break;
                        }
                    }

                    for (var n in $scope.years) {
                        if (professions[i].time == $scope.years[n].value) {
                            year = $scope.years[n];
                            break;
                        }
                    }
                    var agic = {key: i, gisc: gisc, year: year};
                    $scope.addgics.push(agic);
                }

            } else {
                $scope.canDel = false;
                $scope.addgics = [
                    {key: 0, gisc: '', year: ''}
                ];
            }

            var srcIndex = user.avatar.indexOf("@");
            var avatarSrc = user.avatar;
            //如果是已经存储了截图图片的位置
            if (srcIndex > 0) {
                avatarSrc = user.avatar.substring(0, srcIndex);
                $scope.obj.src = avatarSrc;
//                                var location = user.avatar.substring(srcIndex + 1, user.avatar.length - 1).split("-");
//                                var x = parseInt(location[0], 10);
//                                var y = parseInt(location[1], 10);
//                                var width = parseInt(location[2], 10);
//                                var height = parseInt(location[3], 10);
//                                $scope.obj.selection = [x , y, x + width, y + height, width, height];
            } else {
                $scope.obj.src = avatarSrc;
                // Must be [x, y, x2, y2, w, h]
//                                $scope.obj.selection = [100, 100, 200, 200, 100, 100];
            }
        }

        //获取国家，地区，城市，行业等信息填充页面
        $scope.getUserInfoMsg().then(function (data) {
            //登陆后修改用户资料数据初始化
            if ($UserService.isLoggedIn()) {
                // 使用ID获取用户信息
                $scope.getUserById = function () {
                    var params = {userId: $routeParams.userId};
                    ApiService.get(ApiService.getApiUrl().getUserDetail, params,getUserInfocallback,
                        function (response,status) {
                            if(response.statusCode == 403){
                                $UserService.authPage($scope);
                            }


                        }
                    );
                }
                $scope.getUserById();
            }

        }, function (err) {
            DialogService.launch("error", err);
        });


        $scope.checkLen = function (val) {
            var maxChars = 200;//最多字数
            if (val.briefModel.length > maxChars) {
                val.briefModel = val.briefModel.substring(0, maxChars);
            }
            /*var curr = maxChars - val.briefModel.length;
            document.getElementById("briefModel").innerHTML = curr.toString();*/
        };

        //由国家变化修改地区和城市变化
        $scope.changeCountry = function () {
            var oldCountry = $scope.countryModel;
            if (typeof oldCountry != 'undefined' && oldCountry) {
                var oldStates = $scope.tmpstates;
                var oldCitys = $scope.tmpcitys;
                var newStates = [];
                var newCitys = [];
                for (var i = 0; i < oldStates.length; i++) {
                    if (oldStates[i].cCode == oldCountry.code) {
                        newStates.push(oldStates[i]);
                        for (var n = 0; n < oldCitys.length; n++) {
                            if (oldStates[i].code == oldCitys[n].sCode) {
                                newCitys.push(oldCitys[n]);
                            }
                        }
                    }
                }
                $scope.states = newStates;
                $scope.citys = newCitys;
                $scope.stateModel = "";
                $scope.cityModel = "";
            } else {
                $scope.states = $scope.tmpstates;
                $scope.citys = $scope.tmpcitys;
                $scope.stateModel = "";
                $scope.cityModel = "";
            }
        };

        //由地区变化修改城市变化
        $scope.changeState = function () {
            var oldState = $scope.stateModel;
            if (typeof oldState != 'undefined' && oldState) {
                var oldCitys = $scope.tmpcitys;
                var newCitys = [];
                for (var n = 0; n < oldCitys.length; n++) {
                    if (oldState.code == oldCitys[n].sCode) {
                        newCitys.push(oldCitys[n]);
                    }
                }
                $scope.citys = newCitys;
                $scope.cityModel = "";
                $scope.countryModel = "";
                var oldCountrys = $scope.tmpCountrys;
                for (var i = 0; i < oldCountrys.length; i++) {
                    if (oldCountrys[i].code == oldState.cCode) {
                        $scope.countryModel = oldCountrys[i];
                        break;
                    }
                }
            } else {
                $scope.citys = $scope.tmpcitys;
                $scope.cityModel = "";
            }
        };

        //由城市变化修改国家和地区变化
        $scope.changeCity = function () {
            var oldCity = $scope.cityModel;
            if (typeof oldCity != 'undefined' && oldCity) {
                var oldState = $scope.tmpstates;
                for (var n = 0; n < oldState.length; n++) {
                    if (oldCity.sCode == oldState[n].code) {
                        $scope.stateModel = oldState[n];
                        var oldCountrys = $scope.tmpCountrys;
                        for (var i = 0; i < oldCountrys.length; i++) {
                            if (oldCountrys[i].code == oldState[n].cCode) {
                                $scope.countryModel = oldCountrys[i];
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        };

        //设置能力圈动态变化
        if (!$UserService.isLoggedIn()) {
            $scope.canDel = false;
            $scope.addgics = [
                {key: 0, gisc: "", year: ""}
            ];
        }

        //增加能力圈
        $scope.addProfessions = function ($index) {
            $scope.addgics.splice($index + 1, 0, { key: new Date().getTime(), gisc: "", year: "" });   // 用时间戳作为每个item的key
            $scope.canDel = true;
        };

        //删除能力圈
        $scope.delProfessions = function ($index) {
            if ($scope.addgics.length > 1) {
                $scope.addgics.splice($index, 1);
            }

            if ($scope.addgics.length == 1) {
                $scope.canDel = false;
            }
        };

        //提交用户修改资料
        $scope.updateSubmit = function () {
            var sexVal = $scope.sexModel;

            var countryVal = $scope.countryModel;
            var countryData = typeof countryVal != 'undefined' && countryVal ? countryVal.code : "";

            var stateVal = $scope.stateModel;
            var stateData = typeof stateVal != 'undefined' && stateVal ? stateVal.code : "";

            var cityVal = $scope.cityModel;
            var cityData = typeof cityVal != 'undefined' && cityVal ? cityVal.code : "";

            var mergeData = "[";
            for (var i = 1; i <= $scope.addgics.length; i++) {
                var giscName = "addGIC" + i;
                var gisc = document.getElementById(giscName);
                var giscVal = gisc.options[gisc.selectedIndex].value ? gisc.options[gisc.selectedIndex].text : "";

                var yearName = "addYear" + i;
                var year = document.getElementById(yearName);
                var yearVal = year.options[year.selectedIndex].value ? year.options[year.selectedIndex].value : "";

                if (giscVal && yearVal) {
                    mergeData += "{professions:'" + giscVal + "',time:'" + yearVal + "'},";
                }
            }
            mergeData = mergeData.length > 1 ? mergeData.substr(0, mergeData.length - 1) : mergeData;
            mergeData += "]";

            var result = eval("(" + mergeData + ")");

            var briefVal = $scope.briefModel;
            var briefData = typeof briefVal != 'undefined' && briefVal ? briefVal : "";

            var nickName = $scope.nickName;

            //注册成功回调
            var successCallBack = function (data) {
                if (!$UserService.isLoggedIn()) {
                    $location.path("/success/register");
                } else {
                    var userInfo = $UserService.getUser();
                    //修改本地存储用户信息
                    userInfo.user.nickname = nickName;
                    $UserService.setUser(userInfo);
                    //通知主页面用户资料修改
                    $scope.$emit("userChangeInfo", {});
                    DialogService.launch("notify", "恭喜您，用户资料修改成功。");
                }
            };
            var data = {user: {nick: nickName, userId: $routeParams.userId, sex: sexVal, country: countryData, state: stateData, city: cityData, userBrief: briefData}, professions: result};

            ApiService.put(ApiService.getApiUrl().updateInfo, {}, data, successCallBack,
                function (response, status) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                }
            );
        };

        $scope.updatePWD = function (isValid) {
            if (!isValid) {
                $scope.updatePWDForm.submitted = true;
                return;
            }

            if ($scope.firstPWD != $scope.confirmPWD) {
                $scope.confirmError = true;
                return;
            } else {
                $scope.confirmError = false;
            }

            var data = {user: {password: $scope.firstPWD}, oldPassword: $scope.oldPWp};
            ApiService.post(ApiService.getApiUrl().updatePassword, {}, data, function (response) {
                DialogService.launch("notify", "密码修改成功");
                $scope.firstPWD = "";
                $scope.oldPWp = "";
                $scope.confirmPWD = "";
            }, function (response) {
                if (response.statusCode == 406 || response.statusCode == 417) {
                    DialogService.launch("error", response.message);
                }
            })
        }

        //上传头像
        uploader.onAfterAddingFile = function (fileItem) {

            if (fileItem.file.type != "image/png" && fileItem.file.type != "image/jpeg") {
                DialogService.launch("notify", "请上传.jpg|.jpeg|.png的图片文件");
                return;
            }

            if (fileItem.file.size / 1024 / 1024 > 3) {
                DialogService.launch("notify", "选择的头像大于3M，请重新选择");
                return;
            }
            $scope.showProgressbar = true;
            fileItem.upload();
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.showProgressbar = false;

            //上传成功
            if (response.statusCode == 200) {
                //图片显示
                $scope.obj.src = response.result;
//                var im = document.createElement('img');
//                im.src = response.result;
//                im.onload = function () {
//
//                    if (this.width < 200 || this.height < 200) {
//                        $scope.obj.selection = [0, 0, this.width, this.height, this.width, this.height];
//                    } else {
//
//                        // $scope.canSaveAvatar = true;
//
//                        // Must be [x, y, x2, y2, w, h]
//                        $scope.obj.selection = [100, 100, 200, 200, 100, 100];
//                    }
//                }
            }
            // $scope.showSuccessFile = true;
        };

//上传裁剪后的头像
        $scope.uploadAvatar = function () {
            // $scope.canSaveAvatar = false;
            var params = {avatarPath: $scope.obj.src,
                x: $scope.obj.selection[0],
                y: $scope.obj.selection[1],
                width: $scope.obj.selection[4],
                height: $scope.obj.selection[5]};
            ApiService.post(ApiService.getApiUrl().cropAvatar, params, {}, function (response) {
                var userInfo = $UserService.getUser();
                //修改本地存储用户信息
                userInfo.user.avatar = response.result;
                $UserService.setUser(userInfo);
                //通知主页面用户资料修改
                $scope.$emit("userChangeInfo", {});
                DialogService.launch("notify", "头像上传成功");
            }, function (response) {

            });
        }

    }])
;