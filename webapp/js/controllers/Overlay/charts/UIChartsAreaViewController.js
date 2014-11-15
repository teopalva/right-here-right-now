/**
 * @class UIChartsAreaViewController
 * @description
 *
 * @constructor
 */
function UIChartsAreaViewController() {
    UIViewController.call(this);
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    ///////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {


        // Call super
        super_viewDidAppear.call(self);
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function() {
        self.getView().addClass("ui-charts-area-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
    } ();
}

Utils.extend(UIChartsAreaViewController, UIViewController);