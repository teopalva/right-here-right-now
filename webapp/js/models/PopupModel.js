/**
 * @description
 * @constructor
 */
function PopupModel() {

    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////

    var self = this;

    var _popups = {};
    var _countID = 0;

    ///////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Add popup. This method returns the id of the popup
     * @param dictionary
     * @returns {number}
     */
    this.addPopup = function (dictionary) {
        var currentId = _countID;
        _countID++;

        _popups[currentId] = dictionary;

        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);

        return currentId;
    };

    /**
     * Change popup by id with a new content dictionary
     * @param id
     * @param dictionary
     */
    this.changePopup = function (id, dictionary) {
        _popups[id] = dictionary;
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    /**
     * Get Popup by id
     * @param id
     * @returns {*}
     */
    this.getPopup = function (id) {
        return _popups[id];
    };

    /**
     * Remove a popup with a given id
     * @param id
     */
    this.removePopupWithId = function (id) {
        delete _popups[id];
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    /**
     * @param dictionary
     */
    this.removePopup = function (dictionary) {
        var removeId = null;
        for (var id in _popups) {
            if (_popups[id] == dictionary) {
                removeId = id;
            }
        }
        delete _popups[removeId];
        //var index = _popups.indexOf(dictionary);
        //_popups.splice(index,1);
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    this.removeAll = function (layer) {
        var idsToRemove = [];
        for(var id in _popups) {
            if(_popups[id].layer == layer) {
                idsToRemove.push(id);
            }
        }
        idsToRemove.forEach(function(id) {
            delete _popups[id];
        });
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };


    this.removeOutOfPath = function () {
        var idsToRemove = [];
        for(var id in _popups) {
            var lat = _popups[id].position.latitude;
            var long = _popups[id].position.longitude;
            if ( ! model.getAreaOfInterestModel().isInsideAreaOfInterest(lat, long)) {
                idsToRemove.push(id);
            }
        }
        idsToRemove.forEach(function(id) {
            delete _popups[id];
        });
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    this.getPopups = function () {
        return d3.values(_popups);
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var init = function () {
        notificationCenter.subscribe(self, self.removeOutOfPath, Notifications.areaOfInterest.PATH_UPDATED);
    }();
}


var PopupsType = {
    CRIME: "crimes",
    POTHOLES: "potholes",
    LIGHTS: "lights",
    DIVVY_BIKES: "divvy_bikes",
    VEHICLES: "vehicles",
    PLACES_OF_INTEREST: "places_of_interest",
    RESTAURANTS: "restaurants",
    BUS_STOPS: "bus_stops",
    BUS_VEHICLES: "bus_vehicles",
    BUS_ROUTES: "bus_routes",
    TRAIN_STATIONS: "train_stations"
};