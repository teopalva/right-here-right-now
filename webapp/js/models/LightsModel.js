/**
 * @description Stores all the information about the lights
 * @constructor
 */
function LightsModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    /* Contains objects in the form:
     *      - id : number
     *      - creation_date : date
     *      - latitude : number
     *      - longitude : number
     *      - number_out : number
     */
    var _lights = [];
    var _cachedData = [];
    var _dataAvailable = false;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.filterByDate = function(){
        var timeRange = timeToDisplay;
        if(timeRange == TimeRange.LAST_MONTH)
            _lights = _cachedData;
        else{
            _lights = [];
            var elapsed = Date.now() - timeRange * 86400000;
            var limitDate = new Date(elapsed);
            for(i in _cachedData) {
                var stringDate = _cachedData[i].creation_date;
                var d = new Date(stringDate.substring(0,stringDate.indexOf('-')));
                if(d - limitDate >= 0)
                    _lights.push(_cachedData[i]);
            }
        }
        notificationCenter.dispatch(Notifications.lights.LAYER_UPDATED);
    };

    /**
     * Returns the lights objects in the form:
     *      - id : number
     *      - creation_date : date (when the light has been found)
     *      - latitude : number
     *      - longitude : number
     *      - number_out : number (number of broken lights on the same pole)
     * @returns {Array}
     */
    this.getLights = function(){
        return _lights;
    };

    /**
     *
     * @returns {Array}
     */
    this.getLightsWithinArea = function() {
        return model.getAreaOfInterestModel().filterObjects(_lights);
    };

    /**
     * Remove the old lights
     */
    this.clearLights = function(){
        _lights = [];
    };

    this.isDataAvailable = function(){
        return _dataAvailable;
    };

    /**
     *
     * @returns {number}
     */
    this.getLightsDensityWithinArea = function() {
        var filtered = model.getAreaOfInterestModel().filterObjects(_lights);

        if(filtered == null || filtered.length == 0) {
            return 0;
        }

        return filtered.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @returns {number}
     */
    this.getLightsDensityInChicago = function() {
        var chicagoArea = 234;
        return _lights.length / chicagoArea;
    };

    /**
     *  Update the lights information
     */
    this.updateLights = function() {
        // remove the old lights
        self.clearLights();

        var link = "http://data.cityofchicago.org/resource/zuxi-7xem.json";
        var days = TimeRange.LAST_MONTH;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=service_request_number%20as%20id,creation_date,street_address,latitude,longitude" +
                    "&$order=creation_date%20DESC" +
                    "&$limit=1000" +
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
            json.forEach(function(light){
                light.creation_date = parseDate(light.creation_date);
                light.number_out = "3 or more";
                _lights.push(light);
            });

            var link2 = "http://data.cityofchicago.org/resource/3aav-uy2v.json";
            d3.json(link2 + query, function(json){
                json.forEach(function(light){
                    light.creation_date = parseDate(light.creation_date);
                    light.number_out = "1 or 2";
                    _lights.push(light);
                });
                _cachedData = _lights;
                self.filterByDate();
                _dataAvailable = true;
            });
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
    };


    ///////////////////////// PRIVATE METHODS /////////////////////////
    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var init = function() {
        self.updateLights();
    } ();
}