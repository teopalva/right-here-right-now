/**
 * @description Stores all the information about the restaurants
 * @constructor
 */
function RestaurantsModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _restaurants = [];
    var _yelpRestaurants = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    /**
     * Returns the restaurants objects in the form:
     *      - creation_date : date (when the restaurant has been found)
     *      - latitude : number
     *      - longitude : number
     * @returns {Array}
     */
    this.getRestaurants = function(){
        return _restaurants;
    };
2
    /**
     * Remove the old restaurants
     */
    this.clearRestaurants = function(){
        _restaurants = [];
    };

    /**
     *  Update the restaurants information
     */
    this.updateRestaurants = function() {
        // remove the old restaurants
        self.clearRestaurants();

        var days = 30*3;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);

        var link = "http://data.cityofchicago.org/resource/4ijn-s7e5.json";
        var query = "?$select=inspection_id%20as%20id,dba_name,license_%20as%20license,facility_type,risk,address,inspection_date,inspection_type,results,latitude,longitude" +
            "&$limit=50000" +
            "&$order=inspection_date%20DESC" +
            "&$where=results=%27Fail%27and%20facility_type=%27Restaurant%27" +
            "and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL%20" +
            "and%20risk%20IS%20NOT%20NULL%20and%20inspection_date>=%27" + date.toISOString() + "%27";

        d3.json(link + query, function(json){
            json.forEach(function(restaurant){
               if( ! contains(_restaurants,restaurant)) {
                    restaurant.inspection_date = parseDate(restaurant.inspection_date);
                    restaurant.risk = parseRisk(restaurant.risk);
                    _restaurants.push(restaurant);
               }
            });
            self.startUpdates();
            console.log("Restaurants inspections downloaded: " + _restaurants.length + " restaurants");
        });

        var proxy = "https://script.google.com/a/macros/mcpher.com/s/AKfycbzGgpLEWS0rKSBqXG5PcvJ7Fpe02fvGqiCqq54SVQmBJSpy_6s/exec";
        var yelplink = "http://paolobruzzo.comuf.com/project3/yelp.php?offset=";
        var limit = 500;
        for(var offset = 0; offset < limit; offset += 20) {
            d3.json(proxy + "?url=" + yelplink + offset, function (json) {
                // Stupid google proxy returns me an ugly string with extra characters
                var resultString = json.results.substring(0, json.results.indexOf('<'));
                var parsedJson = JSON.parse(resultString);

                parsedJson.businesses.forEach(function (restaurant) {
                    _yelpRestaurants.push(restaurant);
                });
                if(_yelpRestaurants.length >= limit)
                    console.log("Restaurants from Yelp downloaded: "+ _yelpRestaurants.length + " restaurants");
            });
        }

    };

    this.startUpdates = function(){
        notificationCenter.dispatch(Notifications.restaurants.LAYER_UPDATED);
    };


    ///////////////////////// PRIVATE METHODS /////////////////////////

    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString();
    };

    var parseRisk = function(risk){
        var parsed = risk.substring(risk.lastIndexOf("(")+1,risk.lastIndexOf(")"));
        return parsed;
    };

    var contains = function(array,object){
        for (i = 0; i < array.length ; i++)
            if (object.license == array[i].license)
                return true;
        return false;
    };

    var init = function() {
        setTimeout(self.updateRestaurants,1000);
    } ();
}
