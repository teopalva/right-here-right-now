/**
 * @class ThemeModel
 * @description Model that keeps color information
 *
 * @constructor
 */
function ThemeModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns tool background color
     * * @returns {string}
     */
    this.toolBackgroundColor = function() {
        return "rgba(41, 36, 33, 1.0)";
    };

    /**
     * Default text color
     * @returns {string}
     */
    this.defaultToolTextColor = function() {
        return "rgba(246, 246, 246, 1.0)";
    };

    /**
     *
     * @returns {string}
     */
    this.bigTextSize = function() {
        return "24px";
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {

    } ();
}