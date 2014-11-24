/**
 * @description Stores all the information about the vehicles
 * @constructor
 */
function VehiclesModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    /* Contains objects in the form:
     *      - id : number
     *      - creation_date : date (when the vehicle has been found)
     *      - vehicle_make_model : string
     *      - vehicle_color : string
     *      - latitude : number
     *      - longitude : number
     */
    var _chicagoVehiclesAllTime = [];
    var _areaVehiclesAllTime = [];

    var _chicagoVehiclesByDate = [];
    var _areaVehiclesByDate = [];

    var _dataAvailable = false;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns the vehicles objects in the form:
     *      - creation_date : date (when the pothole has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getVehicles = function(){
        return _chicagoVehiclesByDate;
    };

    this.filterByDate = function(objects){
        var timeRange = model.getTimeModel().getTemporalScope();
        if(timeRange == TimeRange.LAST_MONTH) {
            return objects;
        }

        var filteredObjects = [];

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
    this.getVehiclesWithinArea = function() {
        return _areaVehiclesByDate;
    };


    /**
     *
     * @returns {number}
     */
    this.getVehiclesDensityWithinArea = function() {
        return _areaVehiclesByDate.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @returns {number}
     */
    this.getVehiclesDensityInChicago = function() {
        var chicagoArea = 234;
        return _chicagoVehiclesByDate.length / chicagoArea;
    };

    this.isDataAvailable = function(){
        return _dataAvailable;
    };

    this.updateTemporalScope = function(){
        _chicagoVehiclesByDate = self.filterByDate(_chicagoVehiclesAllTime);
        _areaVehiclesByDate = self.filterByDate(_areaVehiclesAllTime);
        notificationCenter.dispatch(Notifications.vehicles.SELECTION_UPDATED);
    };

    /**
     *  Update the vehicles information
     */
    this.updateVehicles = function() {
        var link = "http://data.cityofchicago.org/resource/3c9v-pnva.json";
        var days = TimeRange.LAST_MONTH;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=service_request_number%20as%20id,creation_date,vehicle_color,vehicle_make_model,street_address,most_recent_action,license_plate,latitude,longitude" +
                    "&$order=creation_date%20DESC"+
                    "&$where=status=%27Open%27and%20creation_date>=%27" + date.toISOString() + "%27and%20" +
                    "latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";


        d3.json(link + query, function(json){
            // remove the old vehicles
            _chicagoVehiclesAllTime = [];
            json.forEach(function(vehicle){
                vehicle.creation_date = parseDate(vehicle.creation_date);
                _chicagoVehiclesAllTime.push(vehicle);
            });
            _chicagoVehiclesByDate = self.filterByDate(_chicagoVehiclesAllTime);
            _dataAvailable = true;
            self.updateSelection();
            notificationCenter.dispatch(Notifications.vehicles.SELECTION_UPDATED);
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updateVehicles();
        _updateTimer = setInterval(self.updateVehicles, _intervalMillis);
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
        q.defer(filterObjectInSelectedArea, _chicagoVehiclesAllTime);
        q.awaitAll(function() {
            notificationCenter.dispatch(Notifications.vehicles.SELECTION_UPDATED);
        });
    };

    var filterObjectInSelectedArea = function(objects, callback) {
        _areaVehiclesAllTime = model.getAreaOfInterestModel().filterObjects(_chicagoVehiclesAllTime);
        _areaVehiclesByDate = self.filterByDate(_areaVehiclesAllTime);

        callback(null, null);
    };
    
    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var init = function() {
        self.updateVehicles();
        notificationCenter.subscribe(self, self.updateSelection, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.updateTemporalScope, Notifications.time.TEMPORAL_SCOPE_CHANGED);
    } ();
}
