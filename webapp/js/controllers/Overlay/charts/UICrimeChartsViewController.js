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

    var _chicagoColor = "rgba(146,197,222,0.7)";
    var _selectedAreaColor = "rgba(178,24,43,0.7)";

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
        console.time("crime chart updated");
        draw();
        console.timeEnd("crime chart updated");
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

            //var colorHighlighted, _selectedAreaColor;
            //var colorDeselected;

            switch(macroCategory) {
                case CrimeCategory.VIOLENT:
                    //colorHighlighted = "rgba(103,169,207, 0.6)";//model.getVisualizationModel().layersColors["Violent Crimes"];
                    //colorDeselected = "rgba(103,169,207, 1.0)";//model.getVisualizationModel().violentCrimesDeselectedColor();

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
                    //colorHighlighted = "rgba(103,169,207, 0.6)";
                    //colorDeselected = "rgba(103,169,207, 1.0)";

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
                    //colorHighlighted = "rgba(103,169,207, 0.6)";
                    //colorDeselected = "rgba(103,169,207, 1.0)";

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
        /*
        var data = [];
        var min, max;

        var crimeCount = 0;

        // Chicago
        d3.values(CrimePrimaryType).forEach(function(primaryType) {
            var density = model.getCrimesModel().getChicagoCrimeDensityOfPrimaryType(primaryType);
            var macroCategory = model.getCrimesModel().getMacroCategory(primaryType);

            crimeCount = model.getCrimesModel().getNumberOfCrimesInChicago(primaryType);

            var colorHighlighted;
            var colorDeselected;
            switch(macroCategory) {
                case CrimeCategory.VIOLENT:
                    colorHighlighted = model.getVisualizationModel().layersColors["Violent Crimes"];
                    colorDeselected = model.getVisualizationModel().violentCrimesDeselectedColor();
                    break;
                case CrimeCategory.PROPERTY:
                    colorHighlighted = model.getVisualizationModel().layersColors["Property Crimes"];
                    colorDeselected = model.getVisualizationModel().propertyCrimesDeselectedColor();
                    break;
                case CrimeCategory.QUALITY_OF_LIFE:
                    colorHighlighted = model.getVisualizationModel().layersColors["Quality-of-life Crimes"];
                    colorDeselected = model.getVisualizationModel().qualityOfLifeCrimesDeselectedColor();
                    break;
            }
            model.getVisualizationModel().violentCrimesMarkerColor();

            data.push({
                colorHighlighted: colorHighlighted,
                colorDeselected: colorDeselected,
                value: density,
                count: crimeCount,
                label: primaryType
            });
        });

        min = d3.min(data, function(d) {return d.value});
        max = d3.max(data, function(d) {return d.value});
        _chicagoAsterPlotVC.setData(data);

        var chicagoTotal;

        // Update chicago count
        if(_chicagoAsterPlotVC.getSelectedItem() != null) {
            chicagoTotal = data[_chicagoAsterPlotVC.getSelectedItem()].count;
            _chicagoCrimesCountLabel.setText(chicagoTotal + " cases");
        } else {
            chicagoTotal = d3.sum(data, function(d) {return d.count});
            _chicagoCrimesCountLabel.setText(chicagoTotal + " cases");
        }


        // Selected area
        data = [];
        if(model.getAreaOfInterestModel().getAreaOfInterest() != null) {
            d3.values(CrimePrimaryType).forEach(function(primaryType) {
                var density = model.getCrimesModel().getCrimeDensityWithinAreaOfPrimaryType(primaryType);
                var macroCategory = model.getCrimesModel().getMacroCategory(primaryType);
                crimeCount = model.getCrimesModel().getNumberOfCrimesWithinArea(primaryType);

                var colorHighlighted;
                var colorDeselected;
                switch(macroCategory) {
                    case CrimeCategory.VIOLENT:
                        colorHighlighted = model.getVisualizationModel().layersColors["Violent Crimes"];
                        colorDeselected = model.getVisualizationModel().violentCrimesDeselectedColor();
                        break;
                    case CrimeCategory.PROPERTY:
                        colorHighlighted = model.getVisualizationModel().layersColors["Property Crimes"];
                        colorDeselected = model.getVisualizationModel().propertyCrimesDeselectedColor();
                        break;
                    case CrimeCategory.QUALITY_OF_LIFE:
                        colorHighlighted = model.getVisualizationModel().layersColors["Quality-of-life Crimes"];
                        colorDeselected = model.getVisualizationModel().qualityOfLifeCrimesDeselectedColor();
                        break;
                }
                model.getVisualizationModel().violentCrimesMarkerColor();

                data.push({
                    colorHighlighted: colorHighlighted,
                    colorDeselected: colorDeselected,
                    value: density,
                    count: crimeCount,
                    label: primaryType
                });

                // Update label count

            });


            _selectedAreaAsterPlotVC.setData(data);

            min = Math.min(d3.min(data, function(d) {return d.value}), min);
            max = Math.max(d3.max(data, function(d) {return d.value}), max);

            _selectedAreaAsterPlotVC.setMetricLabel("crimes/mile²");
            _selectedAreaAsterPlotVC.setRange(min, max);

            _selectedAreaAsterPlotVC.draw();

            // Update selected count
            var selectionCount;
            var percent;
            if(_selectedAreaAsterPlotVC.getSelectedItem() != null) {
                selectionCount = data[_selectedAreaAsterPlotVC.getSelectedItem()].count;
                percent = (((selectionCount / chicagoTotal) *100)).toFixed(2);
                _selectionCrimesCountLabel
                    .setText(
                        selectionCount
                        + " cases (" + percent  + "%)");
            } else {
                selectionCount = d3.sum(data, function(d) {return d.count});
                percent = (((selectionCount / chicagoTotal) *100)).toFixed(2);
                _selectionCrimesCountLabel
                    .setText(selectionCount
                        + " cases (" + percent  + "%)");
            }
        } else {
            _selectedAreaAsterPlotVC.getView().getSvg().html("");
            _selectionCrimesCountLabel.setText("");
        }

        // Chicago
        _chicagoAsterPlotVC.setMetricLabel("crimes/mile²");
        _chicagoAsterPlotVC.setRange(min, max);

        _chicagoAsterPlotVC.draw();*/
    };

    this.viewBoxDidChange = function() {
        var canvas = self.getView().getSvg();
        var box = self.getView().getViewBox();

        var y = 0;

        // Title label
        _titleLabel.getView().setFrame(40, y, box.width, 100);

        var uglyFix = 50;

        y += 0;
        var legendWidth = (box.width / 2);
        var legendOffset = (box.width / 2);
        //_qualityOfLifeLabel.getView().setFrame(legendOffset, y, legendWidth/3, 100);
        _chicagoLegendLabel.getView().setFrame(legendOffset - uglyFix, y, legendWidth/2, 100);
        _selectedAreaLegendLabel.getView().setFrame(legendOffset + (legendWidth/2) -uglyFix, y, legendWidth/2, 100);

        // Draw circles
        var r = 25;

        /*
        var dot = canvas.select(".quality");
        var color = model.getVisualizationModel().qualityOfLifeCrimesMarkerColor();
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("quality", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset)
            .attr("cy", y + r*2)
            .attr("r", r);*/

        var dot = canvas.select(".chicagoLegend");
        var color = _chicagoColor;
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("chicagoLegend", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset + r *8 - uglyFix)
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
            .attr("cx", legendOffset + (legendWidth/3)*2 - uglyFix)
            .attr("cy", y + r*2)
            .attr("r", r);




        y += 120;


        // Selection label
        //_selectionLabel.getView().setFrame(0, y, box.width/2, 70);

        // Chicago label
        //_chicagoLabel.getView().setFrame(box.width /2, y, box.width/2, 70);
        y += 70;

        // Selection count label
        _selectionCrimesCountLabel.getView().setFrame(0, y, box.width/2, 50);

        // Chicago count label
        _chicagoCrimesCountLabel.getView().setFrame(box.width /2, y, box.width/2, 50);
        y += 50;

        var plotSize = 550;
        // Selected plot
        _selectedAreaAsterPlotVC.getView().setFrame(0, y, box.width /2, 500);
        _selectedAreaAsterPlotVC.getView().setViewBox(0, 0, box.width /2, 500);

        // Chicago plot
        _chicagoAsterPlotVC.getView().setFrame(box.width /2, y, box.width /2, 500);
        _chicagoAsterPlotVC.getView().setViewBox(0, 0, box.width /2, 500);

        _stackedChart.getView().setFrame(0, y, box.width, 500);
        _stackedChart.getView().setViewBox(0, 0, box.width, 500);
    };

    /**
     * @protocol UIAsterPlotViewController
     */
    this.selectionChanged = function(index, data) {
        if(_selectedAreaAsterPlotVC.getSelectedItem() != index) {
            if(index == null) {
                _selectedAreaAsterPlotVC.deselectAll();
            } else {
                _selectedAreaAsterPlotVC.selectItem(index);
            }
        }
        if(_chicagoAsterPlotVC.getSelectedItem() != index) {
            if(index == null) {
                _chicagoAsterPlotVC.deselectAll();
            } else {
                _chicagoAsterPlotVC.selectItem(index);
            }
        }

        if(index == null) {
            _titleLabel.setText("All Crimes");
        } else {
            _titleLabel.setText(data.label);
        }

        draw();
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


        _stackedChart = new UIGroupedStackBarChart();
        self.add(_stackedChart);


        addBehavior();

        //notificationCenter.subscribe(self, self.dataChanged, Notifications.violentCrimes.DATA_CHANGED);
        //notificationCenter.subscribe(self, self.dataChanged, Notifications.propertyCrimes.DATA_CHANGED);
        //notificationCenter.subscribe(self, self.dataChanged, Notifications.qualityOfLifeCrimes.DATA_CHANGED);
        notificationCenter.subscribe(self, self.dataChanged, Notifications.crimes.DATA_CHANGED);
        notificationCenter.subscribe(self, self.dataChanged, Notifications.crimes.SELECTION_UPDATED);
    } ();
}

Utils.extend(UICrimeChartsViewController, UIViewController);
