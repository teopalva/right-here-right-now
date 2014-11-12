/**
 * @class VisualizationModel
 * @description Model that keeps color information
 *
 * @constructor
 */
function VisualizationModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns path start point color
     * * @returns {string}
     */
    this.pathStartPointColor = function() {
        return "rgba(65,171,93, 1.0)";
    };

    /**
     * Returns path way-point color
     * * @returns {string}
     */
    this.pathWaypointColor = function() {
        return "rgba(107,174,214, 1.0)";
    };

    /**
     * Returns path end point color
     * * @returns {string}
     */
    this.pathEndPointColor = function() {
        return "rgba(215,48,31, 1.0)";
    };

    /**
     * Returns area of interest fill color
     * * @returns {string}
     */
    this.areaOfInterestFillColor = function() {
        return "rgba(246,246,246, 0.5)";
    };

    /**
     * Returns area of interest stroke color
     * * @returns {string}
     */
    this.areaOfInterestStrokeColor = function() {
        return "rgba(246,246,246, 1.0)";
    };

    /**
     * Returns the level of zoom at which markers can be shown with more details
     * @returns {number}
     */
    this.detailedMarkerZoomLevel = function() {
        return 15;
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {

    } ();
}