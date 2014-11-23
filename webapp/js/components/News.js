/**
 * @class News
 * @description represent a news object that contains information about map updates
 *
 * @constructor
 */
function News(title, description, imagePath, timestamp) {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    this.title = title;
    var _title = title || "";
    var _description = description || "";
    var _imagePath = imagePath || "";
    var _timestamp = timestamp || new Date();
    var _profileImagePath = arguments[4] || "";

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * Returns news title
     * @returns {string}
     */
    this.getTitle = function () {
        return _title;
    };

    /**
     * Set title of the news
     * @param title {string}
     */
    this.setTitle = function (title) {
        self.title = title;
        _title = title;
    };

    /**
     * Returns news description
     * @returns {string}
     */
    this.getDescription = function () {
        return _description;
    };

    /**
     * Set news description
     * @param description {string}
     */
    this.setDescription = function (description) {
        _description = description;
    };

    /**
     * Returns news image icon path
     * @returns {string}
     */
    this.getImagePath = function () {
        return _imagePath;
    };

    /**
     * Set image string path for the news icon
     * @param imagePath {string}
     */
    this.setImagePath = function (imagePath) {
        _imagePath = imagePath;
    };

    /**
     * Returns news timestamp
     * @returns {Date}
     */
    this.getTimestamp = function () {
        return _timestamp;
    };

    /**
     * Set the timestamp of the news
     * @param timestamp {Date}
     */
    this.setTimestamp = function (timestamp) {
        _timestamp = timestamp;
    };
    
     this.getProfileImagePath = function () {
        return _profileImagePath;
    };


    ////////////////////////// PRIVATE METHODS ///////////////////////////
    var init = function () {

    }();
}