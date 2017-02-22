<?php
//hämtar användar data från requestet
function GetUserInformation() {
    //sätter ip till ip addressen
    $ip = $_SERVER['REMOTE_ADDR'];
    //sätter $userAgent till string från HTTP_USER_AGENT
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    //sätter browser
    $browser = GetBrowser($userAgent);
    //sätter OS
    $os = GetOS($userAgent);
    
    return Array('ip' => $ip, 'browser' => $browser, 'os' => $os);
}

function GetBrowser($agent){
    //Försöker matcha en del av strängen med en mindre string för att få ut Browser
    if(preg_match('/Firefox/i', $agent)){
        return 'Firefox';
    }
    else if(preg_match('/Chrome/i', $agent)){
        return 'Chrome';
    }
    else if(preg_match('/Safari/i', $agent)){
        return 'Safari';
    }
    else if(preg_match('/Opera/i', $agent)){
        return 'Opera';
    }
    else if(preg_match('/MSIE/i', $agent)){
        return 'Internet Explorer';
    }
    else {
        return 'Unknown';
    }
}
function GetOS($agent){
    //Försöker matcha en del av strängen med en mindre string för att få ut OS
    if(preg_match('/linux/i', $agent)){
        return 'Linux';
    }
    else if(preg_match('/macintosh|mac os x/i', $agent)){
        return 'MacOS';
    }
    else if(preg_match('/windows/i', $agent)){
        return 'Windows';
    }
    else {
        return 'Unknown';
    }
}

