/**
 * @description Stores all the information about the places of interest
 * @constructor
 */
function TuristAttractionsModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _turistAttractions = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.getTuristAttractions = function () {
        return _turistAttractions;
    };

    this.startUpdates = function(){
      loadPlaces();
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var loadPlaces = function () {
        for (var i in TuristAttraction) {
            _turistAttractions.push(TuristAttraction[i]);
        }
        notificationCenter.dispatch(Notifications.turistAttractions.DATA_CHANGED);
    };

    var init = function () {

    }();
}

var TuristAttraction = {
    WILLIS: {
        name: "Willis Tower",
        latitude: 41.878884,
        longitude: -87.635926,
        address: "233 S Wacker Dr, Chicago, IL 60606",
        url: "assets/icon/markers/star.svg",
        image: "http://archpaper.com/uploads/image/Tower-Hotel.jpg",
        wiki: "http://en.wikipedia.org/wiki/Willis_Tower",
        description: "Willis Tower is a 108-story, 1,451-foot skyscraper in Chicago, Illinois, United States. At the time of its completion in 1973, it was the tallest building in the world, surpassing the World Trade Center."
    },
    JOHN_HANCOCK: {
        name: "John Hancock Center",
        latitude: 41.898776,
        longitude: -87.622916,
        address: "875 N Michigan Ave, Chicago, IL 60611",
        url: "assets/icon/markers/star.svg",
        image: "http://www.ctbuh.org/Portals/0/High-rise%20Resources/Featured%20Tall/2011/JHC/JHC_1.jpg",
        wiki: "http://en.wikipedia.org/wiki/John_Hancock_Center",
        description: "The John Hancock Center is a 100-story, 1,127-foot tall skyscraper, located at 875 North Michigan Avenue in the Streeterville area of Chicago, Illinois, United States."
    },
    NAVY_PIER: {
        name: "Navy Pier",
        latitude: 41.891634,
        longitude: -87.605165,
        address: "600 E Grand Ave, Chicago, IL 60611",
        url: "assets/icon/markers/star.svg",
        image: "http://www.destination360.com/north-america/us/illinois/chicago/images/s/navy-pier.jpg",
        wiki: "http://en.wikipedia.org/wiki/Navy_Pier",
        description: "Navy Pier is a 3,300-foot-long pier on the Chicago shoreline of Lake Michigan. It is located in the Streeterville neighborhood of the Near North Side community area. The pier was built in 1916 at a cost of $4.5 million."
    }
};