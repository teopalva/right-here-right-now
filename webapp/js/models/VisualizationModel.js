/**
 * @class VisualizationModel
 * @description Model that keeps color information
 *
 * @constructor
 */
function VisualizationModel() {
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    ///////////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns path start point color
     * * @returns {string}
     */
    this.pathStartPointColor = function () {
        return "rgba(65,171,93, 1.0)";
    };

    /**
     * Returns path way-point color
     * * @returns {string}
     */
    this.pathWaypointColor = function () {
        return "rgba(107,174,214, 1.0)";
    };

    /**
     * Returns path end point color
     * * @returns {string}
     */
    this.pathEndPointColor = function () {
        return "rgba(215,48,31, 1.0)";
    };

    /**
     *
     * @returns {number}
     */
    this.selectionPointRadius = function () {
        return 15;
    };

    /**
     *
     * @returns {string}
     */
    this.selectionCornerFillColor = function () {
        return "rgba(41,36,33, 1.0)";
    };

    /**
     *
     * @returns {string}
     */
    this.selectionCornerStrokeColor = function () {
        return "rgba(0,0,0, 1.0)";
    };

    /**
     *
     * @returns {number}
     */
    this.selectionCornerStrokeWidth = function () {
        return 3;
    };

    /**
     * Returns area of interest fill color
     * * @returns {string}
     */
    this.areaOfInterestFillColor = function () {
        return "rgba(246,246,246, 0.3)";
    };

    /**
     * Returns area of interest stroke color
     * * @returns {string}
     */
    this.areaOfInterestStrokeColor = function () {
        return "rgba(41,36,33, 0.6)";
    };

    /**
     *
     * @returns {number}
     */
    this.areaOfInterestStrokeWidth = function () {
        return 8;
    };

    /**
     *
     */
    this.directionsStrokeWidth = function () {
        return 6;
    };

    /**
     *
     * @returns {string}
     */
    this.directionsStrokeColor = function () {
        return "rgba(52, 73, 94, 0.8)";
    };

    /**
     * Returns the level of zoom at which markers can be shown with more details
     * @returns {number}
     */
    this.detailedMarkerZoomLevel = function () {
        return 15;
    };

    /**
     * Return map marker radius
     * @returns {number}
     */
    this.markerRadius = function () {
        return 5;
    };

    /**
     * Return marker (circle) stroke color
     * @returns {string}
     */
    this.markerStrokeColor = function () {
        return "white";
    }

    /**
     * Return marker (circle) stroke width
     * @returns {string}
     */
    this.markerStrokeWidth = function () {
        return "0.5";
    }

    // CTA Bus
    /**
     * Returns CTA bus color
     * @returns {string}
     */
    this.CTAMarkerColor = function () {
        return this.layersColors["CTA bus"];
    };

    /**
     * Returns CTA bus icon path
     * @returns {string}
     */
    this.CTAMarkerIconPath = function () {
        return "assets/icon/markers/cta_bus.svg";
    };

    /**
     * Returns CTA marker size
     * @returns {{width: number, height: number}}
     */
    this.CTAMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };

    // CTA Bus Stations
    /**
     * Returns CTA color
     * @returns {string}
     */
    this.CTABusStationColor = function () {
        return this.layersColors["CTA stops"];
    };

    /**
     * Returns CTA icon path
     * @returns {string}
     */
    this.CTABusStationIconPath = function () {
        return "assets/icon/markers/bus_stop.svg";
    };

    /**
     * Returns CTA marker size
     * @returns {{width: number, height: number}}
     */
    this.CTABusStationIconSize = function () {
        return {
            width: 20,
            height: 20
        }
    };

    // CTA Train Stations
    /**
     * Returns CTA color
     * @returns {string}
     */
    this.CTATrainStationColor = function () {
        return this.layersColors["CTA train"];
    };

    /**
     * Returns CTA icon path
     * @returns {string}
     */
    this.CTATrainStationIconPath = function () {
        return "assets/icon/markers/train_stop.svg";
    };

    /**
     * Returns CTA marker size
     * @returns {{width: number, height: number}}
     */
    this.CTATrainStationIconSize = function () {
        return {
            width: 20,
            height: 20
        }
    };

    // DIVVY
    /**
     * Returns divvy color
     * @returns {string}
     */
    this.divvyMarkerColor = function () {
        return this.layersColors["Divvy Bikes"];
    };

    /**
     * Returns divvy icon path
     * @returns {string}
     */
    this.divvyMarkerIconPath = function () {
        return "assets/icon/markers/divvy.svg";
    };

    /**
     * Returns divvy marker size
     * @returns {{width: number, height: number}}
     */
    this.divvyMarkerIconSize = function () {
        return {
            width: 30,
            height: 30
        }
    };


    // Subways
    /**
     * Returns subway station color
     * @returns {string}
     */
    this.subwaysMarkerColor = function () {
        return this.layersColors["CTA train"];
    };

    /**
     * Returns subway station icon path
     * @returns {string}
     */
    this.subwaysMarkerIconPath = function () {
        return "assets/icon/markers/train_stop.svg";
    };

    /**
     * Returns subways marker size
     * @returns {{width: number, height: number}}
     */
    this.subwaysMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };


    // Potholes
    /**
     * Returns potholes color
     * @returns {string}
     */
    this.potholesMarkerColor = function () {
        return this.layersColors["Potholes"];
    };

    /**
     *
     * @param opacity
     * @returns {string}
     */
    this.potholesColor = function(/**opacity=1*/opacity) {
        opacity = opacity || 1;
        return "rgba(106,81,163," + opacity + ")";
    };

    /**
     * Returns potholes icon path
     * @returns {string}
     */
    this.potholesMarkerIconPath = function () {
        return "assets/icon/markers/potholes.svg";
    };

    /**
     * Returns potholes marker size
     * @returns {{width: number, height: number}}
     */
    this.potholesMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };


    // PASSED RESTAURANTS
    /**
     * Returns restaurant color
     * @returns {string}
     */
    this.passedRestaurantsMarkerColor = function () {
        return this.layersColors["Top Restaurants"];
    };

    /**
     * Returns restaurant icon path
     * @returns {string}
     */
    this.passedRestaurantsMarkerIconPath = function () {
        return "assets/icon/markers/restaurant_top.svg";
    };

    /**
     * Returns restaurant  marker size
     * @returns {{width: number, height: number}}
     */
    this.passedRestaurantsMarkerIconSize = function () {
        return {
            width: 40,
            height: 40
        }
    };

    // FAILED RESTAURANTS
    /**
     * Returns restaurant color
     * @returns {string}
     */
    this.failedRestaurantsMarkerColor = function () {
        return this.layersColors["Failed Restaurants"];
    };

    /**
     * Returns restaurant  icon path
     * @returns {string}
     */
    this.failedRestaurantsMarkerIconPath = function () {
        return "assets/icon/markers/restaurant_failed.svg";
    };

    /**
     * Returns restaurant marker size
     * @returns {{width: number, height: number}}
     */
    this.failedRestaurantsMarkerIconSize = function () {
        return {
            width: 40,
            height: 40
        }
    };


    // PLACES OF INTEREST
    /**
     * Returns restaurant  icon path
     * @returns {string}
     */
    this.placesOfInterestMarkerIconPath = function () {
        return "assets/icon/markers/restaurant_failed.svg";
    };

    /**
     * Returns restaurant marker size
     * @returns {{width: number, height: number}}
     */
    this.placesOfInterestMarkerIconSize = function () {
        return {
            width: 40,
            height: 40
        }
    };


    // Abandoned Vehicles
    /**
     * Returns abandonedVehicles color
     * @returns {string}
     */
    this.abandonedVehiclesMarkerColor = function () {
        return this.layersColors["Abandoned Vehicles"];
    };

    /**
     *
     * @param opacity
     * @returns {string}
     */
    this.abandonedVehiclesColor = function(/**opacity=1*/opacity) {
        opacity = opacity || 1;
        return "rgba(128,125,186," + opacity + ")";
    };

    /**
     * Returns abandonedVehicles icon path
     * @returns {string}
     */
    this.abandonedVehiclesMarkerIconPath = function () {
        return "assets/icon/markers/vehicles.svg";
    };

    /**
     * Returns abandonedVehicles marker size
     * @returns {{width: number, height: number}}
     */
    this.abandonedVehiclesMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };


    // Street lights
    /**
     * Returns streetLights color
     * @returns {string}
     */
    this.streetLightsMarkerColor = function () {
        return this.layersColors["Streets Lights Out"];
    };

    /**
     *
     * @param opacity
     * @returns {string}
     */
    this.streetLightsColor = function(/**opacity=1*/opacity) {
        opacity = opacity || 1;
        return "rgba(188,189,220," + opacity + ")";
    };

    /**
     * Returns streetLights icon path
     * @returns {string}
     */
    this.streetLightsMarkerIconPath = function () {
        return "assets/icon/markers/light.svg";
    };

    /**
     * Returns streetLights marker size
     * @returns {{width: number, height: number}}
     */
    this.streetLightsMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };


    // Violent violentCrimes
    /**
     * Returns violentCrimes color
     * @returns {string}
     */
    this.violentCrimesMarkerColor = function () {
        return this.layersColors["Violent Crimes"];
    };

    /**
     * Returns violentCrimes icon path
     * @returns {string}
     */
    this.violentCrimesMarkerIconPath = function () {
        return "assets/icon/markers/crime_violent.svg";
    };

    /**
     * Returns violentCrimes marker size
     * @returns {{width: number, height: number}}
     */
    this.violentCrimesMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };

    // Property Crimes
    /**
     * Returns propertyCrimes color
     * @returns {string}
     */
    this.propertyCrimesMarkerColor = function () {
        return this.layersColors["Property Crimes"];
    };

    /**
     * Returns propertyCrimes icon path
     * @returns {string}
     */
    this.propertyCrimesMarkerIconPath = function () {
        return "assets/icon/markers/crime_property.svg";
    };

    /**
     * Returns propertyCrimes marker size
     * @returns {{width: number, height: number}}
     */
    this.propertyCrimesMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };


    // Quality of life violentCrimes
    /**
     * Returns qualityOfLifeCrimes color
     * @returns {string}
     */
    this.qualityOfLifeCrimesMarkerColor = function () {
        return this.layersColors["Quality-of-life Crimes"];
    };

    /**
     * Returns qualityOfLifeCrimes icon path
     * @returns {string}
     */
    this.qualityOfLifeCrimesMarkerIconPath = function () {
        return "assets/icon/markers/crime_quality-of-life.svg";
    };

    /**
     * Returns qualityOfLifeCrimes marker size
     * @returns {{width: number, height: number}}
     */
    this.qualityOfLifeCrimesMarkerIconSize = function () {
        return {
            width: 50,
            height: 50
        }
    };


    this.violentCrimesDeselectedColor = function() {
        return "rgba(248,53,33, 0.3)";
    };

    this.propertyCrimesDeselectedColor = function() {
        return "rgba(250,121,46, 0.3)";
    };

    this.qualityOfLifeCrimesDeselectedColor = function() {
        return "rgba(252,163,60, 0.3";
    };

    /**
     * Dictionary of layers colors
     */
    this.layersColors = {
        "CTA bus": "rgba(28,91,166, 1.0)",
        "CTA stops": "teal",
        "CTA train": "rgba(53,126,186, 1.0)",
        "Divvy Bikes": "rgba(90,158,204, 1.0)",
        "Potholes": "rgba(106,81,163, 1.0)",
        "Abandoned Vehicles": "rgba(128,125,186, 1.0)",
        "Streets Lights Out": "rgba(188,189,220, 1.0)",
        "Violent Crimes": "rgba(248,53,33, 1.0)",
        "Property Crimes": "rgba(250,121,46, 1.0)",
        "Quality-of-life Crimes": "rgba(252,163,60, 1.0)",
        "Top Restaurants": "rgba(31,123,53, 1.0)",
        "Failed Restaurants": "rgba(107,196,105, 1.0)",
       
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function () {

    }();
}