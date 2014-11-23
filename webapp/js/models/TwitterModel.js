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
    var _tweetDetail;

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

    this.setTweetDetail = function (tweet) {
        _tweetDetail = tweet;
        notificationCenter.dispatch(Notifications.twitter.TWEET_DETAIL_REQUESTED);
    };

    this.getTweetDetail = function () {
        return _tweetDetail;
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
                console.log("New tweet at: ", new Date(tweets[i].created_at),tweets[i].text);
                var name = tweets[i].user.name;
                var nick = "@" + tweets[i].user.screen_name;
                var tweet = tweets[i].text;
                var url = tweets[i].user.profile_image_url;
                //console.log("New tweet: ", tweets[i]);
                /*
                var p = tweets[i].created_at.split(" ");
                var month = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(p[1]) / 3 + 1);
                var time = p[3].split(":");
                var date = new Date(p[5], month - 1, p[2], time[0], time[1], time[2]);
                //console.log(tweets[i].created_at, date);
                */
                model.getNewsFeedModel().postTweet(new News([name, nick], tweet, "assets/icon/twitter.svg", new Date(tweets[i].created_at), url));
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