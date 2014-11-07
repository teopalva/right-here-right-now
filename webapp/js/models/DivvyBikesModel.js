/**
 * @description Stores all the information about the divvyBikes
 * @constructor
 */
function DivvyBikesModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    // Desctiption at the getDivvyBikes Method
    var _divvyBikes = [];

    // Update timer
    var _updateTimer;
    var _intervalMillis = 10000; // 10 seconds

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /** Returns objects with the following interesting fields:
     *      - availableBikes : integer
     *      - availableDocks : integer
     *      - id : integer
     *      - latitude : float
     *      - longitude : float
     *      - location : string
     *      - stationName : string
     *      - statusValue : string
     *
     * @returns {Array}
     */
    this.getDivvyBikes = function(){
        return _divvyBikes;
    }

    /**
     * Remove the old divvyBikes
     */
    this.clearDivvyBikes = function(){
        _divvyBikes = [];
    }

    /**
     *  Update the divvyBikes information
     */
    this.updateDivvyBikes = function() {
        // remove the old divvyBikes
        self.clearDivvyBikes();

        var link = "http://www.divvybikes.com/stations/json/";
        var proxy = "https://script.google.com/a/macros/mcpher.com/s/AKfycbzGgpLEWS0rKSBqXG5PcvJ7Fpe02fvGqiCqq54SVQmBJSpy_6s/exec";
        d3.json(proxy + "?url=" + link,function(json){
            // I need to parse the Json since the proxy send me back an ugly string
            var parsedJson = JSON.parse(json.results);
            parsedJson.stationBeanList.forEach(function(divvyBike){
                divvyBike.id = (divvyBike.latitude + divvyBike.longitude).toString().hashCode();
                _divvyBikes.push(divvyBike);
            });
            console.log("Divvy bikes JSON last update at " + parsedJson.executionTime);
            notificationCenter.dispatch(Notifications.divvyBikes.LAYER_UPDATED);
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updateDivvyBikes();
        _updateTimer = setInterval(self.updateDivvyBikes, _intervalMillis);
    };

    /**
     * Stops the timer that updates the model.
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
        self.clearDivvyBikes();
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function() {

    } ();
}
