/**
 * @class TrainStopPopupContentViewController
 * @description
 *
 * @constructor
 */
function TrainStopPopupContentViewController(dictionary, _busStopFrameSize) {
    UIViewController.call(this);
    /////////////////// PRIVATE ATTRIBUTES ///////////////////
    var self = this;

    var _idLabel;
    var _nameLabel;
    var _routeLabel;
    var _predictionLabel = [];
    var _predictionsNumber = 4;

    var _dictionary = dictionary;

    var _stopID;

    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 30000;

    /////////////////// PUBLIC METHODS /////////////////////
    var super_dispose = this.dispose;
    this.dispose = function() {
        super_dispose.call(self);

        // Do clean here
        notificationCenter.unsuscribeFromAll(self);
        model.getCtaTrainModel().removePredictions(_stopID);
        // TODO manage metro lines in the same way
        //model.getCtaModel().removeRoutePath(_dictionary.info.route, _stopID);
        stopUpdates();
    };


    /////////////////// PRIVATE METHODS ///////////////////
    var updatePredictions = function() {
        console.log("Updatind predictions...")

        var predictions = model.getCtaTrainModel().getPredictions(_stopID);
        //var predictions = model.getCtaModel().getAllPredictions();

        if(predictions && predictions.length > 0) {

            var preds = [];
            for(var i = 0; i < _predictionsNumber; i++) {
                preds.push(predictions[i]);
                _predictionLabel[i].setText("");
            }
            var counter = 0;


            preds.forEach(function (p) {
                if (p) {
                    var predictionString = "" + p.eta;
                    if(p.eta != "DUE") {
                        predictionString += " min";
                    }
                    if (p.routeName !== "") {
                        _predictionLabel[counter].setTextColor(p.routeName);
                        predictionString += " - " + p.routeName;
                    }
                    if (p.destinationName !== "") {
                        predictionString += " - " + p.destinationName;
                    }
                    if(p.delay != "-") {
                        predictionString += " - " + p.delay;
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
        model.getCtaTrainModel().retrieveStationInfo(_stopID);
    };


    // TODO: do
    //var enableRoute = function() {
    //    model.getCtaTrainModel().enableRoutePath(_dictionary.info.route, _stopID);
    //};


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

        _stopID = _dictionary.info.PARENT_STOP_ID;
        console.log(_stopID)

        _idLabel = new UILabelViewController();
        _idLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        _idLabel.setText(_stopID);
        _idLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_idLabel);

        _nameLabel = new UILabelViewController();
        _nameLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        _nameLabel.setText(_dictionary.info.STATION_NAME);
        _nameLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_nameLabel);

        //_routeLabel = new UILabelViewController();
        //_routeLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        //_routeLabel.setText("ROUTE: " + _dictionary.info.route);
        //_routeLabel.setTextAlignment(TextAlignment.LEFT);
        //_routeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        //self.add(_routeLabel);

        for(var i = 0; i < _predictionsNumber; i++) {
            _predictionLabel[i] = new UILabelViewController();
            _predictionLabel[i].getView().setFrame(padding.left, padding.top * (7 + i*2), labelsSize.width, labelsSize.height);
            _predictionLabel[i].setTextAlignment(TextAlignment.LEFT);
            _predictionLabel[i].setTextColor(model.getThemeModel().defaultToolTextColor());
            self.add(_predictionLabel[i]);
        }

        notificationCenter.subscribe(self, updatePredictions, Notifications.cta.TRAIN_STOP_PREDICTIONS);

        // TODO caricamento linee
        //notificationCenter.subscribe(self, enableRoute, Notifications.cta.ROUTES_PATHS_LOADED);



        //model.getCtaModel().retrievePrediction(_stopID);

        //TODO: aspettare la fine di tutte le query e disegnare linea metro
        //if(model.getCtaModel().getRoutesPathsLoaded() === true) {
        //    enableRoute();
        //}


        //startTimer
        startUpdates();

    } ();
}

Utils.extend(TrainStopPopupContentViewController, UIViewController);