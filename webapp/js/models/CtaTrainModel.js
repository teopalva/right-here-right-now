/***
 * @class CtaTrainModel
 * @description
 *
 * @constructor
 */
function CtaTrainModel() {
    /////////////// PRIVATE ATTRIBUTES ///////////////
    var self = this;

    // CTA Key
    var _key = "17505d0615f04180b8a67faa7d6016cc";

    // CTA Train stations
    var _stations = [];

    // CTA predictions
    var _predictions = {};

    // CTA lines
    var _lineColors = {
        Red: "rgb(255,55,29)",
        Blue:"rgb(49,130,189)",
        Brn:"rgb(140,64,42)",
        G:"rgb(21,141,25)",
        Org:"rgb(255,126,36)",
        P:"rgb(147,66,255)",
        Pink:"rgb(217,102,149)",
        Y:"rgb(246,224,10)"
    };

    /////////////// PUBLIC METHODS ///////////////
    this.getStations = function() {
        return _stations;
    };

    this.removePredictions = function(stopID) {
        delete _predictions[stopID];
    };

    this.getPredictions = function(stopID) {
        return _predictions[stopID];
    };

    this.getAllPredictions = function() {
        return _predictions;
    };

    this.getLineColor = function(color) {
        return _lineColors[color];
    };

    /***
     * Retrieve the list of all the stations
     */
    this.retrieveStations = function() {
        d3.json("/webapp/data/cta_L_stops.json",function(json){
            json.forEach(function(station){

                station["latitude"] = station["LAT"];
                station["longitude"] = station["LON"];
                delete station["LAT"];
                delete station["LON"];

                _stations.push(station);
            });
            notificationCenter.dispatch(Notifications.cta.TRAIN_STATIONS);
        });
    };

    /***
     * Retrieve data about the selected stop
     *
     * @param stop stopId of the specific stop inside a station.
     *
     * A station can have many stops inside of it depending on directions and lines.
     * For more information consult the CTA Train API Documents.
     */
    this.retrieveStationInfo = function(stopID) {
        var url = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=" + _key + "&mapid=" + parseInt(stopID);
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&callback=?';


        $.getJSON(yql, function (data) {
            var parsed_xml = data.results[0];

            console.log(parsed_xml);

            _predictions[stopID] = [];

            $(parsed_xml).find('eta').each(function () {

                var arrivalTime    =$(this).find("arrT").text();
                var predictionTime =$(this).find("prdt").text();


                var arrivalDate = new Date(arrivalTime.substring(0,4) + "/" + arrivalTime.substring(4,6) + "/" + arrivalTime.substring(6,arrivalTime.length));
                var predictionDate = new Date(predictionTime.substring(0,4) + "/" + predictionTime.substring(4,6) + "/" + predictionTime.substring(6,predictionTime.length));

                var minutes = (arrivalDate - predictionDate)/60000;

                var eta     = $(this).find("isApp").text() === "0" ? minutes : "DUE";
                var delay   = $(this).find("isDly").text() === "0" ? "-" : "delay";

                var stopInfo = {
                    stationId:          $(this).find("staId").text(),
                    stopId:             $(this).find("stpId").text(),
                    stationName:        $(this).find("staNm").text(),
                    stopDestination:    $(this).find("stpDe").text(),
                    trainID:            $(this).find("rn").text(),
                    routeName:          $(this).find("rt").text(),
                    destinationID:      $(this).find("destSt").text(),
                    destinationName:    $(this).find("destNm").text(),
                    eta:                eta,
                    delay:              delay,
                    latitude:           $(this).find("lat").text(),
                    longitude:          $(this).find("lon").text(),
                    heading:            $(this).find("heading").text()
                };

                _predictions[stopID].push(stopInfo);
            });
            console.log("Station " + stopID);
            console.log(_predictions[stopID]);

            notificationCenter.dispatch(Notifications.cta.TRAIN_STOP_PREDICTIONS);
        });
    };

    /////////////// PRIVATE METHODS ///////////////
    var init = function() {

    } ();

}