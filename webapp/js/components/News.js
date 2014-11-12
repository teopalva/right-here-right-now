/**
 * @class News
 * @description represent a news object that contains information about map updates
 *
 * @constructor
 */
function News(title, description, imagePath, timestamp) {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _title = title || "";
    var _description = description | "";
    var _imagePath = imagePath | "";
    var _timestamp = timestamp | new Date();

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    this.getTitle = function() {
        return _title;
    };

    this.getDescription = function() {

    };

    this.getImagePath = function() {

    };

    this.getTimestamp = function() {

    };

    ////////////////////////// PRIVATE METHODS ///////////////////////////
    var init = function() {

    } ();
}