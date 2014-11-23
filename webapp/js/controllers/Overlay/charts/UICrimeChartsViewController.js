/**
 * @class UICrimeChartsViewController
 * @description
 *
 * @constructor
 */
function UICrimeChartsViewController() {
    UIViewController.call(this);
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _titleLabel;
    var _selectionLabel;
    var _chicagoLabel;
    var _selectionCrimesCountLabel;
    var _chicagoCrimesCountLabel;
    var _selectedAreaAsterPlotVC;
    var _chicagoAsterPlotVC;

    var _stackedChart;

    // Legend
    var _qualityOfLifeLabel;
    var _chicagoLegendLabel;
    var _selectedAreaLegendLabel;

    var _chartTitle;

    // Locations
    var _topCrimeLabels = [];
    var _selectedAreaLabels = [];
    var _chicagoLabels = [];

    var _selectedAreaLocationsLabels = [];
    var _chicagoLocationsLabels = [];

    var _topNumber = 3;


    var _chicagoColor = "rgba(146,197,222,0.7)";
    var _selectedAreaColor = "rgba(203,24,29,0.7)";

    ///////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        if(model.getCrimesModel().isDataAvailable()) {
            draw();
        }

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
        var chicago;
        var selectedArea;

        chicago = [
            {
                label: "Violent",
                color: model.getVisualizationModel().violentCrimesMarkerColor(),
                group: []
            },
            {
                label: "Property",
                color: model.getVisualizationModel().propertyCrimesMarkerColor(),
                group: []
            },
            {
                label: "Quality Of Life",
                color: model.getVisualizationModel().qualityOfLifeCrimesMarkerColor(),
                group: []
            }
        ];

        selectedArea = [
            {
                label: "Violent",
                color: model.getVisualizationModel().violentCrimesMarkerColor(),
                group: []
            },
            {
                label: "Property",
                color: model.getVisualizationModel().propertyCrimesMarkerColor(),
                group: []
            },
            {
                label: "Quality Of Life",
                color: model.getVisualizationModel().qualityOfLifeCrimesMarkerColor(),
                group: []
            }
        ];

        d3.values(CrimePrimaryType).forEach(function(primaryType) {
            var macroCategory = model.getCrimesModel().getMacroCategory(primaryType);
            var density = model.getCrimesModel().getChicagoCrimeDensityOfPrimaryType(primaryType);
            var selectedAreaDensity = model.getCrimesModel().getCrimeDensityWithinAreaOfPrimaryType(primaryType);

            switch(macroCategory) {
                case CrimeCategory.VIOLENT:

                    selectedArea[0].group.push({
                        label: primaryType,
                        value: selectedAreaDensity,
                        color: _selectedAreaColor
                    });

                    chicago[0].group.push({
                        label: primaryType,
                        value: density,
                        color: _chicagoColor
                    });
                    break;
                case CrimeCategory.PROPERTY:

                    selectedArea[1].group.push({
                        label: primaryType,
                        value: selectedAreaDensity,
                        color: _selectedAreaColor
                    });

                    chicago[1].group.push({
                        label: primaryType,
                        value: density,
                        color: _chicagoColor
                    });
                    break;
                case CrimeCategory.QUALITY_OF_LIFE:

                    selectedArea[2].group.push({
                        label: primaryType,
                        value: selectedAreaDensity,
                        color: _selectedAreaColor
                    });

                    chicago[2].group.push({
                        label: primaryType,
                        value: density,
                        color: _chicagoColor
                    });
                    break;
            }
        });

        _stackedChart.emptyChart();
        _stackedChart.pushData(chicago);
        if(model.getAreaOfInterestModel().getAreaOfInterest() != null) {
            _stackedChart.pushData(selectedArea);
        }
        _stackedChart.setYLabel("crimes / mile²");
        _stackedChart.draw();

        // Update text
        if(model.getAreaOfInterestModel().getAreaOfInterest() != null) {
            var locations = [];
            locations.push(model.getCrimesModel().getTopLocationsInSelectedArea(_topNumber, CrimeCategory.VIOLENT));
            locations.push(model.getCrimesModel().getTopLocationsInSelectedArea(_topNumber, CrimeCategory.PROPERTY));
            locations.push(model.getCrimesModel().getTopLocationsInSelectedArea(_topNumber, CrimeCategory.QUALITY_OF_LIFE));

            for(var i = 0; i < _topNumber; i++) {
                for(var j = 0; j < 3; j++) {
                    var intPercent = parseInt(locations[j][i].percentage);
                    var percentage = intPercent < 10 ? (" " + intPercent) : intPercent;
                    _selectedAreaLocationsLabels[i][j]
                        .setText("" + percentage + "% | " + locations[j][i].location);
                }
            }
        }

        locations = [];
        locations.push(model.getCrimesModel().getTopLocationsInChicago(_topNumber, CrimeCategory.VIOLENT));
        locations.push(model.getCrimesModel().getTopLocationsInChicago(_topNumber, CrimeCategory.PROPERTY));
        locations.push(model.getCrimesModel().getTopLocationsInChicago(_topNumber, CrimeCategory.QUALITY_OF_LIFE));

        for(i = 0; i < _topNumber; i++) {
            for(j = 0; j < 3; j++) {
                intPercent = parseInt(locations[j][i].percentage);
                percentage = intPercent < 10 ? (" " + intPercent) : intPercent;
                _chicagoLocationsLabels[i][j]
                    .setText("" + percentage + "% | " + locations[j][i].location);
            }
        }
    };


    /**
     * @delegation
     */
    this.viewBoxDidChange = function() {
        var canvas = self.getView().getSvg();
        var box = self.getView().getViewBox();
        var legendAdjustment = 50;

        var y = 0;

        // Title label
        _titleLabel.getView().setFrame(40, y, box.width, 100);



        y += 0;
        var legendWidth = (box.width / 2);
        var legendOffset = (box.width / 2);
        _chicagoLegendLabel.getView().setFrame(legendOffset - legendAdjustment, y, legendWidth/2, 100);
        _selectedAreaLegendLabel.getView().setFrame(legendOffset + (legendWidth/2) -legendAdjustment, y, legendWidth/2, 100);

        // Draw circles
        var r = 25;


        var dot = canvas.select(".chicagoLegend");
        var color = _chicagoColor;
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("chicagoLegend", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset + r *8 - legendAdjustment)
            .attr("cy", y + r*2)
            .attr("r", r);

        dot = canvas.select(".selectedAreaLegend");
        color = _selectedAreaColor;
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("selectedAreaLegend", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset + (legendWidth/3)*2 - legendAdjustment)
            .attr("cy", y + r*2)
            .attr("r", r);

        y += 100;

        _chartTitle.getView().setFrame(0, y, box.width, 70);
        _chartTitle.getView().setViewBox(0, 0, box.width, 70);

        y += 40;

        var chartHeight = 400;
        _stackedChart.getView().setFrame(0, y, box.width, chartHeight);
        _stackedChart.getView().setViewBox(0, 0, box.width, chartHeight);

        y += chartHeight + 50;

        var columnWidth = box.width /3;
        for(var i = 0; i < 3; i++) {
            _topCrimeLabels[i].getView().setFrame(i * columnWidth, y, columnWidth, 50);
            _topCrimeLabels[i].getView().setViewBox(0, 0, columnWidth, 50);
        }

        var padding = {
            left: 20,
            right: 20
        };
        y+= 50;
        for(i = 0; i < 3; i++) {
            _selectedAreaLabels[i].getView().setFrame(
                (i * columnWidth + padding.left),
                y,
                (columnWidth /2) - padding.left,
                50);
            _selectedAreaLabels[i].getView().setViewBox(0, 0, columnWidth /2 - padding.left, 50);
        }

        for(i = 0; i < 3; i++) {
            _chicagoLabels[i].getView().setFrame(
                (i * columnWidth + (columnWidth /2)),
                y,
                (columnWidth /2 - padding.right),
                50);
            _chicagoLabels[i].getView().setViewBox(0, 0, columnWidth /2 - padding.right, 50);
        }

        y+= 50;
        var tmpY = y;
        for(i = 0; i < _topNumber; i++) {
            for(var j = 0; j < 3; j++) {
                _selectedAreaLocationsLabels[i][j].getView().setFrame(
                    (j * columnWidth + padding.left),
                    tmpY,
                        (columnWidth /2) - padding.left,
                    50
                );
            }
            tmpY += 35;
        }

        tmpY = y;
        for(i = 0; i < _topNumber; i++) {
            for(j = 0; j < 3; j++) {
                _chicagoLocationsLabels[i][j].getView().setFrame(
                    (j * columnWidth + (columnWidth /2) + 30),
                    tmpY,
                        (columnWidth /2) - padding.right,
                    50
                );
            }
            tmpY += 35;
        }
    };


    //////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        self.getView().addClass("ui-crime-charts-view-controller");

        self.getView().setDelegate(self);

        // Add UI

        // Title
        _titleLabel = new UILabelViewController();
        _titleLabel.setText("All Crimes");
        _titleLabel.setTextSize(model.getThemeModel().largeTextSize());
        _titleLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        _titleLabel.setTextAlignment(TextAlignment.LEFT);
        self.add(_titleLabel);

        // Selection label
        _selectionLabel = new UILabelViewController();
        _selectionLabel.setText("Selection");
        _selectionLabel.setTextSize(model.getThemeModel().largeTextSize());
        _selectionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_selectionLabel);

        // Chicago label
        _chicagoLabel = new UILabelViewController();
        _chicagoLabel.setText("Chicago");
        _chicagoLabel.setTextSize(model.getThemeModel().largeTextSize());
        _chicagoLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_chicagoLabel);

        // Selection count label
        _selectionCrimesCountLabel = new UILabelViewController();
        _selectionCrimesCountLabel.setText("");
        _selectionCrimesCountLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _selectionCrimesCountLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        self.add(_selectionCrimesCountLabel);

        // Selection count label
        _chicagoCrimesCountLabel = new UILabelViewController();
        _chicagoCrimesCountLabel.setText("");
        _chicagoCrimesCountLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _chicagoCrimesCountLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        self.add(_chicagoCrimesCountLabel);

        // Selected plot
        _selectedAreaAsterPlotVC = new UIAsterPlotViewController();
        _selectedAreaAsterPlotVC.setDelegate(self);
        self.add(_selectedAreaAsterPlotVC);

        // Chicago plot
        _chicagoAsterPlotVC = new UIAsterPlotViewController();
        _chicagoAsterPlotVC.setDelegate(self);
        self.add(_chicagoAsterPlotVC);

        // Legend
        _qualityOfLifeLabel = new UILabelViewController();
        _qualityOfLifeLabel.setText("Quality of life");
        _qualityOfLifeLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _qualityOfLifeLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        _qualityOfLifeLabel.setTextAlignment(TextAlignment.RIGHT);
        self.add(_qualityOfLifeLabel);

        _chicagoLegendLabel = new UILabelViewController();
        _chicagoLegendLabel.setText("Chicago");
        _chicagoLegendLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _chicagoLegendLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        _chicagoLegendLabel.setTextAlignment(TextAlignment.RIGHT);
        self.add(_chicagoLegendLabel);

        _selectedAreaLegendLabel = new UILabelViewController();
        _selectedAreaLegendLabel.setText("Selected Area");
        _selectedAreaLegendLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _selectedAreaLegendLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        _selectedAreaLegendLabel.setTextAlignment(TextAlignment.RIGHT);
        self.add(_selectedAreaLegendLabel);

        // Chart title
        _chartTitle = new UILabelViewController();
        _chartTitle.setText("Crime Density Comparison");
        _chartTitle.setTextSize(model.getThemeModel().biggerTextSize());
        _chartTitle.setTextAlignment(TextAlignment.MIDDLE);
        _chartTitle.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_chartTitle);


        _stackedChart = new UIGroupedStackBarChart();
        self.add(_stackedChart);

        for(var i = 0; i < 3; i++) {
            _topCrimeLabels[i] = new UILabelViewController();
            _topCrimeLabels[i].setTextSize(model.getThemeModel().moreThanBigTextSize());
            _topCrimeLabels[i].setTextColor(model.getThemeModel().defaultToolTextColor());
            _topCrimeLabels[i].setTextAlignment(TextAlignment.MIDDLE);
            self.add(_topCrimeLabels[i]);
        }
        _topCrimeLabels[0].setText("Top " + _topNumber + " violent crime locations");
        _topCrimeLabels[1].setText("Top " + _topNumber + " property crime locations");
        _topCrimeLabels[2].setText("Top " + _topNumber + " quality-of-life crime locations");

        for(i = 0; i < 3; i++) {
            _selectedAreaLabels[i] = new UILabelViewController();
            _selectedAreaLabels[i].setTextSize(model.getThemeModel().moreThanBigTextSize());
            _selectedAreaLabels[i].setTextColor(_selectedAreaColor);
            _selectedAreaLabels[i].setTextAlignment(TextAlignment.MIDDLE);
            self.add(_selectedAreaLabels[i]);
        }
        _selectedAreaLabels[0].setText("Selected Area");
        _selectedAreaLabels[1].setText("Selected Area");
        _selectedAreaLabels[2].setText("Selected Area");

        for(i = 0; i < 3; i++) {
            _chicagoLabels[i] = new UILabelViewController();
            _chicagoLabels[i].setTextSize(model.getThemeModel().moreThanBigTextSize());
            _chicagoLabels[i].setTextColor(_chicagoColor);
            _chicagoLabels[i].setTextAlignment(TextAlignment.MIDDLE);
            self.add(_chicagoLabels[i]);
        }
        _chicagoLabels[0].setText("Chicago");
        _chicagoLabels[1].setText("Chicago");
        _chicagoLabels[2].setText("Chicago");

        for(i = 0; i < _topNumber; i++) {
            _selectedAreaLocationsLabels[i] = [];
            for(var j = 0; j < 3; j++) {
                _selectedAreaLocationsLabels[i][j] = new UILabelViewController();
                _selectedAreaLocationsLabels[i][j].setTextSize(model.getThemeModel().bigTextSize());
                _selectedAreaLocationsLabels[i][j].setTextColor(model.getThemeModel().defaultToolTextColor());
                _selectedAreaLocationsLabels[i][j].setTextAlignment(TextAlignment.LEFT);
                _selectedAreaLocationsLabels[i][j].setText("");
                self.add(_selectedAreaLocationsLabels[i][j]);
            }
        }

        for(i = 0; i < _topNumber; i++) {
            _chicagoLocationsLabels[i] = [];
            for(j = 0; j < 3; j++) {
                _chicagoLocationsLabels[i][j] = new UILabelViewController();
                _chicagoLocationsLabels[i][j].setTextSize(model.getThemeModel().bigTextSize());
                _chicagoLocationsLabels[i][j].setTextColor(model.getThemeModel().defaultToolTextColor());
                _chicagoLocationsLabels[i][j].setTextAlignment(TextAlignment.LEFT);
                _chicagoLocationsLabels[i][j].setText("");
                self.add(_chicagoLocationsLabels[i][j]);
            }
        }


        addBehavior();

        notificationCenter.subscribe(self, self.dataChanged, Notifications.crimes.DATA_CHANGED);
        notificationCenter.subscribe(self, self.dataChanged, Notifications.crimes.SELECTION_UPDATED);
    } ();
}

Utils.extend(UICrimeChartsViewController, UIViewController);
