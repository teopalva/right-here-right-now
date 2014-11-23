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
        for (var i in PlaceOfInterest) {
            _placesOfInterest.push(PlaceOfInterest[i]);
        }
    };

    var init = function () {
        loadPlaces();
    }();
}

var PlaceOfInterest = {
    UIC: {
        name: "University of Illinois at Chicago",
        latitude: 41.871928,
        longitude: -87.649234,
        address: "700 S Halsted St, Chicago, IL 60607",
        url: "assets/icon/markers/uic.svg",
        image: "http://cdn.stateuniversity.com/assets/logos/images/981/large_uofi-chicago-_lecture_centers.jpg",
        wiki: "http://en.wikipedia.org/wiki/University_of_Illinois_at_Chicago",
        description: "The University of Illinois at Chicago, or UIC, is a state-funded public research university located in Chicago, Illinois, United States. Its campus is in the Near West Side community area, adjacent to the Chicago Loop."
    },
    MUSEUM_CAMPUS: {
        name: "Museum Campus",
        latitude: 41.861142,
        longitude: -87.614350,
        address: "Michigan Avenue at 11th Street",
        url: "assets/icon/markers/museum.svg",
        image: "http://svcdn.simpleviewinc.com/v3/cache/chicago/CEB8CC27055403EB70E6B65AE6D7200C.jpg",
        wiki: "http://en.wikipedia.org/wiki/Museum_Campus",
        description: "Museum Campus is a 57-acre museum that sits near Lake Michigan in Chicago and surrounds three of the city's most notable museums, all dedicated to the natural sciences."
    },
    LINCOLN_PARK: {
        name: "Lincoln Park",
        latitude: 41.922863,
        longitude: -87.636485,
        address: "Lincoln Park, Chicago, IL 60614",
        url: "assets/icon/markers/star.svg",
        image: "http://www.lincolnparkconservancy.org/images/shyline_from_park.jpg",
        wiki: "http://en.wikipedia.org/wiki/Lincoln_Park,_Chicago",
        description: "Lincoln Park, is one of the 77 community areas of Chicago, Illinois, United States, situated on its north side."
    }
};