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
    var _chicagoLightsAllTime = [];
    var _areaLightsAllTime = [];

    var _chicagoLightsByDate = [];
    var _areaLightsByDate = [];
    
    var _dataAvailable = false;

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /**
     * Returns the lights objects in the form:
     *      - creation_date : date (when the pothole has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getLights = function(){
        return _chicagoLightsByDate;
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
    this.getLightsWithinArea = function() {
        return _areaLightsByDate;
    };


    /**
     *
     * @returns {number}
     */
    this.getLightsDensityWithinArea = function() {
        return _areaLightsByDate.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @returns {number}
     */
    this.getLightsDensityInChicago = function() {
        var chicagoArea = 234;
        return _chicagoLightsByDate.length / chicagoArea;
    };

    this.isDataAvailable = function(){
        return _dataAvailable;
    };

    this.updateTemporalScope = function(){
        _chicagoLightsByDate = self.filterByDate(_chicagoLightsAllTime);
        _areaLightsByDate = self.filterByDate(_areaLightsAllTime);
        notificationCenter.dispatch(Notifications.lights.SELECTION_UPDATED);
    };


    /**
     *  Update the lights information
     */
    this.updateLights = function() {
        // remove the old lights
        _chicagoLightsAllTime = [];

        var link = "http://data.cityofchicago.org/resource/zuxi-7xem.json";
        var days = TimeRange.LAST_MONTH;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);
        var query = "?$select=service_request_number%20as%20id,creation_date,street_address,latitude,longitude" +
                    "&$order=creation_date%20DESC" +
                    "&$limit=1000" +
                    "&$where=status=%27Open%27and%20creation_date>=%27" + date.toISOString() + "%27and%20" +
                    "latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";

        d3.json(link + query, function(json){
            json.forEach(function(light){
                light.creation_date = parseDate(light.creation_date);
                light.number_out = "3 or more";
                _chicagoLightsAllTime.push(light);
            });

            var link2 = "http://data.cityofchicago.org/resource/3aav-uy2v.json";
            d3.json(link2 + query, function(json){
                json.forEach(function(light){
                    light.creation_date = parseDate(light.creation_date);
                    light.number_out = "1 or 2";
                    _chicagoLightsAllTime.push(light);
                });
                _chicagoLightsByDate = self.filterByDate(_chicagoLightsAllTime);
                _dataAvailable = true;
                self.updateSelection();
                notificationCenter.dispatch(Notifications.lights.SELECTION_UPDATED);
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
        _areaLightsAllTime = [];
        _areaLightsByDate = [];
        _chicagoLightsAllTime = [];
        _chicagoLightsByDate = [];
    };


    ///////////////////////// PRIVATE METHODS /////////////////////////
    /**
     * Handler for notification PATH_UPDATED
     */
    var q;
    this.updateSelection = function() {
        q = queue(1);
        q.defer(filterObjectInSelectedArea, _chicagoLightsAllTime);
        q.awaitAll(function() {
            notificationCenter.dispatch(Notifications.lights.SELECTION_UPDATED);
        });
    };

    var filterObjectInSelectedArea = function(objects, callback) {
        _areaLightsAllTime = model.getAreaOfInterestModel().filterObjects(_chicagoLightsAllTime);
        _areaLightsByDate = self.filterByDate(_areaLightsAllTime);

        callback(null, null);
    };


    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var init = function() {
        self.updateLights();
        notificationCenter.subscribe(self, self.updateSelection, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.updateTemporalScope, Notifications.time.TEMPORAL_SCOPE_CHANGED);
    } ();
}