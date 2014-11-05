/**
 * @class WeatherModel
 * @description Model that keeps weather information
 *
 * @constructor
 */
function WeatherModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    // Weather conditions
    var _conditions = null;

    // Temperatures
    var _fahrenheit;
    var _celsius;

    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 20000;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Get a string that represents current weather conditions. @see wunderground to known the vocabularies
     * @returns {*}
     */
    this.getCurrentConditions = function() {
        return _conditions;
    };

    /**
     * Get current temperature in fahrenheit
     * @returns {*}
     */
    this.getCurrentFahrenheitTemperature = function() {
        return _fahrenheit;
    };

    /**
     * Get current temperature in celsius
     * @returns {*}
     */
    this.getCurrentCelsiusTemperature = function() {
        return _celsius;
    };

    /**
     * Updates data
     */
    this.updateData = function() {
        // TODO: restore ajax call when the app is ready

        /*
        // Keys for the weather. They are the same, just use the second one as a backup
        var key1 = "e4c22e5150092e01";
        var key2 = "0de84738476e1349";
        $.ajax({
            url : "http://api.wunderground.com/api/" + key1 + "/conditions/q/IL/Chicago.json",
            dataType : "jsonp",
            success : function(parsed_json) {
                _conditions = parsed_json["current_observation"]["weather"];
                _fahrenheit = parsed_json["current_observation"]["temp_f"];
                _celsius = parsed_json["current_observation"]["temp_c"];
                notificationCenter.dispatch(Notifications.weather.WEATHER_UPDATED);
            }
        });
        */

        // TODO: remove these when the app the ready
        _conditions = "Overcast";//parsed_json["current_observation"]["weather"];
        _fahrenheit = 56.4;//parsed_json["current_observation"]["temp_f"];
        _celsius = 16.4;//parsed_json["current_observation"]["temp_c"];
        notificationCenter.dispatch(Notifications.weather.WEATHER_UPDATED);
    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        if(_updateTimer == null) {
            self.updateData();
            // TODO uncomment when the app is ready
            //_updateTimer = setInterval(self.updateData, _intervalMillis);
        }
    };

    /**
     * Stops the timer that updates the model
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
        _updateTimer = null;
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {

    } ();
}