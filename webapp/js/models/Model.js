/**
 * @class Model
 * @description Contains the model of the application (all the methods to get real time data)
 *
 * @constructor
 */
function Model() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    // Holds the status of the current map context
    var _mapModel;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     *
     * @returns {*}
     */
    this.getMapModel = function() {
        return _mapModel;
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {
        _mapModel = new MapModel();
    } ();
}