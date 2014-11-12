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

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * Post a new update
     *
     * @param news = a News object
     */
    this.postNews = function(news) {
        var i = 0;
        while(i < _newsList.length && _newsList[i].getTimestamp() > news.getTimestamp()) {
            i++;
        }

        _newsList.splice(i, 0, news);
    };

    /**
     * Return the list of News objects
     * @returns {Array}
     */
    this.getNewsfeed = function() {
        return _newsList;
    };

    ////////////////////////// PRIVATE METHODS ///////////////////////////
    var init = function() {

    } ();
}