/**
 * @description
 * @constructor
 */
function RecommenderModel() {

    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////

    var self = this;

    var _transports = {
        WALK: 0,
        BIKE: 1,
        CAR: 2,
        BUS: 3
    };

    var _crimeLayers = [Layers.VIOLENT_CRIMES, Layers.PROPERTY_CRIMES, Layers.QUALITY_OF_LIFE_CRIMES];

    /**
     * The transport selected with the button
     */
    var _selectedTransport = null;


    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.getTransports = function () {
        return _transports;
    };

    this.getRecommendedLayers = function () {

        var layers = [];

        // Retrieve info
        var sunrise = model.getTimeModel().getSunriseTime();
        var sunset = model.getTimeModel().getSunsetTime();
        var temp = model.getWeatherModel().getCurrentCelsiusTemperature();

        switch (_selectedTransport) {
        case _transports.WALK:

            layers.push(Layers.VEHICLES);
            layers = layers.concat(_crimeLayers);
            if (!isDay()) {
                layers.push(Layers.LIGHTS);
            }
            break;

        case _transports.BIKE:

            layers.push(Layers.DIVVY_BIKES, Layers.POTHOLES, Layers.VEHICLES);
            layers = layers.concat(_crimeLayers);
            if (!isDay()) {
                layers.push(Layers.LIGHTS);
            }
            break;

        case _transports.CAR:

            layers.push(Layers.POTHOLES);
            if (!isDay()) {
                layers.push(Layers.LIGHTS);
            }
            break;

        case _transports.BUS:

            layers.push(Layers.CTA_BUSES, Layers.CTA_STOPS, Layers.CTA_TRAINS);
            break;

        }

        return layers;
    };

    this.setSelectedTransport = function (transport) {
        _selectedTransport = transport;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var init = function () {

    }();

    /**
     * @return true if the current time is in the day (daylight), false if during night
     */
    var isDay = function () {
        var sunrise = model.getTimeModel().getSunriseTime();
        var sunset = model.getTimeModel().getSunsetTime();
        var time = model.getTimeModel().getCurrentTime();
        return (time > sunrise && time < sunset) ? true : false;
    };
}