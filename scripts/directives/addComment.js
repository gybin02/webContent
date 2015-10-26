/**
 * Created by liaozhida on 3/26/2015.
 */
GLHApp.directive('addComment', function(){
    return {
        restrict: 'AE',
        replace: true,
        scope: {

        },
        templateUrl: "templates/add-comment.html",
       // template: "<textarea class='form-control' rows='6' placeholder='请发表帖子' ng-model = 'contentModel'></textarea>",
        link : function(scope, element, attrs) {
            scope.submitComment = function () {
            	
            };
            
            scope.addStock = function (){
            	debugger;
            	var contentVal = typeof scope.contentModel == "undefined" ? "" : scope.contentModel;
            	scope.contentModel = contentVal + "$";
            	element.append("<div>heee</div>");
            };
            
            scope.addMan = function (){
            	var contentVal = typeof scope.contentModel == "undefined" ? "" : scope.contentModel;
            	scope.contentModel = contentVal + "@";
            };
            
            scope.changeTextArea = function(){
            	debugger;
            	var t = document.getElementById('txtContent'); 
            	var data = getCursorPosition();
            	alert(t.selectionStart);
            	alert(t.selectionEnd);
               // h = t.scrollHeight; 
            }
            
        },
    }
});

