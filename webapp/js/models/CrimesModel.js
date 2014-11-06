/**
 * Model for crimes data.
 * @constructor
 */
function CrimesModel() {
    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // Crimes
    var _crimes = [];

    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 2000;

    //////////////////////// PUBLIC METHODS ////////////////////////
    /**
     * Returns the potholes objects in the form:
     *      - creation_date : date (when the pothole has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getCrimes = function(){
        return _crimes;
    }

    /**
     * Remove the old crimes
     */
    this.clearCrimes = function(){
        _crimes = [];
    }

    /**
     *  Update the crimes information
     */
    this.updateCrimes = function() {
        // remove the old potholes
        self.clearCrimes();

        // retrieve new data
        var link = "https://data.cityofchicago.org/resource/ijzp-q8t2.json";
        var days = 30;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=primary_type,description,date,latitude,longitude&$where=date>=%27" + date.toISOString() + "%27and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";
        d3.json(link + query, function(json){
            console.log(json)
            json.forEach(function(pothole){
                // Add only if we know both latitude and longitude
                if(pothole.latitude && pothole.longitude)
                    _crimes.push(pothole);
            });
            notificationCenter.dispatch(Notifications.crimes.LAYER_UPDATED);
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updateCrimes();
        _updateTimer = setInterval(self.updateCrimes, _intervalMillis);
    };

    /**
     * Stops the timer that updates the model.
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
        self.clearCrimes();
    };


    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {

    } ();


}