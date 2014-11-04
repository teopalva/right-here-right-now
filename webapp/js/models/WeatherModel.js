/**
 * @class WeatherModel
 * @description Model that keeps weather information
 *
 * @constructor
 */
function WeatherModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    this.getCurrentConditions = function(callBack) {
        $.ajax({
            url : "http://api.wunderground.com/api/e4c22e5150092e01/conditions/q/IL/Chicago.json",
            dataType : "jsonp",
            success : function(parsed_json) {
                callBack(parsed_json["current_observation"]["weather"]);
            }
        });
    };

    this.getCurrentFahrenheitTemperature = function(callBack) {

    };

    this.getCurrentCelsiusTemperature = function(callBack) {

    };


    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {

    } ();
}