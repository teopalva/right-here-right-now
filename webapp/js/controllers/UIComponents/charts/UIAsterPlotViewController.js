/**
 * @class UIAsterPlotViewController
 * @description
 *
 * @data [{
 *  colorHighlighted
 *  colorDeselected
 *  value
 *  label
 *  metricDescriptor
 * }]
 *
 * @protocol
 * - itemSelected
 * - itemDeselected
 * @constructor
 */
function UIAsterPlotViewController() {
    UIViewController.call(this);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    // Holds data in d3 format
    var _data;

    var _range = {
        min: 0,
        max: 0
    };

    var _selectedIndex = null;

    var _metricLabel;

    var _delegate = null;

    // UI

    /////////////////////// PUBLIC ATTRIBUTES ///////////////////////
    this.setDelegate = function(delegate) {
        _delegate = delegate;
    };

    /**
     * @param data [
     *  {
     *      colorHighlighted,
     *      colorDeselected,
     *      value,
     *      label,
     *      metricLabel
     *  }
     * ]
     */
    this.setData = function(data) {
        _data = data;
    };

    this.selectItem = function(index) {
        _selectedIndex = index;
        draw();

        if(_delegate != null && typeof _delegate.selectionChanged == "function") {
            _delegate.selectionChanged(_selectedIndex, _data[index]);
        }
    };

    this.deselectAll = function() {
        _selectedIndex = null;
        draw();

        if(_delegate != null && typeof _delegate.selectionChanged == "function") {
            _delegate.selectionChanged(_selectedIndex, null);
        }
    };

    this.getSelectedItem = function() {
        return _selectedIndex;
    };

    this.getItemLabel = function(index) {
        return _data[index].label;
    };

    this.setRange = function(min, max) {
        _range.min = min;
        _range.max = max;
    };

    this.getRange = function() {
        return _range;
    };

    this.setMetricLabel = function(text) {
        _metricLabel = text;
    };


    /**
     * Draw the plot
     */
    this.draw = function() {
        draw();
    };

    /**
     * @protocol UIView
     */
    this.viewBoxDidChange = function() {

    };

    /////////////////////// PRIVATE METHODS ///////////////////////
    var draw = function() {
        var box = self.getView().getViewBox();
        var canvas = self.getView().getSvg();

        var size = {
            width: box.width,
            height: box.height
        };

        var maxRadius = Math.min(size.width, size.height) /2;
        var minRadius = maxRadius * 0.4;

        var valueScale = d3.scale.linear();
        valueScale
            .domain([_range.min, _range.max])
            .range([minRadius, maxRadius]);

        var arcFunction = d3.svg.arc()
            .innerRadius(minRadius)
            .outerRadius(function (d) {
                return valueScale(d.data.value);
            });

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return 1; });

        // Draw
        var centerGroup = canvas.select(".centerGroup");
        if(centerGroup.empty()) {
            centerGroup = canvas
                .append("g")
                .classed("centerGroup", true)
                .attr("transform", "translate(" + size.width / 2 + "," + size.height / 2 + ")");
        }

        var path = centerGroup.selectAll(".solidArc")
            .data(pie(_data))
            .attr("fill", function(d, i) {
                if(_selectedIndex != null && i != _selectedIndex) {
                    return d.data["colorDeselected"];
                }
                return d.data["colorHighlighted"];
            })
            .attr("d", arcFunction)
            .enter().append("path")
            .attr("fill", function(d, i) {
                if(_selectedIndex != null && i != _selectedIndex) {
                    return d.data["colorDeselected"];
                }
                return d.data["colorHighlighted"];
            })
            .attr("stroke-width", "2")
            .attr("stroke", "rgba(41,36,33,1)")
            .classed("solidArc", true)
            .attr("d", arcFunction)
            .style("pointer-events", "visiblePainted")
            .style("cursor", "pointer")
            .on("click", function(d, i) {
                if(_selectedIndex != null) {
                    self.deselectAll();
                } else {
                    self.selectItem(i);
                }

            });
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide);
        var infoBox = centerGroup.select(".infoBox");
        if(infoBox.empty()) {
            infoBox = centerGroup
                .append("circle")
                .classed("infoBox", true)
                .style("fill", "rgba(246,246,246,1)")
                .style("stroke", "rgba(41,36,33,1)")
                .attr("r", minRadius);
        }

        // Value label
        var valueLabelText = centerGroup.select(".valueLabel");
        if(valueLabelText.empty()) {
            valueLabelText = centerGroup
                .append("text")
                .classed("valueLabel", true)
                .style("fill", "rgba(46,36,33,1)")
                .attr("dy", "0.0em")
                .attr("text-anchor", "middle")
                .style("font-size", "60px");
        }

        if(_selectedIndex != null) {
            valueLabelText.text(parseInt(_data[_selectedIndex].value));
        } else {
            var total = d3.sum(_data, function(d) {return d.value});
            valueLabelText.text(parseInt(total));
        }

        // Metric label
        var metricLabelText = centerGroup.select(".metricLabel");
        if(metricLabelText.empty()) {
            metricLabelText = centerGroup
                .append("text")
                .classed("metricLabel", true)
                .style("fill", "rgba(46,36,33,1)")
                .attr("dy", "1.0em")
                .attr("text-anchor", "middle")
                .style("font-size", "30px");
        }
        metricLabelText.text(_metricLabel);
    };

    // Init
    var init = function() {
        self.getView().addClass("ui-aster-plot-view-controller");

        self.getView().setDelegate(self);
    } ();
}

Utils.extend(UIAsterPlotViewController, UIViewController);