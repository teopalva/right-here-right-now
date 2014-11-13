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
    this.selectionPointRadius = function() {
        return 15;
    };

    /**
     *
     * @returns {string}
     */
    this.selectionCornerFillColor = function() {
        return "rgba(41,36,33, 1.0)";
    };

    /**
     *
     * @returns {string}
     */
    this.selectionCornerStrokeColor = function() {
        return "rgba(0,0,0, 1.0)";
    };

    /**
     *
     * @returns {number}
     */
    this.selectionCornerStrokeWidth = function() {
        return 3;
    };

    /**
     * Returns area of interest fill color
     * * @returns {string}
     */
    this.areaOfInterestFillColor = function () {
        return "rgba(246,246,246, 0.5)";
    };

    /**
     * Returns area of interest stroke color
     * * @returns {string}
     */
    this.areaOfInterestStrokeColor = function() {
        return "rgba(41,36,33, 0.6)";
    };

    /**
     *
     * @returns {number}
     */
    this.areaOfInterestStrokeWidth = function() {
        return 8;
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

    // CTA
    /**
     * Returns CTA color
     * @returns {string}
     */
    this.CTAMarkerColor = function () {
        return "rgba(252,78,42, 1.0)";
    };

    /**
     * Returns CTA icon path
     * @returns {string}
     */
    this.CTAMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns CTA marker size
     * @returns {{width: number, height: number}}
     */
    this.CTAMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };

    // DIVVY
    /**
     * Returns divvy color
     * @returns {string}
     */
    this.divvyMarkerColor = function () {
        return "rgba(252,78,42, 1.0)";
    };

    /**
     * Returns divvy icon path
     * @returns {string}
     */
    this.divvyMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns divvy marker size
     * @returns {{width: number, height: number}}
     */
    this.divvyMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };


    // Subways
    /**
     * Returns subways color
     * @returns {string}
     */
    this.subwaysMarkerColor = function () {
        return "rgba(252,78,42, 1.0)";
    };

    /**
     * Returns subways icon path
     * @returns {string}
     */
    this.subwaysMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
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
        return "rgba(252,78,42, 1.0)";
    };

    /**
     * Returns potholes icon path
     * @returns {string}
     */
    this.potholesMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns potholes marker size
     * @returns {{width: number, height: number}}
     */
    this.potholesMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };


    // Abandoned Vehicles
    /**
     * Returns abandonedVehicles color
     * @returns {string}
     */
    this.abandonedVehiclesMarkerColor = function () {
        return "rgba(252,78,42, 1.0)";
    };

    /**
     * Returns abandonedVehicles icon path
     * @returns {string}
     */
    this.abandonedVehiclesMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns abandonedVehicles marker size
     * @returns {{width: number, height: number}}
     */
    this.abandonedVehiclesMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };


    // Street lights
    /**
     * Returns streetLights color
     * @returns {string}
     */
    this.streetLightsMarkerColor = function () {
        return "rgba(252,78,42, 1.0)";
    };

    /**
     * Returns streetLights icon path
     * @returns {string}
     */
    this.streetLightsMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns streetLights marker size
     * @returns {{width: number, height: number}}
     */
    this.streetLightsMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };


    // Violent violentCrimes
    /**
     * Returns violentCrimes color
     * @returns {string}
     */
    this.violentCrimesMarkerColor = function () {
        return "rgba(106,81,163, 1.0)";
    };

    /**
     * Returns violentCrimes icon path
     * @returns {string}
     */
    this.violentCrimesMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns violentCrimes marker size
     * @returns {{width: number, height: number}}
     */
    this.violentCrimesMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };

    // Property Crimes
    /**
     * Returns propertyCrimes color
     * @returns {string}
     */
    this.propertyCrimesMarkerColor = function () {
        return "rgba(128,125,186, 1.0)";
    };

    /**
     * Returns propertyCrimes icon path
     * @returns {string}
     */
    this.propertyCrimesMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns propertyCrimes marker size
     * @returns {{width: number, height: number}}
     */
    this.propertyCrimesMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };


    // Quality of life violentCrimes
    /**
     * Returns qualityOfLifeCrimes color
     * @returns {string}
     */
    this.qualityOfLifeCrimesMarkerColor = function () {
        return "rgba(188,189,220, 1.0)";
    };

    /**
     * Returns qualityOfLifeCrimes icon path
     * @returns {string}
     */
    this.qualityOfLifeCrimesMarkerIconPath = function () {
        return "assets/icon/markers/pothole.svg";
    };

    /**
     * Returns qualityOfLifeCrimes marker size
     * @returns {{width: number, height: number}}
     */
    this.qualityOfLifeCrimesMarkerIconSize = function () {
        return {
            width: 70,
            height: 70
        }
    };

    /**
     * Dictionary of layers colors
     */
    this.layersColors = {
        "CTA bus": "rgba(28,91,166, 1.0)",
        "CTA train": "rgba(53,126,186, 1.0)",
        "Divvy Bikes": "rgba(90,158,204, 1.0)",
        "Potholes": "rgba(248,53,33, 1.0)",
        "Abandoned Vehicles": "rgba(250,121,46, 1.0)",
        "Streets Lights Out": "rgba(252,163,60, 1.0)",
        "Violent Crimes": "rgba(106,81,163, 1.0)",
        "Property Crimes": "rgba(128,125,186, 1.0)",
        "Quality-of-life Crimes": "rgba(188,189,220, 1.0)",
        "Restaurants": "rgba(31,123,53, 1.0)",
        "Bars": "rgba(55,159,75, 1.0)",
        "Stores": "rgba(100,187,99, 1.0)",
    };

    ///////////////////////////// PRIVATE METHODS /////////////////////////////
    var init = function () {

    }();
}