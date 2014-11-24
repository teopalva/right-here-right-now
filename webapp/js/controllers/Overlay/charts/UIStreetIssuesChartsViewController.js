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

    // Reported case label
    var _reportedPotholesLabel;
    var _reportedVehiclesLabel;
    var _reportedStreetLightsLabel;

    // matrix plot
    var _potholesMatrixPlot;
    var _vehiclesMatrixPlot;
    var _lightsMatrixPlot;
    var _matrixDimension = 20;

    ///////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        if(model.getPotholesModel().isDataAvailable()) {
            drawPotholes();
        }

        if(model.getVehiclesModel().isDataAvailable()) {
            drawAbandonedVehicles();
        }

        if(model.getLightsModel().isDataAvailable()) {
            drawStreetLightsOut();
        }

        // Call super
        super_viewDidAppear.call(self);
    };

    /**
     *
     */
    this.potholesChanged = function() {
        if(model.getPotholesModel().isDataAvailable()) {
            drawPotholes();
        }
    };

    /**
     *
     */
    this.vehiclesChanged = function() {
        if(model.getVehiclesModel().isDataAvailable()) {
            drawAbandonedVehicles();
        }
    };

    /**
     *
     */
    this.streetLightsOutChanged = function() {
        if(model.getLightsModel().isDataAvailable()) {
            drawStreetLightsOut();
        }
    };

    /**
     *
     */
    this.viewBoxDidChange = function() {
        var box = self.getView().getViewBox();

        var y = 0;

        // Title label
        _titleLabel.getView().setFrame(40, y, box.width, 100);
        y += 100;

        // Potholes label
        _potholesLabel.getView().setFrame(0, y, box.width/3, 70);

        // Abandoned vehicles label
        _abandonedVehiclesLabel.getView().setFrame((box.width/3), y, box.width/3, 70);

        // Street lights out label
        _streetLightsLabel.getView().setFrame((box.width/3) *2, y, box.width/3, 70);

        y += 70;

        // Charts
        var chartHeight = 400;
        _potholesColumnChart.getView().setFrame(0, y, box.width/3, chartHeight);

        _abandonedVehiclesColumnChart.getView().setFrame((box.width/3), y, box.width/3, chartHeight);

        _streetLightsColumnChart.getView().setFrame((box.width/3) *2, y, box.width/3, chartHeight);

        y += 310;

        // Reported label
        _reportedPotholesLabel.getView().setFrame(0, y, box.width/3, 70);
        _reportedVehiclesLabel.getView().setFrame((box.width/3), y, box.width/3, 70);
        _reportedStreetLightsLabel.getView().setFrame((box.width/3) *2, y, box.width/3, 70);

        y += 70;

        // Matrix plot
        var matrixSize = 270;
        var portion = box.width / 3;
        _potholesMatrixPlot.getView().setFrame((portion / 2) - matrixSize/2, y, matrixSize, matrixSize);
        _vehiclesMatrixPlot.getView().setFrame((portion + portion / 2) - matrixSize/2, y, matrixSize, matrixSize);
        _lightsMatrixPlot.getView().setFrame((portion * 2 + portion / 2) - matrixSize/2, y, matrixSize, matrixSize);
    };




    //////////////////////////// PRIVATE METHODS ////////////////////////////
    var addBehavior = function() {

    };

    var drawPotholes = function() {
        var chicagoPotholesDensity = model.getPotholesModel().getPotholesDensityInChicago();
        var areaPotholesDensity =
            model.getAreaOfInterestModel().getAreaOfInterest() != null ?
                model.getPotholesModel().getPotholesDensityWithinArea() : 0;
        var totalReportedCases = model.getPotholesModel().getPotholes().length;
        var areaReportedCases = model.getPotholesModel().getPotholesWithinArea().length;


        var potholesColor = model.getVisualizationModel().potholesColor();
        _potholesColumnChart.setData(
            ["Chicago", "Selection"],
            [chicagoPotholesDensity, areaPotholesDensity],
            "",
            "reported/mile²",
            [potholesColor, potholesColor]
        );

        _reportedPotholesLabel
            .setText(areaReportedCases + " / " + totalReportedCases + " reported" +
                " (" + ((areaReportedCases/totalReportedCases) * 100).toFixed(1) + "%)");

        // Draw matrix plot
        var matrix = [];
        var totalPlaces = Math.pow(_matrixDimension, 2);
        var withinArea = Math.round((areaReportedCases / totalReportedCases) * totalPlaces);
        var totalPotholesColor = model.getVisualizationModel().potholesColor(0.5);

        var i;
        for(i = 0; i < withinArea; i++) {
            matrix.push(potholesColor);
        }
        for(; i < totalPlaces; i++) {
            matrix.push(totalPotholesColor);
        }
        _potholesMatrixPlot.setColorMatrix(matrix);
    };

    var drawAbandonedVehicles = function() {
        var chicagoDensity = model.getVehiclesModel().getVehiclesDensityInChicago();
        var areaDensity =
                model.getAreaOfInterestModel().getAreaOfInterest() != null ?
                    model.getVehiclesModel().getVehiclesDensityWithinArea() : 0;
        var totalReportedCases = model.getVehiclesModel().getVehicles().length;
        var areaReportedCases = model.getVehiclesModel().getVehiclesWithinArea().length;

        var vehiclesColor = model.getVisualizationModel().abandonedVehiclesMarkerColor();
        _abandonedVehiclesColumnChart.setData(
            ["Chicago", "Selection"],
            [chicagoDensity, areaDensity],
            "",
            "reported/mile²",
            [vehiclesColor, vehiclesColor]
        );

        _reportedVehiclesLabel
            .setText(areaReportedCases + " / " + totalReportedCases + " reported" +
                " (" + ((areaReportedCases/totalReportedCases) * 100).toFixed(1) + "%)");

        // Draw matrix plot
        var matrix = [];
        var totalPlaces = Math.pow(_matrixDimension, 2);
        var withinArea = Math.round((areaReportedCases / totalReportedCases) * totalPlaces);
        var totalColor = model.getVisualizationModel().abandonedVehiclesColor(0.5);

        var i;
        for(i = 0; i < withinArea; i++) {
            matrix.push(vehiclesColor);
        }
        for(; i < totalPlaces; i++) {
            matrix.push(totalColor);
        }
        _vehiclesMatrixPlot.setColorMatrix(matrix);
    };

    var drawStreetLightsOut = function() {
        var chicagoDensity = model.getLightsModel().getLightsDensityInChicago();
        var areaDensity =
                model.getAreaOfInterestModel().getAreaOfInterest() != null ?
                    model.getLightsModel().getLightsDensityWithinArea() : 0;
        var totalReportedCases = model.getLightsModel().getLights().length;
        var areaReportedCases = model.getLightsModel().getLightsWithinArea().length;

        var color = model.getVisualizationModel().streetLightsMarkerColor();
        _streetLightsColumnChart.setData(
            ["Chicago", "Selection"],
            [chicagoDensity, areaDensity],
            "",
            "reported/mile²",
            [color, color]
        );

        _reportedStreetLightsLabel
            .setText(areaReportedCases + " / " + totalReportedCases + " reported" +
                " (" + ((areaReportedCases/totalReportedCases) * 100).toFixed(1) + "%)");

        // Draw matrix plot
        var matrix = [];
        var totalPlaces = Math.pow(_matrixDimension, 2);
        var withinArea = Math.round((areaReportedCases / totalReportedCases) * totalPlaces);
        var totalColor = model.getVisualizationModel().streetLightsColor(0.5);

        var i;
        for(i = 0; i < withinArea; i++) {
            matrix.push(color);
        }
        for(; i < totalPlaces; i++) {
            matrix.push(totalColor);
        }
        _lightsMatrixPlot.setColorMatrix(matrix);
    };

    var init = function() {
        self.getView().addClass("ui-street-issues-charts-view-controller");

        self.getView().setDelegate(self);

        // Title
        _titleLabel = new UILabelViewController();
        _titleLabel.setText("Street Issues");
        _titleLabel.setTextSize(model.getThemeModel().largeTextSize());
        _titleLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        _titleLabel.setTextAlignment(TextAlignment.LEFT);
        self.add(_titleLabel);

        // Potholes
        _potholesLabel = new UILabelViewController();
        _potholesLabel.setText("Potholes");
        _potholesLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _potholesLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_potholesLabel);

        // Abandoned vehicles
        _abandonedVehiclesLabel = new UILabelViewController();
        _abandonedVehiclesLabel.setText("Abandoned Vehicles");
        _abandonedVehiclesLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _abandonedVehiclesLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_abandonedVehiclesLabel);

        // Street lights out
        _streetLightsLabel = new UILabelViewController();
        _streetLightsLabel.setText("Street Lights Out");
        _streetLightsLabel.setTextSize(model.getThemeModel().biggerTextSize());
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

        // Reported labels
        _reportedPotholesLabel = new UILabelViewController();
        _reportedPotholesLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _reportedPotholesLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        self.add(_reportedPotholesLabel);

        _reportedVehiclesLabel = new UILabelViewController();
        _reportedVehiclesLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _reportedVehiclesLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        self.add(_reportedVehiclesLabel);

        _reportedStreetLightsLabel = new UILabelViewController();
        _reportedStreetLightsLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _reportedStreetLightsLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        self.add(_reportedStreetLightsLabel);

        // Matrix plot
        _potholesMatrixPlot = new UIMatrixPlotViewController();
        _potholesMatrixPlot.setDimension(_matrixDimension);
        self.add(_potholesMatrixPlot);

        _vehiclesMatrixPlot = new UIMatrixPlotViewController();
        _vehiclesMatrixPlot.setDimension(_matrixDimension);
        self.add(_vehiclesMatrixPlot);

        _lightsMatrixPlot = new UIMatrixPlotViewController();
        _lightsMatrixPlot.setDimension(_matrixDimension);
        self.add(_lightsMatrixPlot);

        addBehavior();

        notificationCenter.subscribe(self, self.potholesChanged, Notifications.potholes.SELECTION_UPDATED);
        //notificationCenter.subscribe(self, self.potholesChanged, Notifications.potholes.DATA_CHANGED);
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.vehicles.SELECTION_UPDATED);
        //notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.vehicles.DATA_CHANGED);
        notificationCenter.subscribe(self, self.streetLightsOutChanged, Notifications.lights.SELECTION_UPDATED);
        //notificationCenter.subscribe(self, self.streetLightsOutChanged, Notifications.lights.DATA_CHANGED);
    } ();
}

Utils.extend(UIStreetIssuesChartsViewController, UIViewController);
