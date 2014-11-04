/**
 * @class AreaOfInterestModel
 * @description This model keeps information about the area of interest that the user has select and represents the
 * boundaries in which data should be visualized
 *
 * @constructor
 */
function AreaOfInterestModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _path = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Adds a point to the current path
     * @param latitude
     * @param longitude
     */
    this.addPoint = function(latitude, longitude) {
        _path.push({
            latitude: latitude,
            longitude: longitude
        });
        notificationCenter.dispatch(Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
    };

    /**
     * Remove all the points from the path
     */
    this.clearPath = function() {
        _path = [];
        notificationCenter.dispatch(Notifications.areaOfInterest.PATH_CLEANED);
    };

    /**
     * Returns a sorted Array containing stop points in the form of a dictionary {latitude, longitude}
     * @returns {Array}
     */
    this.getPath = function() {
        return _path;
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function() {

    } ();
}