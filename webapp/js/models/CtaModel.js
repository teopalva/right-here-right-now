/**
 * @class CtaModel
 * @description
 *
 * @constructor
 */
function CtaModel() {
    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // CTA API
    var _site = "http://www.ctabustracker.com/bustime/api/v1/";
    var _key = "key=PS2GNpW4RCK4AXiiJssFsjWF9";

    // CTA Time
    var _time;

    // CTA Routes
    var _routes = [];

    // CTA Stops
    var _stops= [];

    // CTA Vehicles
    var _vehicles= [];


    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 2000;

    //////////////////////// PUBLIC METHODS ////////////////////////

    this.getCtaTime = function() {
        return _time;
    };

    this.getVehicles = function() {
        return _vehicles;
    };

    this.getStops = function() {
        return _stops;
    };

    this.getRoutes = function() {
        return _routes;
    };

    this.clearVehicles = function() {
        _vehicles = [];
    };

    this.clearData = function() {
        _routes = [];
        _stops= [];
        _vehicles= [];
    };

    /**
     * Start of the queries
     */
    this.retrieveData = function() {
        self.clearData();
        getRoutes();
    };

    /**
     * Update the list of buses in the area.
     */
    this.updateVehicles = function() {
        self.clearVehicles();
        console.log("updating...");

        // TODO: check if it is better to always notify (isLast = true)
        var isLast = false;

        for(var i in _routes) {
            if(i == _routes.length - 1) {
                isLast = true;
            }
            getVehicles(_routes[i], isLast);
        }
    };

    /**
     * Updates Time
     */
    this.updateTime = function() {
        var query = "gettime?";
        var url = _site + query + _key;
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

        $.getJSON(yql, function (data) {
            var parsed_xml = data.results[0];
            _time = $(parsed_xml).find('tm').text();
            notificationCenter.dispatch(Notifications.cta.TIME);
        });
    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        if(_updateTimer == null) {
            self.updateVehicles();
            //_updateTimer = setInterval(self.updateTime, _intervalMillis);
        }
    };

    /**
     * Stops the timer that updates the model
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
        _updateTimer = null;
        self.clearVehicles();
    };


    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {

    } ();

    var getBusFromArea = function() {

    };

    /**
     * Get all the vehicles traveling on a given route.
     * @param route
     */
    var getVehicles = function(route, isLast) {
        var query = "getvehicles?";
        var attributes = "rt=" + route + "&";
        var url = _site + query + attributes + _key;
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

        $.getJSON(yql, function (data) {
            var parsed_xml = data.results[0];

            $(parsed_xml).find('vehicle').each(function() {
                var id = $(this).find('vid').text();
                var lat = $(this).find('lat').text();
                var lon = $(this).find('lon').text();
                var heading = $(this).find('hdg').text();
                var delay = $(this).find('dly').text();
                var route = $(this).find('rt').text();

                var vehicleInfo = { id: id,
                    latitude: lat,
                    longitude: lon,
                    heading: heading,
                    delay: delay,
                    route: route};

                // Check if the vehicle is in the selected Area
                if(inArea(vehicleInfo)) {
                    _vehicles.push(vehicleInfo);
                }

            });
            if(isLast) {
                notificationCenter.dispatch(Notifications.cta.VECHICLES);
            }
        });


    };

    /**
     * Get all the stops of a route given a direction.
     * @param route
     * @param direction
     */
    var getStops = function(route, direction, isLast) {
        var query = "getstops?";
        var attributes = "rt=" + route + "&dir=" + direction + "&";
        var url = _site + query + attributes + _key;
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

        _stops = [];

        $.getJSON(yql, function (data) {
            var parsed_xml = data.results[0];
            $(parsed_xml).find('stop').each(function() {
                var id = $(this).find('stpid').text();
                var name = $(this).find('stpnm').text();
                var lat = $(this).find('lat').text();
                var lon = $(this).find('lon').text();

                var stopInfo = {id: id,
                    name: name,
                    latitude: lat,
                    longitude: lon};

                // Check if the stop is in the selected Area
                if(inArea(stopInfo)) {
                    // Add stop to list of interesting stops
                    _stops.push(stopInfo);

                    // Add route to list of interesting routes
                    if(_routes.indexOf(route) == -1) {
                        _routes.push(route);
                    }
                }
            });
            // Notify just if stops are found and if it is the last query about stops.
            if(isLast && _stops.length > 0) {
                notificationCenter.dispatch(Notifications.cta.STOPS);
            }
            if(_updateTimer == null) {
                //_updateTimer = setInterval(self.updateVehicles, _intervalMillis);
                // TODO: temporary implementation. just for test
                _updateTimer = 1;
                self.updateVehicles();
            }

        });
    };

    /**
     * Get the list of directions of a route.
     * @param route
     */
    var getDirections = function(route) {
        var query = "getdirections?";
        var attributes = "rt=" + route + "&";
        var url = _site + query + attributes + _key;
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

        var directions = [];

        $.getJSON(yql, function (data) {
            var parsed_xml = data.results[0];
            $(parsed_xml).find('dir').each(function() {
                directions.push($(this).text());
            });
            console.log("Route " + route);
            console.log(directions);

            // TODO: check if it is better to always notify (isLast = true)
            var isLast = false;

            for(var i in directions) {
                if(i == directions.length - 1) {
                    isLast = true;
                }
                getStops(route, directions[i], isLast);
            }
        });
    };

    /**
     * Get the list of all CTA routes.
     */
    var getRoutes = function() {
        var query = "getroutes?";
        var url = _site + query + _key;
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';

        var routes = [];

        $.getJSON(yql, function (data) {
            var parsed_xml = data.results[0];
            $(parsed_xml).find('route').each(function() {
                routes.push($(this).find('rt').text());
            });
            for(var i in routes) {
                getDirections(routes[i]);
            }
        });
    };


    /**
     * Temporary implementation
     * TODO: use area
     * @param geoElement
     * @returns {boolean}
     */
    var inArea = function(geoElement) {
        var maxLon =  -87.647011;
        var minLon = -87.674949;
        var maxLat = 41.874009;
        var minLat = 41.867238;

        var latitude = parseFloat(geoElement.latitude, 10);
        var longitude = parseFloat(geoElement.longitude, 10);

        //console.log(geoElement);
        //console.log("lat: " + latitude + " lon: " + longitude);



        if(minLat < latitude && latitude < maxLat &&
            minLon< longitude && longitude < maxLon) {
            return true;
        }
        return false;
    }



}