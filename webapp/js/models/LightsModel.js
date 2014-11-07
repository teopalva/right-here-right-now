/**
 * @description Stores all the information about the lights
 * @constructor
 */
function LightsModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    /* Contains objects in the form:
     *      - creation_date : date
     *      - latitude : number
     *      - longitude : number
     */
    var _lights = [];

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /**
     * Returns the lights objects in the form:
     *      - creation_date : date (when the light has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getLights = function(){
        return _lights;
    };

    /**
     * Remove the old lights
     */
    this.clearLights = function(){
        _lights = [];
    };

    /**
     *  Update the lights information
     */
    this.updateLights = function() {
        // remove the old lights
        self.clearLights();

        /* Retrieve new data :
         *  SELECT creation_date,latitude,longitude
         *  WHERE status = 'Open' AND latitude != null AND longitude != NULL
         *  ORDER BY creation_date DESC
         */
        var link = "http://data.cityofchicago.org/resource/zuxi-7xem.json";
        var query = "?$select=creation_date,latitude,longitude" +
                    "&$where=status=%27Open%27and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL" +
                    "&$order=creation_date%20DESC";
        d3.json(link + query, function(json){
            json.forEach(function(light){
                _lights.push(light);
            });
            notificationCenter.dispatch(Notifications.lights.LAYER_UPDATED);
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updateLights();
        _updateTimer = setInterval(self.updateLights, _intervalMillis);
    };

    /**
     * Stops the timer that updates the model.
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
        self.clearLights();
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function() {

    } ();
}