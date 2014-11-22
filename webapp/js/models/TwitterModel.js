/**
 * @description Stores all the information about twitter
 * @constructor
 */
function TwitterModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _tweets = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.updateTweets = function () {

        _tweets = [];
        var tweetslink = "http://0.0.0.0:8888/webapp/php/twitter.php";
        d3.json(tweetslink, function (json) {
            json.forEach(function (tweet) {
                if (tweet.geo) {
                    tweet.latitude = tweet.geo.coordinates[0];
                    tweet.longitude = tweet.geo.coordinates[1];
                    _tweets.push(tweet);
                }
                //console.log(tweet);
                //console.log("Count: ", tweet.retweet_count , "Text: ", tweet.text);
            });
            var filtered = model.getAreaOfInterestModel().filterObjects(_tweets);
            console.log("TWEETS DOWNLOADED", _tweets);
            console.log("TWEETS FILTERED: ", filtered);

        });
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////


    var init = function () {
        self.updateTweets();
    }();
}