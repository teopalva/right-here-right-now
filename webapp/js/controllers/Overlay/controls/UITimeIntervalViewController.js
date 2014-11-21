/**
 * @class UITimeIntervalViewController
 * @description ..
 *
 * @constructor
 */
function UITimeIntervalViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {

        // title label
        _titleLabel.getView().setFrame(0, 6, 141.5, 32);
        _titleLabel.getView().setViewBox(0, 0, 141.5, 32);
        _titleLabel.setText("Data not older than:");
        _titleLabel.setTextColor("white");
        _titleLabel.setTextSize(model.getThemeModel().smallTextSize);
        _titleLabel.setTextAlignment("center");
        self.add(_titleLabel);

        // week button
        _weekButton.getView().setFrame(0, 35, 141.5, 32);
        _weekButton.getView().setViewBox(0, 0, 141.5, 32);
        _weekButton.setTitle("LAST 2 WEEKS");
        _weekButton.setTitleSize(model.getThemeModel().mediumTextSize);
        _weekButton.onClick(function(){filterLayers(TimeRange.LAST_TWO_WEEKS);});
        self.add(_weekButton);

        // month button
        _monthButton.getView().setFrame(0, 67, 141.5, 32);
        _monthButton.getView().setViewBox(0, 0, 141.5, 32);
        _monthButton.setTitle("LAST MONTH");
        _monthButton.setTitleSize(model.getThemeModel().mediumTextSize);
        _monthButton.onClick(function(){filterLayers(TimeRange.LAST_MONTH);});
        self.add(_monthButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////
        var filterLayers = function(timeRange){
            var activeLayers = model.getMapLayersModel().getActiveLayersToFilter();
            for(i in activeLayers){
                switch(activeLayers[i]){
                    case Layers.POTHOLES:
                        model.getPotholesModel().filterByDate(timeRange);
                       break;
                    case Layers.LIGHTS:
                        model.getLightsModel().filterByDate(timeRange);
                        break;
                    case Layers.VEHICLES:
                        model.getVehiclesModel().filterByDate(timeRange);
                        break;
                    case Layers.VIOLENT_CRIMES:
                    case Layers.PROPERTY_CRIMES:
                    case Layers.QUALITY_OF_LIFE_CRIMES:
                        model.getCrimesModel().filterByDate(timeRange);
                        break;
                }
            }
        };

    var init = function () {
        self.getView().addClass("ui-time-interval-view-controller");
        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());


        // Setup UI
        _titleLabel = new UILabelViewController;
        _weekButton = new UIButtonViewController;
        _monthButton = new UIButtonViewController;

    }();
}

Utils.extend(UITimeIntervalViewController, UIViewController);