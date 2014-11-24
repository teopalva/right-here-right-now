/**
 * @class BusStopPopupContentViewController
 * @description
 * 
 * @constructor
 */
function BusStopPopupContentViewController(dictionary, _busStopFrameSize) {
    UIViewController.call(this);
    /////////////////// PRIVATE ATTRIBUTES ///////////////////
    var self = this;

    var _idLabel;
    var _nameLabel;
    var _routeLabel;
    var _predictionLabel = [];

    var _dictionary = dictionary;

    var _stopID;

    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 10000;

    /////////////////// PUBLIC METHODS /////////////////////
    var super_dispose = this.dispose;
    this.dispose = function() {
        super_dispose.call(self);

        // Do clean here
        notificationCenter.unsuscribeFromAll(self);
        model.getCtaModel().removePredictions(_stopID);
        model.getCtaModel().removeRoutePath(_dictionary.info.route, _stopID);
        stopUpdates();
    };
    

    /////////////////// PRIVATE METHODS ///////////////////
    var updatePredictions = function() {
        console.log("Updatind predictions...")

        var predictions = model.getCtaModel().getPredictions(_stopID);
        //var predictions = model.getCtaModel().getAllPredictions();

        if(predictions && predictions.length > 0) {

            var preds = [predictions[0], predictions[1]];
            var counter = 0;

            _predictionLabel[0].setText("");
            _predictionLabel[1].setText("");


            preds.forEach(function (p) {
                if (p) {
                    var predictedTime = p.time.slice(0, 4) + "/" + p.time.slice(4, 6) + "/" + p.time.slice(6, p.time.length);
                    var currentTime = model.getCtaModel().getCtaTime();
                    currentTime = currentTime.slice(0, 4) + "/" + currentTime.slice(4, 6) + "/" + currentTime.slice(6, currentTime.length);

                    var time = parseInt((new Date(predictedTime) - new Date(currentTime)) / (1000 * 60));

                    var predictionString = "";
                    if (time != 0) {
                        predictionString += time + " min";
                    }
                    else {
                        predictionString += "DUE";
                    }
                    if (p.route !== "") {
                        predictionString += " - " + p.route;
                    }
                    if (p.destination !== "") {
                        predictionString += " - " + p.destination;
                    }
                    //if(p.direction !== "") {
                    //    predictionString += " - " + p.direction;
                    //}
                    if (p.delay !== "") {
                        predictionString += " - delay";
                    }
                    if (p.vehicleID !== "") {
                        predictionString += " - ID: " + p.vehicleID;
                    }

                    _predictionLabel[counter++].setText(predictionString);
                }
            });
        }
        else  if(predictions && predictions.length == 0){
            _predictionLabel[0].setText("NO SERVICE");
        }
        else {
            _predictionLabel[0].setText("LOADING...");
        }
    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    var startUpdates = function() {
        console.log("POPUP PRED TIMER");
        console.log(_updateTimer);
        if(_updateTimer === null) {
            retrievePrediction();
            _updateTimer = setInterval(retrievePrediction, _intervalMillis);
        }
    };

    /**
     * Stops the timer that updates the model
     */
    var stopUpdates = function() {
        clearInterval(_updateTimer);
        _updateTimer = null;
    };

    var retrievePrediction = function() {
        model.getCtaModel().retrievePrediction(_stopID);
    };


    var enableRoute = function() {
        model.getCtaModel().enableRoutePath(_dictionary.info.route, _stopID);
    };


    var init = function() {
        // Setup popup
        var labelsSize = {
            width: _busStopFrameSize.width - 20,
            height: 30
        };

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        _stopID = _dictionary.info.id;

        //_idLabel = new UILabelViewController();
        //_idLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        //_idLabel.setText("route" + dictionary.info.route + " - " + _stopID);
        //_idLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        //self.add(_idLabel);

        _nameLabel = new UILabelViewController();
        _nameLabel.getView().setFrame(padding.left,padding.top + padding.between,labelsSize.width,labelsSize.height);
        var text = _dictionary.info.name + " (" + _stopID + ")";
        if(text.length > 22) {
            text = text.substring(0,22) + "...";
        }
        _nameLabel.setText(text);
        _nameLabel.setTextSize(model.getThemeModel().mediumTextSize());
        _nameLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_nameLabel);

        //_routeLabel = new UILabelViewController();
        //_routeLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        //_routeLabel.setText("ROUTE: " + _dictionary.info.route);
        //_routeLabel.setTextAlignment(TextAlignment.LEFT);
        //_routeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        //self.add(_routeLabel);

        _predictionLabel[0] = new UILabelViewController();
        _predictionLabel[0].getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        _predictionLabel[0].setTextAlignment(TextAlignment.LEFT);
        _predictionLabel[0].setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_predictionLabel[0]);

        _predictionLabel[1] = new UILabelViewController();
        _predictionLabel[1].getView().setFrame(padding.left,padding.top * 9 ,labelsSize.width,labelsSize.height);
        _predictionLabel[1].setTextAlignment(TextAlignment.LEFT);
        _predictionLabel[1].setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_predictionLabel[1]);


        notificationCenter.subscribe(self, updatePredictions, Notifications.cta.BUS_STOP_PREDICTIONS);
        notificationCenter.subscribe(self, enableRoute, Notifications.cta.ROUTES_PATHS_LOADED);



        //model.getCtaModel().retrievePrediction(_stopID);

        if(model.getCtaModel().getRoutesPathsLoaded() === true) {
            enableRoute();
        }


        //startTimer
        startUpdates();

    } ();
}

Utils.extend(BusStopPopupContentViewController, UIViewController);