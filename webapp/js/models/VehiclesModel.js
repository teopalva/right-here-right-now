/**
 * @description Stores all the information about the potholes
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
    var _vehicles = [];
    var _dataAvailable = false;

    var _daysToVisualize = TimeRange.LAST_MONTH;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /**
     * Example: setTimeRange(TimeRange.LAST_WEEK);
     * @param timeRange
     */
    this.setTimeRange = function(timeRange){
        _daysToVisualize = timeRange;
    };

    /**
     * Returns the vechile objects in the form:
     *      - creation_date : date (when the vehicle has been found)
     *      - vehicle_make_model : string
     *      - vehicle_color : string
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getVehicles = function(){
        return _vehicles;
    }

    /**
     * Remove the old potholes
     */
    this.clearVehicles = function(){
        _vehicles = [];
    }

    this.isDataAvailable = function(){
        return _dataAvailable;
    };

    /**
     *
     * @returns {number}
     */
    this.getVehiclesDensityWithinArea = function() {
        var filtered = model.getAreaOfInterestModel().filterObjects(_vehicles);
        return filtered.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @returns {number}
     */
    this.getVehiclesDensityInChicago = function(){
        var chicagoArea = 234;
        return _vehicles.length / chicagoArea;
    };

    /**
     *  Update the potholes information
     */
    this.updateVehicles = function() {
        // remove the old potholes
        self.clearVehicles();

        var link = "http://data.cityofchicago.org/resource/3c9v-pnva.json";
        var days = _daysToVisualize;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=service_request_number%20as%20id,creation_date,vehicle_color,vehicle_make_model,street_address,most_recent_action,license_plate,latitude,longitude" +
                    "&$order=creation_date%20DESC"+
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
            json.forEach(function(vehicle){
                vehicle.creation_date = parseDate(vehicle.creation_date);
                _vehicles.push(vehicle);
            });
            notificationCenter.dispatch(Notifications.vehicles.LAYER_UPDATED);
            _dataAvailable = true;
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
    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var init = function() {
        self.updateVehicles();
    } ();
}
