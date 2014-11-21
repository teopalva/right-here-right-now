/**
 * @description Stores all the information about the potholes
 * @constructor
 */
function PotholesModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    /* Contains objects in the form:
     *      - id : number
     *      - creation_date : date
     *      - latitude : number
     *      - longitude : number
     */
    var _cachedData = [];
    var _potholes = [];
    var _dataAvailable = false;

    var _daysToVisualize = TimeRange.LAST_MONTH;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /**
     * Returns the potholes objects in the form:
     *      - creation_date : date (when the pothole has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getPotholes = function(){
        return _potholes;
    };

    this.filterByDate = function(){
        var timeRange = timeToDisplay;
        if(timeRange == TimeRange.LAST_MONTH)
            _potholes = _cachedData;
        else{
            _potholes = [];
            var elapsed = Date.now() - timeRange * 86400000;
            var limitDate = new Date(elapsed);
            for(i in _cachedData) {
                var stringDate = _cachedData[i].creation_date;
                var d = new Date(stringDate.substring(0,stringDate.indexOf('-')));
                if(d - limitDate >= 0)
                    _potholes.push(_cachedData[i]);
            }
        }
        notificationCenter.dispatch(Notifications.potholes.LAYER_UPDATED);
    };

    /**
     *
     * @returns {Array}
     */
    this.getPotholesWithinArea = function() {
        return model.getAreaOfInterestModel().filterObjects(_potholes);
    };

    /**
     * Remove the old potholes
     */
    this.clearPotholes = function(){
        _potholes = [];
    };

    /**
     *
     * @returns {number}
     */
    this.getPotholesDensityWithinArea = function() {
        var filtered = model.getAreaOfInterestModel().filterObjects(_potholes);

        if(filtered == null || filtered.length == 0) {
            return 0;
        }

        return filtered.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @returns {number}
     */
    this.getPotholesDensityInChicago = function() {
        var chicagoArea = 234;
        return _potholes.length / chicagoArea;
    };

    this.isDataAvailable = function(){
        return _dataAvailable;
    };

    /**
     *  Update the potholes information
     */
    this.updatePotholes = function() {
        // remove the old potholes
        self.clearPotholes();

        var link = "http://data.cityofchicago.org/resource/7as2-ds3y.json";
        var days = TimeRange.LAST_MONTH;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=service_request_number%20as%20id,creation_date,street_address,latitude,longitude" +
                    "&$limit=10000" +
                    "&$order=creation_date%20DESC" +
                    "&$where=status=%27Open%27and%20creation_date>=%27" + date.toISOString() + "%27and%20" +
                    "latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";

        /*
        var areaOfInterest = model.getAreaOfInterestModel().getAreaOfInterest();
        if(areaOfInterest) {
            var coordinates = d3.geo.bounds(areaOfInterest);

            //  0: long
            //  1: lat
            var bottomLeft = coordinates[0];
            var topRight = coordinates[1];

            query += "%20and%20within_box(location," + topRight[1] + "," + bottomLeft[0] + "," + bottomLeft[1] + "," + topRight[0] + ")";
        }
        */

        d3.json(link + query, function(json){
           json.forEach(function(pothole){
               pothole.creation_date = parseDate(pothole.creation_date);
               _potholes.push(pothole);
           });
            _cachedData = _potholes;
            self.filterByDate();
            _dataAvailable = true;
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updatePotholes();
        _updateTimer = setInterval(self.updatePotholes, _intervalMillis);
    };

    /**
     * Stops the timer that updates the model.
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////

    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var init = function() {
        self.updatePotholes();
    } ();
}

var TimeRange = {
    LAST_TWO_WEEKS : 14,
    LAST_MONTH : 30
}

var timeToDisplay = TimeRange.LAST_MONTH;