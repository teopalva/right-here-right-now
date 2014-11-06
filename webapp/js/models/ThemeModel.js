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
    
    this.selectedButtonColor = function() {
        return "rgba(35, 84, 204, 1.0)";
    };
    
    this.deselectedButtonColor = function() {
        return "rgba(45, 108, 214, 0.3)";
    };

    /**
     *
     * @returns {string}
     */
    this.bigTextSize = function() {
        return "24px";
    };

    /**
     *
     * @returns {string}
     */
    this.mediumTextSize = function() {
        return "19px";
    };

    /**
     *
     * @returns {string}
     */
    this.smallTextSize = function() {
        return "16px";
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {

    } ();
}