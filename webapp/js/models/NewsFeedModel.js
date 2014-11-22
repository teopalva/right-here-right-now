/**
 * @class NewsFeedModel
 * @description collects status updates from various sources of information
 *
 * @constructor
 */
function NewsFeedModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _newsList = [];
    var _tweetList = [];

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * Post a new update
     *
     * @param news = a News object
     */
    this.postNews = function (news) {
        var i = 0;

        while (i < _newsList.length && (_newsList[i].getTimestamp() < news.getTimestamp() || +_newsList[i].getTimestamp().getTime() === +news.getTimestamp().getTime())) {
            i++;
        }

        _newsList.splice(i, 0, news);

        notificationCenter.dispatch(Notifications.newsfeed.NEWS_POSTED);
    };

    /**
     * Post a new tweet
     *
     * @param news = a News object
     */
    this.postTweet = function (tweet) {
        var i = 0;

        while (i < _newsList.length && (_newsList[i].getTimestamp() < news.getTimestamp() || +_newsList[i].getTimestamp().getTime() === +news.getTimestamp().getTime())) {
            i++;
        }

        _tweetList.splice(i, 0, tweet);

        notificationCenter.dispatch(Notifications.newsfeed.NEWS_POSTED);
    };

    /**
     * Return the list of News objects
     * @returns {Array}
     */
    this.getNewsfeed = function () {
        return _newsList;
    };

    this.getTweets = function () {
        return _tweetList;
    };

    ////////////////////////// PRIVATE METHODS ///////////////////////////
    var init = function () {

    }();
}