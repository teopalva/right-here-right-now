/**
 * @description Stores all the information about the passedRestaurants
 * @constructor
 */
function RestaurantsModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _checkTimer;

    var _failedRestaurants = [];
    var _yelpRestaurants = [];

    var _yelpDownloaded = false;
    var _failedRestaurantsDownloaded = false;

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /**
     * Returns the passedRestaurants objects in the form:
     *      - creation_date : date (when the restaurant has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getRestaurants = function (inspectionResult) {
        var filtered = [];
        for(var i = 0; i < _yelpRestaurants.length ; i++)
            if(_yelpRestaurants[i].inspectionResult == inspectionResult)
                filtered.push(_yelpRestaurants[i]);
        return filtered;
    };

    /**
     * Remove the old passedRestaurants
     */
    this.clearRestaurants = function () {
        _failedRestaurants = [];
        _yelpRestaurants = [];
    };

    /**
     *  Update the passedRestaurants information
     */
    this.updateRestaurants = function () {
        // remove the old passedRestaurants
        self.clearRestaurants();

        // Last 6 months
        var days = 30 * 8;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);

        var link = "http://data.cityofchicago.org/resource/4ijn-s7e5.json";
        var query = "?$select=inspection_id%20as%20id,dba_name,license_%20as%20license,facility_type,risk,address,inspection_date,inspection_type,results,latitude,longitude" +
            "&$limit=50000" +
            "&$order=inspection_date%20DESC" +
            "&$where=results=%27Fail%27and%20facility_type=%27Restaurant%27" +
            "and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL%20" +
            "and%20risk%20IS%20NOT%20NULL%20and%20inspection_date>=%27" + date.toISOString() + "%27";

        d3.json(link + query, function (json) {
            json.forEach(function (restaurant) {
                if (!contains(_failedRestaurants, restaurant)) {
                    restaurant.inspection_date = parseDate(restaurant.inspection_date);
                    restaurant.risk = parseRisk(restaurant.risk);
                    _failedRestaurants.push(restaurant);
                }
            });
            _failedRestaurantsDownloaded = true;
        });



        //========================
        // GOOGLE PROXY
        //========================
        var proxy = "https://script.google.com/a/macros/mcpher.com/s/AKfycbzGgpLEWS0rKSBqXG5PcvJ7Fpe02fvGqiCqq54SVQmBJSpy_6s/exec";
        var yelplink = "http://paolobruzzo.comuf.com/project3/yelp.php?offset=";
        var limit = 900;
        for (var offset = 0; offset < limit; offset += 20) {
            d3.json(proxy + "?url=" + yelplink + offset, function (json) {
                // Stupid google proxy returns me an ugly string with extra characters
                var resultString = json.results.substring(0, json.results.indexOf('<'));
                var parsedJson = JSON.parse(resultString);

                parsedJson.businesses.forEach(function (restaurant) {
                    // Put the coordinates information at the top level like all the other layers
                    restaurant.latitude = restaurant.location.coordinate.latitude;
                    restaurant.longitude = restaurant.location.coordinate.longitude;
                    restaurant.categories = restaurant.categories[0][0];
                    _yelpRestaurants.push(restaurant);
                });
                if (_yelpRestaurants.length >= limit)
                    _yelpDownloaded = true;
            });
        }


        /*
         //========================
         // YAHOO PROXY
         //========================
         var yelplink = "http://paolobruzzo.comuf.com/project3/yelp.php?offset=";
         var limit = 900;
         var counter = limit;
         for (var offset = 0; offset < limit; offset += 20) {
         var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + yelplink + offset + '"') + '&format=json';
         d3.json(yql, function (json) {
         if(json.query.results) {
         json.query.results.json.businesses.forEach(function (restaurant) {
         // Put the coordinates information at the top level like all the other layers
         restaurant.latitude = parseFloat(restaurant.location.coordinate.latitude);
         restaurant.longitude = parseFloat(restaurant.location.coordinate.longitude);
         restaurant.categories = restaurant.categories[0] ? restaurant.categories[0].json[0] : restaurant.categories.json[0];
         _yelpRestaurants.push(restaurant);
         });
         }
         else
         //In case one query fails...
         counter -= 20;
         if (_yelpRestaurants.length >= counter)
         _yelpDownloaded = true;
         });
         }*/

    };

    this.startUpdates = function () {
        notificationCenter.dispatch(Notifications.passedRestaurants.DATA_CHANGED);
        notificationCenter.dispatch(Notifications.failedRestaurants.DATA_CHANGED);
    };


    ///////////////////////// PRIVATE METHODS /////////////////////////

    var parseDate = function (date) {
        var parsedDate = new Date(date.replace("T", " "));
        return parsedDate.toDateString();
    };

    var parseRisk = function (risk) {
        var parsed = risk.substring(risk.lastIndexOf("(") + 1, risk.lastIndexOf(")"));
        return parsed;
    };

    var contains = function (array, object) {
        for (i = 0; i < array.length; i++)
            if (object.license == array[i].license)
                return true;
        return false;
    };

    var checkDownload = function () {
        if (_yelpDownloaded && _failedRestaurantsDownloaded) {
            //console.log("Restaurants downloaded: " + _yelpRestaurants.length + " from Yelp, "+_failedRestaurants.length+" from Failed Inspections");
            findFoodInspectionFailures(_failedRestaurants, _yelpRestaurants);
            self.startUpdates();
            clearInterval(_checkTimer);
        }
    };

    var findFoodInspectionFailures = function (failedRestaurants, yelpRestaurants) {
        for (var i = 0; i < yelpRestaurants.length; i++)
            if (isIn(failedRestaurants, yelpRestaurants[i])) {
                yelpRestaurants[i].inspectionResult = InspectionResult.FAILED;
            }
            else
                yelpRestaurants[i].inspectionResult = InspectionResult.PASSED;
    };

    var isIn = function (failedRestaurants, yelpRest) {
        var approxDec = 4;
        var yelpLatitude = yelpRest.latitude.toFixed(approxDec);
        var yelpLongitude = yelpRest.longitude.toFixed(approxDec);
        for (var i = 0; i < failedRestaurants.length; i++) {
            var restLatitude = parseFloat(failedRestaurants[i].latitude).toFixed(approxDec);
            var restLongitude = parseFloat(failedRestaurants[i].longitude).toFixed(approxDec);
            // Only way I found to check if the passedRestaurants coincides
            if (restLatitude == yelpLatitude && restLongitude == yelpLongitude) {
                yelpRest.inspectionDate = failedRestaurants[i].inspection_date;
                yelpRest.inspectionType = failedRestaurants[i].inspection_type;
                yelpRest.risk = failedRestaurants[i].risk;
                return true;
            }
        }
        return false;
    };

    var init = function () {
        setTimeout(self.updateRestaurants, 1000);
        _checkTimer = setInterval(checkDownload, 10);
    }();
}

var InspectionResult = {
    PASSED: "Passed",
    FAILED: "Failed"
};
