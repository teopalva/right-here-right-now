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

    var _titleLabel;
    var _weekButton;
    var _monthButton;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {

        // title label
        _titleLabel.getView().setFrame(0, 6, 154, 32);
        _titleLabel.getView().setViewBox(0, 0, 154, 32);
        _titleLabel.setText("Data not older than:");
        _titleLabel.setTextColor("white");
        _titleLabel.setTextSize(model.getThemeModel().smallTextSize);
        _titleLabel.setTextAlignment("center");
        self.add(_titleLabel);

        // week button
        _weekButton.getView().setFrame(0, 35, 154, 32);
        _weekButton.getView().setViewBox(0, 0, 154, 32);
        _weekButton.setTitle("LAST 2 WEEKS");
        _weekButton.setTitleSize(model.getThemeModel().mediumTextSize);
        _weekButton.deselect();
        _weekButton.onClick(function () {
            weekSelected();
            filterLayers(TimeRange.LAST_TWO_WEEKS);
        });
        self.add(_weekButton);

        // month button
        _monthButton.getView().setFrame(0, 67, 154, 32);
        _monthButton.getView().setViewBox(0, 0, 154, 32);
        _monthButton.setTitle("LAST MONTH");
        _monthButton.setTitleSize(model.getThemeModel().mediumTextSize);
        _monthButton.deselect();
        _monthButton.onClick(function () {
            monthSelected();
            filterLayers(TimeRange.LAST_MONTH);
        });
        self.add(_monthButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////
    var filterLayers = function (timeRange) {
        /*timeToDisplay = timeRange;
        model.getPotholesModel().filterByDate();
        model.getLightsModel().filterByDate();
        model.getVehiclesModel().filterByDate();
        model.getCrimesModel().filterByDate();*/
        model.getTimeModel().setTemporalScope(timeRange);
    };

    var weekSelected = function () {
        _monthButton.deselect();
        _monthButton.getView().setBackgroundColor(null);
        _weekButton.select();
        _weekButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor);
    };

    var monthSelected = function () {
        _weekButton.deselect();
        _weekButton.getView().setBackgroundColor(null);
        _monthButton.select();
        _monthButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor);
    };

    var init = function () {
        self.getView().addClass("ui-time-interval-view-controller");
        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _titleLabel = new UILabelViewController;
        _weekButton = new UIButtonViewController;
        _monthButton = new UIButtonViewController;

        // Init month selected
        monthSelected();

    }();

}

Utils.extend(UITimeIntervalViewController, UIViewController);