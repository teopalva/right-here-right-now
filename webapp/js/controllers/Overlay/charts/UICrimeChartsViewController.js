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

    // Legend
    var _qualityOfLifeLabel;
    var _propertyLabel;
    var _violentLabel;

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

        // Update chicago count
        if(_chicagoAsterPlotVC.getSelectedItem() != null) {
            _chicagoCrimesCountLabel.setText(data[_chicagoAsterPlotVC.getSelectedItem()].count);
        } else {
            _chicagoCrimesCountLabel.setText(d3.sum(data, function(d) {return d.count}));
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
            if(_selectedAreaAsterPlotVC.getSelectedItem() != null) {
                _selectionCrimesCountLabel.setText(data[_selectedAreaAsterPlotVC.getSelectedItem()].count);
            } else {
                _selectionCrimesCountLabel.setText(d3.sum(data, function(d) {return d.count}));
            }
        } else {
            _selectedAreaAsterPlotVC.getView().getSvg().html("");
            _selectionCrimesCountLabel.setText("");
        }

        // Chicago
        _chicagoAsterPlotVC.setMetricLabel("crimes/mile²");
        _chicagoAsterPlotVC.setRange(min, max);

        _chicagoAsterPlotVC.draw();
    };

    this.viewBoxDidChange = function() {
        var canvas = self.getView().getSvg();
        var box = self.getView().getViewBox();

        var y = 0;

        // Title label
        _titleLabel.getView().setFrame(0, y, box.width, 100);

        y += 10;
        var legendWidth = (box.width / 2);
        var legendOffset = (box.width / 2);
        _qualityOfLifeLabel.getView().setFrame(legendOffset, y, legendWidth/3, 100);
        _propertyLabel.getView().setFrame(legendOffset + legendWidth/3, y, legendWidth/3, 100);
        _violentLabel.getView().setFrame(legendOffset + (legendWidth/3) *1.9, y, legendWidth/3, 100);

        // Draw circles
        var r = 25;

        var dot = canvas.select(".quality");
        var color = model.getVisualizationModel().qualityOfLifeCrimesMarkerColor();
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("quality", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset + r)
            .attr("cy", y + r*2)
            .attr("r", r);

        dot = canvas.select(".property");
        color = model.getVisualizationModel().propertyCrimesMarkerColor();
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("property", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset + legendWidth/3 + r *3)
            .attr("cy", y + r*2)
            .attr("r", r);

        dot = canvas.select(".violent");
        color = model.getVisualizationModel().violentCrimesMarkerColor();
        if(dot.empty()) {
            dot = canvas
                .append("circle")
                .classed("violent", true)
                .style("fill", color);
        }
        dot
            .attr("cx", legendOffset + (legendWidth/3)*2 + r *3)
            .attr("cy", y + r*2)
            .attr("r", r);




        y += 120;


        // Selection label
        _selectionLabel.getView().setFrame(0, y, box.width/2, 70);

        // Chicago label
        _chicagoLabel.getView().setFrame(box.width /2, y, box.width/2, 70);
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
        _titleLabel.setTextSize(model.getThemeModel().hugeTextSize());
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
        _selectionCrimesCountLabel.setTextSize(model.getThemeModel().largeTextSize());
        _selectionCrimesCountLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        self.add(_selectionCrimesCountLabel);

        // Selection count label
        _chicagoCrimesCountLabel = new UILabelViewController();
        _chicagoCrimesCountLabel.setText("");
        _chicagoCrimesCountLabel.setTextSize(model.getThemeModel().largeTextSize());
        _chicagoCrimesCountLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
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

        _propertyLabel = new UILabelViewController();
        _propertyLabel.setText("Property");
        _propertyLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _propertyLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        _propertyLabel.setTextAlignment(TextAlignment.RIGHT);
        self.add(_propertyLabel);

        _violentLabel = new UILabelViewController();
        _violentLabel.setText("Violent");
        _violentLabel.setTextSize(model.getThemeModel().biggerTextSize());
        _violentLabel.setTextColor(model.getThemeModel().secondaryTextColor());
        _violentLabel.setTextAlignment(TextAlignment.RIGHT);
        self.add(_violentLabel);


        addBehavior();

        notificationCenter.subscribe(self, self.dataChanged, Notifications.violentCrimes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.dataChanged, Notifications.propertyCrimes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.dataChanged, Notifications.qualityOfLifeCrimes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.dataChanged, Notifications.areaOfInterest.PATH_UPDATED);
    } ();
}

Utils.extend(UICrimeChartsViewController, UIViewController);