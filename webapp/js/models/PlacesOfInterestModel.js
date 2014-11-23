/**
 * @description Stores all the information about the places of interest
 * @constructor
 */
function PlacesOfInterestModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _placesOfInterest = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.getPlacesOfInterest = function () {
        return _placesOfInterest;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var loadPlaces = function () {
        for (i in PlaceOfInterest) {
            _placesOfInterest.push(PlaceOfInterest[i]);
        }
    };

    var init = function () {
        loadPlaces();
    }();
}

var PlaceOfInterest = {
    UIC: {
        name: "UIC",
        latitude: 41.871828,
        longitude: -87.647034,
        url: "assets/icon/markers/uic.svg"
    },
    MUSEUM_CAMPUS: {
        name: "Museum Campus",
        latitude: 41.861142,
        longitude: -87.614350,
        url: "assets/icon/markers/museum.svg"
    },
    LINCOLN_PARK: {
        name: "Lincoln Park",
        latitude: 41.922863,
        longitude: -87.636485,
        url: "assets/icon/markers/star.svg"
    }
};