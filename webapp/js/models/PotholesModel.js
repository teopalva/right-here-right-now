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
    var _chicagoPotholesAllTime = [];
    var _areaPotholesAllTime = [];

    var _chicagoPotholesByDate = [];
    var _areaPotholesByDate = [];

    var _dataAvailable = false;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.updateTemporalScope = function(){
        _chicagoPotholesByDate = self.filterByDate(_chicagoPotholesAllTime);
        _areaPotholesByDate = self.filterByDate(_areaPotholesAllTime);
        notificationCenter.dispatch(Notifications.potholes.SELECTION_UPDATED);
    };


    /**
     * Returns the potholes objects in the form:
     *      - creation_date : date (when the pothole has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getPotholes = function(){
        return _areaPotholesByDate;
    };

    this.filterByDate = function(objects){
        var timeRange = model.getTimeModel().getTemporalScope();
        if(timeRange == TimeRange.LAST_MONTH) {
            return objects;
        }

        var filteredObjects = [];

        //_areaCrimesAllTime = [];
        var elapsed = Date.now() - timeRange * 86400000;
        var limitDate = new Date(elapsed);
        for(var i in objects) {
            var stringDate = objects[i].creation_date;
            var d = new Date(stringDate.substring(0,stringDate.indexOf('-')));
            if(d - limitDate >= 0)
                filteredObjects.push(objects[i]);
        }

        return filteredObjects;
    };


    /**
     *
     * @returns {Array}
     */
    this.getPotholesWithinArea = function() {
        return model.getAreaOfInterestModel().filterObjects(_areaPotholesAllTime);
    };


    /**
     *
     * @returns {number}
     */
    this.getPotholesDensityWithinArea = function() {
        var filtered = model.getAreaOfInterestModel().filterObjects(_areaPotholesAllTime);

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
        return _areaPotholesAllTime.length / chicagoArea;
    };

    this.isDataAvailable = function(){
        return _dataAvailable;
    };

    /**
     *  Update the potholes information
     */
    this.updatePotholes = function() {
        // remove the old potholes
        _chicagoPotholesAllTime = [];

        var link = "http://data.cityofchicago.org/resource/7as2-ds3y.json";
        var days = TimeRange.LAST_MONTH;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=service_request_number%20as%20id,creation_date,street_address,latitude,longitude" +
                    "&$limit=10000" +
                    "&$order=creation_date%20DESC" +
                    "&$where=status=%27Open%27and%20creation_date>=%27" + date.toISOString() + "%27and%20" +
                    "latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";

        d3.json(link + query, function(json){
           json.forEach(function(pothole){
               pothole.creation_date = parseDate(pothole.creation_date);
               _chicagoPotholesAllTime.push(pothole);
           });
            _chicagoPotholesByDate = self.filterByDate(_chicagoPotholesAllTime);
            _dataAvailable = true;
            self.updateSelection();
            notificationCenter.dispatch(Notifications.potholes.SELECTION_UPDATED);
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

    /**
     * Handler for notification PATH_UPDATED
     */
    var q;
    this.updateSelection = function() {
        q = queue(1);
        q.defer(filterObjectInSelectedArea, _chicagoPotholesAllTime);
        q.awaitAll(function() {
            notificationCenter.dispatch(Notifications.potholes.SELECTION_UPDATED);
        });
    };

    var filterObjectInSelectedArea = function(objects, callback) {
        _areaPotholesAllTime = model.getAreaOfInterestModel().filterObjects(_chicagoPotholesAllTime);
        _areaPotholesByDate = self.filterByDate(_areaPotholesAllTime);

        callback(null, null);
    };

    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var init = function() {
        self.updatePotholes();
        notificationCenter.subscribe(self, self.updateSelection, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.updateTemporalScope, Notifications.time.TEMPORAL_SCOPE_CHANGED);
    } ();
}
