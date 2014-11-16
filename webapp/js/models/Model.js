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

    // Holds information about recent data updates
    var _newsFeedModel;

    // Holds information about the potholes
    var _potholesModel;

    // Holds information about the vehicles
    var _vehiclesModel;

    // Holds information about the lights
    var _lightsModel;

    //Holds information about the divvy bikes
    var _divvyBikesModel;

    // Holds color information for visualization purposes
    var _visualizationModel;

    // Holds UI information
    var _themeModel;

    // Holds time information
    var _timeModel;

    // Holds weather information
    var _weatherModel;

    // Holds information about which layer to visualize
    var _mapLayersModel;

    // Holds cta buses and stops information
    var _ctaModel;

    // Holds cta trains and stops information
    var _ctaTrainModel;

    // Holds violentCrimes information
    var _crimesModel;

    // Holds popup information
    var _popupModel;

    // Holds restaurant
    var _restaurantsModel;


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
     * Returns news feed model that contains information about recent data updates
     */
    this.getNewsFeedModel = function() {
        return _newsFeedModel;
    };

    /**
     * Returns the model that keeps information about the potholes
     */
    this.getPotholesModel = function(){
        return _potholesModel;
    };

    /**
     * Returns the model that keeps information about the vehicles
     */
    this.getVehiclesModel = function(){
        return _vehiclesModel;
    };

    /**
     * Returns the model that keeps information about the lights
     */
    this.getLightsModel = function(){
        return _lightsModel;
    };

    /**
     * Returns the model that keeps information about the divvy bikes
     */
    this.getDivvyBikesModel = function(){
        return _divvyBikesModel;
    };

    /**
     * Returns the Visualization model
     */
    this.getVisualizationModel = function() {
        return _visualizationModel;
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
    };

    /**
     * Returns the cta train model
     * @returns {CtaTrainModel|*}
     */
    this.getCtaTrainModel = function() {
        return _ctaTrainModel;
    };

    /**
     * Returns map layers model
     * @returns {*}
     */
    this.getMapLayersModel = function() {
        return _mapLayersModel;
    };

    this.getCrimesModel = function() {
        return _crimesModel;
    };

    /**
     * Returns popup model
     * @returns {PopupModel}
     */
    this.getPopupModel = function() {
        return _popupModel;
    };

    this.getRestaurantsModel = function() {
        return _restaurantsModel;
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {
        // Map
        _mapModel = new MapModel();

        // Area of interest
        _areaOfInterestModel = new AreaOfInterestModel();

        // News feed model
        _newsFeedModel = new NewsFeedModel();

        // Potholes Model
        _potholesModel = new PotholesModel();

        //Vehicles Model
        _vehiclesModel = new VehiclesModel();

        // Lights Model
        _lightsModel = new LightsModel();

        // Divvy bikes Model
        _divvyBikesModel = new DivvyBikesModel();

        //Rest Model
        _restaurantsModel = new RestaurantsModel();

        // Colors
        _visualizationModel = new VisualizationModel();

        // Theme
        _themeModel = new ThemeModel();

        // Time
        _timeModel = new TimeModel();

        // Weather
        _weatherModel = new  WeatherModel();

        // Map layers
        _mapLayersModel = new  MapLayersModel();

        // Cta
        _ctaModel = new CtaModel();

        // Cta Train
        _ctaTrainModel = new CtaTrainModel();

        // Crimes
        _crimesModel = new CrimesModel();

        // Popups
        _popupModel = new PopupModel();

    } ();
}