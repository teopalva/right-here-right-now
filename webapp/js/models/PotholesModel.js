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
    var _potholes = [];

    // Update timer
    var _updateTimer;
    var _intervalMillis = 6000; // 1 minute

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

    /**
     * Remove the old potholes
     */
    this.clearPotholes = function(){
        _potholes = [];
    };

    /**
     *  Update the potholes information
     */
    this.updatePotholes = function() {
        // remove the old potholes
        self.clearPotholes();

        var link = "http://data.cityofchicago.org/resource/7as2-ds3y.json";
        var query = "?$select=service_request_number%20as%20id,creation_date,latitude,longitude" +
                    "&$limit=10000" +
                    "&$order=creation_date%20DESC" +
                    "&$where=status=%27Open%27and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";

        var areaOfInterest = model.getAreaOfInterestModel().getAreaOfInterest();
        if(areaOfInterest) {
            var coordinates = d3.geo.bounds(areaOfInterest);

            //  0: long
            //  1: lat
            var bottomLeft = coordinates[0];
            var topRight = coordinates[1];

            query += "%20and%20within_box(location," + topRight[1] + "," + bottomLeft[0] + "," + bottomLeft[1] + "," + topRight[0] + ")";
        }

        d3.json(link + query, function(json){
           json.forEach(function(pothole){
                _potholes.push(pothole);
           });
            notificationCenter.dispatch(Notifications.potholes.LAYER_UPDATED);
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
        self.clearPotholes();
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////

    var init = function() {

    } ();
}