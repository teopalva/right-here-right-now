/**
 * @description Stores all the information about the potholes
 * @constructor
 */
function VehiclesModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    /* Contains objects in the form:
     *      - creation_date : date (when the vehicle has been found)
     *      - vehicle_make_model : string
     *      - vehicle_color : string
     *      - latitude : number
     *      - longitude : number
     */
    var _vechicles = [];

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

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
        return _vechicles;
    }

    /**
     * Remove the old potholes
     */
    this.clearVehicles = function(){
        _vechicles = [];
    }

    /**
     *  Update the potholes information
     */
    this.updateVehicles = function() {
        // remove the old potholes
        self.clearVehicles();

        // retrieve new data
        var link = "http://data.cityofchicago.org/resource/3c9v-pnva.json";
        var query = "?$select=creation_date,vehicle_color,vehicle_make_model,latitude,longitude&$where=status=%27Open%27&$order=creation_date%20DESC";
        d3.json(link + query, function(json){
            json.forEach(function(vehicle){
                // Add only if we know both latitude and longitude
                if(vehicle.latitude && vehicle.longitude)
                    _vechicles.push(vehicle);
            });
            notificationCenter.dispatch(Notifications.vehicles.LAYER_UPDATED);
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
        self.clearVehicles();
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function() {

    } ();
}
