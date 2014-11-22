<?php
require_once('external-libraries/TwitterAPIExchange.php');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    
    /* @teopalva
    'oauth_access_token' => "75018139-HWokuhmzfWaftBHrDi8qDnHAGbMGPgnhQkpkNsYcG",
    'oauth_access_token_secret' => "K9Ulnw6mxmoyLSM3pYIH2zDqXP7V6MQJm6jV923LcLr18",
    'consumer_key' => "gy6KZu4HCufZCqzgRy8MtpNCb",
    'consumer_secret' => "ojkVboV0AzPNQVkKFJLgvEuT5hOvTB7BOdmXAxeOa1EWNhBfrO"
    */
    
    // @CS424_project3
    'oauth_access_token' => "2887401460-zRXV3QseHfAdHJNN8tFTiUNXgz2L5uG5qM0sGmQ",
    'oauth_access_token_secret' => "D8NHHEF2sSFxAJEqlLnJsHRH0p7sthlQt7LhELW4lOF17",
    'consumer_key' => "MWymbEj23gaZkGjcpPW02aYCT",
    'consumer_secret' => "iKk9rXQ4iqHhQlBSZlzBL9dbDVmZ1Rm7iCPC33W0ltnrbeFUpY"
);

$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=breakingnews%20AND%20chicago&lang=en&count=100';
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();
?>