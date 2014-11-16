/**
 * @class UIStreetIssuesChartsViewController
 * @description
 *
 * @constructor
 */
function UIStreetIssuesChartsViewController() {
    UIViewController.call(this);
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _titleLabel;
    var _potholesLabel;
    var _abandonedVehiclesLabel;
    var _streetLightsLabel;


    // Charts
    var _potholesColumnChart;
    var _abandonedVehiclesColumnChart;
    var _streetLightsColumnChart;


    ///////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        /*
        if(model.getCrimesModel().isDataAvailable()) {
            draw();
        }*/
        _potholesColumnChart.setData(
            ["Chicago", "Selection"],
            [30, 20],
            "",
            "number/miles",
            ["#fff", "#fff"]
        );

        // Call super
        super_viewDidAppear.call(self);
    };

    /**
     *  Handler method for notifications update on crimes
     */
    this.dataChanged = function() {
        draw();
    };


    ///////////////////////// PRIVATE METHODS /////////////////////////
    var addBehavior = function() {

    };

    var draw = function() {

    };

    this.viewBoxDidChange = function() {
        var box = self.getView().getViewBox();

        var y = 0;

        // Title label
        _titleLabel.getView().setFrame(0, y, box.width, 100);
        y += 100;

        // Potholes label
        _potholesLabel.getView().setFrame(0, y, box.width/3, 70);

        // Abandoned vehicles label
        _abandonedVehiclesLabel.getView().setFrame((box.width/3), y, box.width/3, 70);

        // Street lights out label
        _streetLightsLabel.getView().setFrame((box.width/3) *2, y, box.width/3, 70);

        y += 70;

        _potholesColumnChart.getView().setFrame(0, y, box.width/3, 300);
    };




    //////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        self.getView().addClass("ui-street-issues-charts-view-controller");

        self.getView().setDelegate(self);

        // Title
        _titleLabel = new UILabelViewController();
        _titleLabel.setText("Street Issues");
        _titleLabel.setTextSize(model.getThemeModel().hugeTextSize());
        _titleLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_titleLabel);

        // Potholes
        _potholesLabel = new UILabelViewController();
        _potholesLabel.setText("Potholes");
        _potholesLabel.setTextSize(model.getThemeModel().largeTextSize());
        _potholesLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_potholesLabel);

        // Abandoned vehicles
        _abandonedVehiclesLabel = new UILabelViewController();
        _abandonedVehiclesLabel.setText("Abandoned Vehicles");
        _abandonedVehiclesLabel.setTextSize(model.getThemeModel().largeTextSize());
        _abandonedVehiclesLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_abandonedVehiclesLabel);

        // Street lights out
        _streetLightsLabel = new UILabelViewController();
        _streetLightsLabel.setText("Street Lights Out");
        _streetLightsLabel.setTextSize(model.getThemeModel().largeTextSize());
        _streetLightsLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_streetLightsLabel);

        // Charts
        _potholesColumnChart = new UIColumnChartViewController();
        _potholesColumnChart.setAxisColor("rgba(246, 246, 246, 1)");
        _potholesColumnChart.setAxisWidth(3);
        self.add(_potholesColumnChart);

        _abandonedVehiclesColumnChart = new UIColumnChartViewController();
        _abandonedVehiclesColumnChart.setAxisColor("rgba(246, 246, 246, 1)");
        _abandonedVehiclesColumnChart.setAxisWidth(3);
        self.add(_abandonedVehiclesColumnChart);

        _streetLightsColumnChart = new UIColumnChartViewController();
        _streetLightsColumnChart.setAxisColor("rgba(246, 246, 246, 1)");
        _streetLightsColumnChart.setAxisWidth(3);
        self.add(_streetLightsColumnChart);


        addBehavior();

        notificationCenter.subscribe(self, self.dataChanged, Notifications.areaOfInterest.PATH_UPDATED);
    } ();
}

Utils.extend(UIStreetIssuesChartsViewController, UIViewController);
