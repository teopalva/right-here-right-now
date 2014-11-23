/**
 * @description Stores all the information about twitter
 * @constructor
 */
function TwitterModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _oldTweets = [];
    var _tweets = [];

    var _updateTimer = 60000; // 10 secs
    var _timer;

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.updateTweets = function () {

        var proxy = "https://script.google.com/a/macros/mcpher.com/s/AKfycbzGgpLEWS0rKSBqXG5PcvJ7Fpe02fvGqiCqq54SVQmBJSpy_6s/exec";
        var tweetslink = "http://paolobruzzo.altervista.org/project3/twitter.php";
        d3.json(proxy + "?url=" + tweetslink, function (json) {
            var parsedJson = JSON.parse(json.results);
            if(parsedJson) {
                _oldTweets = _tweets;
                _tweets = [];
                parsedJson.statuses.forEach(function (tweet) {
                    if (!contains(_tweets, tweet.text)) {
                        tweet.text = parseTweet(tweet.text);
                        _tweets.push(tweet);
                    }
                });
                notifyDifferences(_oldTweets, _tweets);
            }
        });
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var contains = function (tweets, text) {
        for (i in tweets) {
            if (tweets[i].text.substring(0, tweets[i].text.indexOf("http://")) == text.substring(0, text.indexOf("http://")))
                return true;
        }
        return false;
    };

    var notifyDifferences = function (oldTweets, tweets) {
        for (i in tweets)
            if (!contains(oldTweets, tweets[i].text)) {
                // NOTIFY NEW TWEET
                console.log("New tweet at", formatAMPM(new Date(tweets[i].created_at)) , ":" ,tweets[i].text);

                model.getNewsFeedModel().postTweet(new News("Tweet", tweets[i].text.substring(0, 19) + "...", "assets/icon/twitter.svg", tweets[i].creation_date));
            }

    };


    var parseTweet = function(tweetText) {
        var start = "#BreakingNews";
        if(tweetText.startsWith(start))
            return tweetText.substr(start.length);
        return tweetText;
    };

    var init = function () {
        self.updateTweets();
        _timer = setInterval(self.updateTweets, _updateTimer);
    }();
}