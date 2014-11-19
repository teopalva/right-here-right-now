<?php

// Path that the oauth library is in relation to the php file
require_once('external-libraries/OAuth.php');

// Set your OAuth credentials here
$CONSUMER_KEY = 'Mqvls0Tdbrtm9NwUciazeA';
$CONSUMER_SECRET = 'jUAuIR1xmsi4-VGVXHmJulHKsbk';
$TOKEN = 'e2xALgOYHVqBBLOyKerrs3sS3GS1HY4P';
$TOKEN_SECRET = 'BIGvwxadEpL5wWgLARACcdavH-E';
$API_HOST = 'api.yelp.com';

$SEARCH_PATH = '/v2/search/';
$DEFAULT_TERM = 'restaurants';
$DEFAULT_LOCATION = 'Chicago, IL';

$SEARCH_LIMIT = 20;
$SEARCH_OFFSET = 0;
$SEARCH_SORT = 0; // Best match

/** 
 * Makes a request to the Yelp API and returns the response
 * 
 * @param    $host    The domain host of the API 
 * @param    $path    The path of the APi after the domain
 * @return   The JSON response from the request      
 */
function request($host, $path) {
    $unsigned_url = "http://" . $host . $path;
    // Token object built using the OAuth library
    $token = new OAuthToken($GLOBALS['TOKEN'], $GLOBALS['TOKEN_SECRET']);
    // Consumer object built using the OAuth library
    $consumer = new OAuthConsumer($GLOBALS['CONSUMER_KEY'], $GLOBALS['CONSUMER_SECRET']);
    // Yelp uses HMAC SHA1 encoding
    $signature_method = new OAuthSignatureMethod_HMAC_SHA1();
    $oauthrequest = OAuthRequest::from_consumer_and_token(
        $consumer, 
        $token, 
        'GET', 
        $unsigned_url
    );
    
    // Sign the request
    $oauthrequest->sign_request($signature_method, $consumer, $token);
    
    // Get the signed URL
    $signed_url = $oauthrequest->to_url();
    
    // Send Yelp API Call
    $ch = curl_init($signed_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    
    return $data;
}

/**
 * Query the Search API by a search term and location
 */
function search($limit,$offset) {
    $url_params = array();
    
    $url_params['term'] = $GLOBALS['DEFAULT_TERM'];
    $url_params['location'] = $GLOBALS['DEFAULT_LOCATION'];
    $url_params['sort'] = $GLOBALS['SEARCH_SORT'];

    if($limit){
        $url_params['limit'] = $limit;
    }
    else
    {
        $url_params['limit'] = $GLOBALS['SEARCH_LIMIT'];
    }

    if($offset){
        $url_params['offset'] = $offset;
    }
    else
    {
        $url_params['offset'] = $GLOBALS['SEARCH_OFFSET'];
    }

    $search_path = $GLOBALS['SEARCH_PATH'] . "?" . http_build_query($url_params);

    $res = request($GLOBALS['API_HOST'], $search_path);

    echo $res;
}

/**
 * User input is handled here 
 */

if($_GET['limit']){
    $limit=$_GET['limit'];
}
else
{
    $limit = '';
}

if($_GET['offset']){
    $offset = $_GET['offset'];
}
else
{
    $offset = '';
}

search($limit,$offset);
?>