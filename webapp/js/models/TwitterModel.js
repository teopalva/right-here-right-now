/**
 * @description Stores all the information about twitter
 * @constructor
 */
function TwitterModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _oldTweets = [];
    var _tweets = [];

    var _updateTimer = 10000; // 10 secs
    var _timer;

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.updateTweets = function () {

        _oldTweets = _tweets;
        _tweets = [];
        var tweetslink = "http://0.0.0.0:8888/webapp/php/twitter.php";
        d3.json(tweetslink, function (json) {
            json.statuses.forEach(function (tweet) {
                if(! contains(_tweets,tweet.text)) {
                    _tweets.push(tweet);
                    //console.log(new Date(tweet.created_at), " -", tweet.retweet_count, ": ", tweet.text);
                    //console.log("Count: ", tweet.retweet_count , "Text: ", tweet.text);
                }
            });
            console.log(_tweets.length);
            notifyDifferences(_oldTweets,_tweets);
        });
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var contains = function(tweets, text){
        for(i in tweets){
            if(tweets[i].text.substring(0,tweets[i].text.indexOf("http://")) == text.substring(0,text.indexOf("http://")))
                return true;
        }
        return false;
    };

    var notifyDifferences = function (oldTweets, tweets) {
        if(oldTweets.length > 0)
            for (i in tweets)
                if (!contains(oldTweets, tweets[i].text))
                    console.log("New tweet !: ", tweets[i].text);
    };

    var init = function () {
        self.updateTweets();
        _timer = setInterval(self.updateTweets,_updateTimer);
    }();
}