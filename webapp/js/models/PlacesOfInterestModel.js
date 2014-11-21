/**
 * @description Stores all the information about the places of interest
 * @constructor
 */
function PlacesOfInterestModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _placesOfInterest = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.getPlacesOfInterest = function(){
      return _placesOfInterest;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var loadPlaces = function() {
        for (i in PlaceOfInterest){
            _placesOfInterest.push(PlaceOfInterest[i]);
        }
    };

    var init = function() {
       loadPlaces();
    } ();
}

var PlaceOfInterest = {
    UIC : {name: "UIC", latitude: 41.871828, longitude: -87.647034},
    MUSEUM_CAMPUS : {name: "Museum Campus", latitude:  41.861142, longitude: -87.614350}
};