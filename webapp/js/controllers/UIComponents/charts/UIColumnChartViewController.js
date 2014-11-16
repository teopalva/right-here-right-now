/**
 * @class UIColumnChartViewController
 * @description
 *
 * @constructor
 */
function UIColumnChartViewController() {
    UIViewController.call(this);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _xValues;
    var _xAxisLabel;
    var _yValues;
    var _yAxisLabel;
    var _columnColors;

    var _axisColor = "#fff";
    var _axisWidth = 1;

    var _title;

    // Holds data in d3 format
    var _data;

    // UI
    var _chartMargin = {top: 60, right: 100, bottom: 40, left: 100};
    var _defaultViewBox = {x: 0, y: 0, width: 600, height: 300};

    /////////////////////// PUBLIC ATTRIBUTES ///////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {

        // Super call
        super_updateView.call(self);
    };

    /**
     *
     * @param xValues
     * @param yValues
     * @param xAxisLabel
     * @param yAxisLabel
     * @param colors
     */
    this.setData = function(xValues, yValues, xAxisLabel, yAxisLabel, colors) {
        _xValues = xValues;
        _yValues = yValues;
        _xAxisLabel = xAxisLabel;
        _yAxisLabel = yAxisLabel;
        _columnColors = colors;

        _data = [];
        _xValues.forEach(function(xValue, index) {
            _data.push({
                label: _xValues[index],
                value: _yValues[index]
            });
        });
        updateChart();
    };

    this.setAxisColor = function(color) {
        _axisColor = color;
        var axis = self.getView().getSvg().selectAll(".x.axis .domain , .y.axis .domain");
        axis.style("stroke", color);
    };

    this.setAxisWidth = function(width) {
        _axisWidth = width;
        var axis = self.getView().getSvg().selectAll(".x.axis .domain , .y.axis .domain");
        axis.style("stroke-width", width);
    };

    /**
     * Set the chart's title
     * @param title
     */
    this.setTitle = function(title) {
        _title = title;
    };

    /////////////////////// PRIVATE METHODS ///////////////////////
    var updateChart = function() {
        var width = self.getView().getViewBoxWidth() - _chartMargin.left - _chartMargin.right;
        var height = self.getView().getViewBoxHeight() - _chartMargin.top - _chartMargin.bottom;

        // Setup x scale
        var xScale = d3.scale.ordinal()
            .domain(_data.map(function(d) { return d.label; }))
            .rangeRoundBands([0, width], .1);

        // Setup y scale
        var yScale = d3.scale.linear()
            .domain([0, d3.max(_data, function(d) { return parseFloat(d.value); })])
            .range([height, 0]);

        // Setup x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .outerTickSize(1);

        // Setup y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(6)
            //.tickFormat(formatNumber)
            .outerTickSize(1);

        // Setup color scale
        var colorScale = d3.scale.ordinal()
            .range(_columnColors);

        // Chart container
        var chart = self.getView().getSvg().select(".g-chart-container");
        if(chart.node() == null) {
            chart = self.getView().getSvg().append("g").classed("g-chart-container", true);
        }

        chart.attr("transform", "translate(" + _chartMargin.left + "," + _chartMargin.top + ")");

        // x axis
        var gxAxis = chart.select(".x.axis");
        if(gxAxis.node() == null) {
            gxAxis = chart.append("g").attr("class", "x axis");
        }
        gxAxis
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var xLabel = gxAxis.select(".x-label");
        if(xLabel.node() == null) {
            xLabel = gxAxis
                .append("text")
                .classed("x-label", true)
                .attr("transform", "translate(" + (width +10) + ",0)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "start");
        }
        xLabel
            .text(function() {
                return _xAxisLabel;
            });

        // y axis
        var gyAxis = chart.select(".y.axis");
        if(gyAxis.node() == null) {
            gyAxis = chart.append("g").attr("class", "y axis");
        }
        gyAxis
            .attr("transform", "translate(0, "+ 0 +" )")
            .call(yAxis);

        var yLabel = gyAxis.select(".y-label");
        if(yLabel.node() == null) {
            yLabel = gyAxis
                .append("text")
                .classed("y-label",true)
                .attr("transform", "translate(0, "+ -30 +" )")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
        }

        yLabel
            .text(function() {
                return _yAxisLabel;
            });


        // Bars
        var gBars = chart.select(".bars");
        if(gBars.node() == null) {
            gBars = chart.append("g").classed("bars", true);
        }

        // Update
        var bars = gBars
            .selectAll(".bar")
            .data(_data);

        bars
            .attr("x", function(d) {
                return xScale(d.label);
            })
            .attr("y", function(d) {
                return yScale(d.value);
            })
            .attr("height", function(d) {
                return height - yScale(d.value);
            })
            .attr("width", xScale.rangeBand())
            .style("fill", function(d) {
                return colorScale(d.label);
            });

        // Enter
        bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return xScale(d.label);
            })
            .attr("y", function(d) {
                return yScale(d.value);
            })
            .attr("height", function(d) {
                return height - yScale(d.value);
            })
            .attr("width", xScale.rangeBand())
            .style("fill", function(d) {
                return colorScale(d.label);
            });

        // Remove
        bars
            .exit()
            .remove();

        // Setup title
        var titleText = self.getView().getSvg().select(".title");
        if(titleText.node() == null) {
            titleText = self.getView().getSvg().append("text").classed("title", true);
        }

        titleText.attr("transform", "translate(" + (_chartMargin.left + (width /2)) + "," + (_chartMargin.top/2) + ")");
        titleText
            .attr("width", width)
            .attr("height", _chartMargin.top)
            .attr("text-anchor", "middle")
            .attr("dy", "0.5em")
            .text(_title);


        // Updated axis
        var axis = self.getView().getSvg().selectAll(".x.axis .domain, .y.axis .domain");
        axis.style("stroke", _axisColor);

        axis.style("stroke-width", _axisWidth);
    };

    // Init
    var init = function() {
        self.getView().addClass("ui-column-chart-view-controller");
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
    } ();
}

Utils.extend(UIColumnChartViewController, UIViewController);