/**
 * @description Stores all the information about the restaurants
 * @constructor
 */
function RestaurantsModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _restaurants = [];

    // Update timer
    var _updateTimer;
    var _intervalMillis = 60000; // 1 minute

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

        var link = "http://data.cityofchicago.org/resource/4ijn-s7e5.json";
        var query = "?$select=inspection_id,dba_name,license_%20as%20license,facility_type,risk,address,inspection_date,inspection_type,results,latitude,longitude" +
            "&$limit=50000" +
            "&$order=inspection_date%20DESC" +
            "&$where=results=%27Fail%27and%20facility_type=%27Restaurant%27and%20risk=%27Risk%201%20(High)%27and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";

        d3.json(link + query, function(json){
            json.forEach(function(restaurant){
                restaurant.inspection_date = parseDate(restaurant.inspection_date);
                _restaurants.push(restaurant);
            });
            //notificationCenter.dispatch(Notifications.restaurants.LAYER_UPDATED);
            console.log(_restaurants.length);
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        self.updateRestaurants();
        _updateTimer = setInterval(self.updateRestaurants, _intervalMillis);
    };

    /**
     * Stops the timer that updates the model.
     */
    this.stopUpdates = function() {
        clearInterval(_updateTimer);
        self.clearRestaurants();
    };



    ///////////////////////// PRIVATE METHODS /////////////////////////

    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString();
    };

    var init = function() {

    } ();
}