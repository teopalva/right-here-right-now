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

$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

$getfield3 = '?screen_name=teopalva';
$getfield4 = '?result_type=popular&locations=-180,-90,180,90';
$getfield = '?result_type=popular&locations=41.714255,-87.981386,42.014935,-87.524080';
$getfield2 = '?screen_name=JonSolworth&result_type=popular&geocode=-41.885091,-87.692992,25km';
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();
?>