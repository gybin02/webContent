/**
 * Created by liao on 2015/9/1.
 */
$(document).ready(function(){

    //两个flag为true关闭下拉栏
    var flagA = true;   
    var flagB = true;

    //通知图标
    $(".gl-notice").mouseenter(function() {
        $(".gl-notice-ul").css("display","block").css("background-color","#0088c3");
        flagA = false;
    });
    $(".gl-notice-ul").mouseenter(function() {
        $(".gl-notice-ul").css("display","block").css("background-color","#0088c3");
        flagB = false;
    });

    $(".gl-notice").mouseleave(function() {
        flagA = true;
        if(flagA==true && flagB==true){
            $(".gl-notice-ul").css("display","none");
        }
    });
    $(".gl-notice-ul").mouseleave(function() {
        flagB = true;
        if(flagA==true && flagB==true){
            $(".gl-notice-ul").css("display","none");
        }
    });


    // 发表图标
    $(".gl-post").mouseenter(function() {
        $(".gl-post-ul").css("display","block").css("background-color","#0088c3");
        flagA = false;
    });
    $(".gl-post-ul").mouseenter(function() {
        $(".gl-post-ul").css("display","block").css("background-color","#0088c3");
        flagB = false;
    });

    $(".gl-post").mouseleave(function() {
        flagA = true;
        if(flagA==true && flagB==true){
            $(".gl-post-ul").css("display","none");
        }
    });
    $(".gl-post-ul").mouseleave(function() {
        flagB = true;
        if(flagA==true && flagB==true){
            $(".gl-post-ul").css("display","none");
        }
    });

    /*用户头像图标*/
    $(".gl-user").mouseenter(function() {
        $(".gl-user-ul").css("display","block").css("background-color","#0088c3");
        flagA = false;
    });
    $(".gl-user-ul").mouseenter(function() {
        $(".gl-user-ul").css("display","block").css("background-color","#0088c3");
        flagB = false;
    });

    $(".gl-user").mouseleave(function() {
        flagA = true;
        if(flagA==true && flagB==true){
            $(".gl-user-ul").css("display","none");
        }
    });
    $(".gl-user-ul").mouseleave(function() {
        flagB = true;
        if(flagA==true && flagB==true){
            $(".gl-user-ul").css("display","none");
        }
    });
    /*公共悬浮框隐藏*/
                
    
});