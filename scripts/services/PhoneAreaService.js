/**
 * Created by vincent.chang on 4/13/2015.
 */
/**
 * 电话区号
 * Created by vincent.chang on 4/3/2015.
 */
GLHApp.factory('PhoneAreaService', ["$resource", "$location", "$window", '$http', function ($resource, $location, $window, $http) {

    var service = {};

    //电话号码区号
    service.areaNums = [{value:'0086',name:'中国(+0086)'}];

    return service;
}]);
