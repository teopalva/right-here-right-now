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
        _weekButton.setTitle("LAST WEEK");
        _weekButton.setTitleSize(model.getThemeModel().mediumTextSize);
        _weekButton.onClick();
        self.add(_weekButton);

        // month button
        _monthButton.getView().setFrame(0, 67, 141.5, 32);
        _monthButton.getView().setViewBox(0, 0, 141.5, 32);
        _monthButton.setTitle("LAST MONTH");
        _monthButton.setTitleSize(model.getThemeModel().mediumTextSize);
        //_monthButton.onClick();
        self.add(_monthButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

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