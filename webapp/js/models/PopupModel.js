/**
 * @description
 * @constructor
 */
function PopupModel() {

    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////

    var self = this;

    var _popups = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.addPopup = function(dictionary) {
        _popups.push(dictionary);
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    this.removePopup = function(dictionary) {
        var index = _popups.indexOf(dictionary);
        _popups.splice(index,1);
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    this.removeAll = function(layer){
        for(var i = 0; i < _popups.length ; i++)
            if(_popups[i].layer == layer) {
                _popups.splice(i, 1);
                notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
            }
    };

    this.getPopups = function() {
        return _popups;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var init = function() {

    } ();
}


var PopupsType = {
    CRIME : "crimes",
    POTHOLES : "potholes",
    LIGHTS : "lights",
    DIVVY_BIKES : "divvy_bikes",
    VEHICLES : "vehicles",
    PLACES_OF_INTEREST : "places_of_interest",
    RESTAURANTS : "restaurants",
    BUS_STOPS: "bus_stops",
    BUS_VEHICLES: "bus_vehicles",
    BUS_ROUTES: "bus_routes",
    TRAIN_STATIONS: "train_stations"
};