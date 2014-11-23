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
    this.toolBackgroundColor = function () {
        return "rgba(41, 36, 33, 0.95)";
    };

    /**
     * Default text color
     * @returns {string}
     */
    this.defaultToolTextColor = function () {
        return "rgba(246, 246, 246, 1.0)";
    };

    /**
     *
     * @returns {string}
     */
    this.secondaryTextColor = function () {
        return "rgba(187, 187, 187, 1.0)";
    };

    this.selectedButtonColor = function (layerName) {
        //return "rgba(35, 84, 204, 1.0)";
        return model.getVisualizationModel().layersColors[layerName];
    };

    this.deselectedButtonColor = function () {
        //return "rgba(45, 108, 214, 0.3)";
        return "rgba(92, 87, 84, 1)";
    };

    /**
     *
     * @returns {string}
     */
    this.hugeTextSize = function () {
        return "70px";
    };

    /**
     *
     * @returns {string}
     */
    this.largeTextSize = function () {
        return "50px";
    };

    /**
     *
     * @returns {string}
     */
    this.biggerTextSize = function () {
        return "34px";
    };

    /**
     *
     * @returns {string}
     */
    this.bigTextSize = function () {
        return "24px";
    };

    /**
     *
     * @returns {string}
     */
    this.mediumTextSize = function () {
        return "19px";
    };

    /**
     *
     * @returns {string}
     */
    this.smallTextSize = function () {
        return "16px";
    };

    // Charts
    this.chartsMenuButtonBackgroundColor = function () {
        return "rgba(246, 246, 246, 0)";
    };

    this.chartsMenuButtonSelectedBackgroundColor = function () {
        return "rgba(246, 246, 246, 1)";
    };

    this.chartsMenuButtonTextColor = function () {
        return "rgba(187, 187, 187, 1)";
    };

    this.chartsMenuButtonSelectedTextColor = function () {
        return "rgba(41, 36, 33, 1)";
    };

    this.tweetColor = function () {
        return "rgba(30, 150, 219, 0.95";
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function () {

    }();
}