/**
 * @class TimeModel
 * @description Model that keeps time information
 *
 * @constructor
 */
function TimeModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    // date
    var _date;

    // sun
    var _sunrise;
    var _sunset;

    // Update time
    var _updateDate;
    var _intervalMillisDate = 60000; // 1 minute

    //Update Sunrise and Sunset
    var _updateSun;
    var _intervalMillisSun = 60000 ; // 1 minutes

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns current date (javascript Date)
     * @returns {String}
     */
    this.getCurrentDate = function() {
        return _date;
    };

    this.getCurrentTime = function() {
        return formatAMPM(_date);
    };

    /**
     * Returns the sunrise time of today
     * @returns {String}
     */
    this.getSunriseTime = function() {
        return formatAMPM(_sunrise);
    };

    /**
     * Returns the sunset time of today
     * @returns {String}
     */
    this.getSunsetTime = function() {
        return formatAMPM(_sunset);
    };

    /**
     * Updates data
     */
    this.updateDate = function() {
        _date = new Date();
        notificationCenter.dispatch(Notifications.time.CLOCK_UPDATED);
    };

    /**
     * Updates sunrise and sunset time
     */
    this.updateSun = function(){
        _sunrise = SunCalc.getTimes(new Date(), 41.83, -87.68).sunriseEnd;
        _sunset = SunCalc.getTimes(new Date(), 41.83, -87.68).sunsetStart;
        notificationCenter.dispatch(Notifications.time.SUN_UPDATED);
    }

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updateDate();
        self.updateSun();
        _updateDate = setInterval(self.updateDate, _intervalMillisDate);
        _updateSun = setInterval(self.updateSun, _intervalMillisSun);
    };

    /**
     * Stops the timer that updates the model
     */
    this.stopUpdates = function() {
        clearInterval(_updateDate);
        clearInterval(_updateSun);
    };


    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    /**
     * Return a time in AM / PM format
     * @param date
     * @returns {string}
     */
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    var init = function() {

    } ();
}