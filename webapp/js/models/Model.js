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

    // Holds information about the boundary selected by the user within which data has to be visualized
    var _areaOfInterestModel;

    // Holds color information for visualization purposes
    var _colorModel;

    // Holds UI information
    var _themeModel;

    // Holds time information
    var _timeModel;

    // Holds weather information
    var _weatherModel;

    // Holds cta buses information
    var _ctaModel;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     *
     * @returns {*}
     */
    this.getMapModel = function() {
        return _mapModel;
    };

    /**
     * Returns the model that keeps information about the boundary within which data has to be visualized
     */
    this.getAreaOfInterestModel = function() {
        return _areaOfInterestModel;
    };

    /**
     * Returns the color model
     */
    this.getColorModel = function() {
        return _colorModel;
    };

    /**
     * Returns theme model
     * @returns {*}
     */
    this.getThemeModel = function() {
        return _themeModel;
    };

    /**
     * Returns the time model
     * @returns {*}
     */
    this.getTimeModel = function() {
        return _timeModel;
    };

    /**
     * Returns the weather model
     * @returns {*}
     */
    this.getWeatherModel = function() {
        return _weatherModel;
    };

    /**
     * Returns the cta model
     * @returns {*}
     */
    this.getCtaModel = function() {
        return _ctaModel;
    }

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {
        // Map
        _mapModel = new MapModel();

        // Area of interest
        _areaOfInterestModel = new AreaOfInterestModel();

        // Colors
        _colorModel = new ColorModel();

        // Theme
        _themeModel = new ThemeModel();

        // Time
        _timeModel = new TimeModel();

        // Weather
        _weatherModel = new  WeatherModel();

        // Cta
        _ctaModel = new CtaModel();
    } ();
}