<?php
// $Id:$
//#################################################################
//所有get接口统一用模拟file_get 带上cookie
//只有post接口才需要重写,带上cookie<?php
// $Id:$
//#################################################################
//模拟浏览器请求接口工具
//所有get接口统一用模拟file_get请求，通过判断接口接口类型转apiSend
//#################################################################
header("Content-type:application/json;chaset=UTF-8");
error_reporting(E_ALL^E_NOTICE);
session_start();
define("API_DOMAIN", "http://gelonghui.com/");
define("URI", substr($_SERVER['REQUEST_URI'], 4));
define("API_ADDR", API_DOMAIN . "api" . URI);
$data = file_get_contents('php://input', 'r');

/**/
switch (URI) {
        /*用户登录接口*/
    case "/user/login":
        echo doLogin($data);
        break;
        /*用户注册*/
    case "/user/register":
        echo user_reg_post($data);
        break;
        /*退出登录*/

    default:
        echo file_get($data);
}








//用户登录
function doLogin($data) {
    $header = array(
        'Content-Type: application/json'
    );
    $return = curl_func(API_ADDR, $header, 1, $data);
    preg_match_all('/set-Cookie:\s(.*)\sPath/i', $return, $sessionStr);
    $json = explode("\n\r", $return);
    if($sessionStr[1][0]){
    $_SESSION['cookie'] = $sessionStr[1][0];
	}
    return trim($json[1]);
}
//单纯的提交数据
function apiSend($data) {
    $header = array(
        "Content-Type: application/json;" . "\r\nCookie:" . $_SESSION['cookie']
    );
    $return = curl_func(API_ADDR, $header, 0, $data);
    return $return;
}
//上传图片，还不好用
function apiImg($data) {
    $datas = array(
        'original_filename' => $data['upload_file']['name'],
        'file' => '@' . $data['upload_file']['tmp_name'] . ";filename=" . $data['upload_file']['name']
    );
    $header = array(
        "Content-Type: multipart/form-data;" . "\r\nCookie:" . $_SESSION['cookie']
    );
    $return = curl_func(API_ADDR, $header, 1, $data);
    $return = curl_exec($ch);
    $info = curl_getinfo($ch);
    //print_r($info);
    curl_close($ch);
    return $return;
}
//用户注册
function user_reg_post() {
    echo ApiPost($data, $uri);
}
//退出登录
function get_logout($uri) {
    echo apiGet($uri);
}
//所有get方法
function file_get($data) {
    $referer = API_DOMAIN;
	@$cookie = "" . $_SESSION['cookie'];
	$apiStr = explode('/', URI);
    $apiStr = end($apiStr);
	
    $addApis = array(
        "add", //所有新增
        "delete",
        "follow", //关注与取注
        "unfollow",
        "image", //上传图片
        "comment"//评论
        
    );
    if ($_SERVER['REQUEST_METHOD']=="POST") {
        if ($apiStr == "image") {
            $data = $_FILES;
            echo apiImg($data);//传图还有问题
            exit;
        }
        echo apiSend($data);
        exit;
    } else {
        $method = "GET";
        $data = "";
    }
    $opt = array(
        'http' => array(
            'method' => $method,
            'header' => "User-Agent:Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)\r\nAccept:*/*\r\nReferer:" 
			. $referer . "\r\nCookie:" . $cookie
        )
    );
    $uri = API_ADDR;
    $context = stream_context_create($opt);
    $file_contents = file_get_contents($uri, false, $context);
    return $file_contents;
}

//curl 函数
function curl_func($uri, $header, $hd, $data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $uri);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_HEADER, $hd);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    $return = curl_exec($ch);
    curl_close($ch);
    return $return;
}
?>

