/**
 * @class TimeModel
 * @description Model that keeps time information
 *
 * @constructor
 */
function TimeModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns current date (javascript Date)
     * @returns {Date}
     */
    this.getCurrentDate = function() {
        return new Date();
    };

    /**
     * Returns the sunrise time of today
     * @returns {String}
     */
    this.getSunriseTime = function() {
        var sunriseTime = SunCalc.getTimes(this.getCurrentDate(), 41.83, -87.68).sunriseEnd;
        return sunriseTime.getHours()+" : "+sunriseTime.getMinutes();
    };

    /**
     * Returns the sunset time of today
     * @returns {String}
     */
    this.getSunsetTime = function() {
        var sunsetTime = SunCalc.getTimes(this.getCurrentDate(), 41.83, -87.68).sunsetStart;
        return sunsetTime.getHours()+" : " +sunsetTime.getMinutes();
    };



    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function() {

    } ();
}