/**
 * @description Stores all the information about the divvyBikes
 * @constructor
 */
function DivvyBikesModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    // Description at the getDivvyBikes Method
    var _divvyBikes = [];
    // Previous state of the divvy bikes
    var _oldDivvyBikes = [];

    var _lastUpdate;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 10000; // 20 seconds

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
    this.getDivvyBikes = function () {
        return _divvyBikes;
    };

    /**
     * Remove the old divvyBikes
     */
    this.clearDivvyBikes = function () {
        _divvyBikes = [];
    };

    /**
     * Return last update of the data
     * @returns {*}
     */
    this.getLastUpdate = function () {
        return _lastUpdate.toDateString() + "- " + formatAMPM(_lastUpdate);
    }
    /**
     *  Update the divvyBikes information
     */
    this.updateDivvyBikes = function () {

        _oldDivvyBikes = _divvyBikes;
        self.clearDivvyBikes();

        var link = "http://www.divvybikes.com/stations/json/";
        var proxy = "https://script.google.com/a/macros/mcpher.com/s/AKfycbzGgpLEWS0rKSBqXG5PcvJ7Fpe02fvGqiCqq54SVQmBJSpy_6s/exec";
        d3.json(proxy + "?url=" + link, function (json) {
            // I need to parse the Json since the proxy send me back an ugly string
            var parsedJson = JSON.parse(json.results);
            parsedJson.stationBeanList.forEach(function (divvyBike) {
                _divvyBikes.push(divvyBike);
            });
            console.log("Divvy bikes JSON last update at " + parsedJson.executionTime);
            _lastUpdate = new Date(parsedJson.executionTime);
            notificationCenter.dispatch(Notifications.divvyBikes.DATA_CHANGED);

            // News feed
            var temp = model.getAreaOfInterestModel().filterObjects(_divvyBikes);
            for (var i = 0; i < temp.length; i++)
                if (_oldDivvyBikes.length > 0)
                    if (hasChanged(temp[i], _oldDivvyBikes)) {
                        var news = new News(PopupsType.DIVVY_BIKES, "Station n." + temp[i].id + " updated", "assets/icon/markers/divvy.svg", new Date(),"",temp[i]);
                        model.getNewsFeedModel().postNews(news);
                    }
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function () {
        self.updateDivvyBikes();
        _updateTimer = setInterval(self.updateDivvyBikes, _intervalMillis);
    };

    /**
     * Stops the timer that updates the model.
     */
    this.stopUpdates = function () {
        clearInterval(_updateTimer);
        self.clearDivvyBikes();
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////
    /**
     * Checks if obj has changed
     * @param obj
     * @param arr
     * @returns {boolean}
     */
    var hasChanged = function (obj, arr) {
        for (i in arr) {
            if (isIt(arr[i], obj) && !isEqual(arr[i], obj)) {
                return true;
            }
        }
        return false;
    };

    /**
     * Checks if two objects are the same looking at their ID
     * @param obj1
     * @param obj2
     * @returns {boolean}
     */
    var isIt = function (obj1, obj2) {
        return obj1.id == obj2.id;
    };

    /**
     * Checks if two object are exactly the same
     * @param obj1
     * @param obj2
     * @returns {boolean}
     */
    var isEqual = function (obj1, obj2) {
        return JSON.stringify(obj1) == JSON.stringify(obj2);
    };

    var init = function () {

    }();
}