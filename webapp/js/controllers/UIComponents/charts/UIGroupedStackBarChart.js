/**
 * @class UIGroupedStackBarChart
 * @description
 *
 * @constructor
 */
function UIGroupedStackBarChart() {
    UIViewController.call(this);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;


    // Holds data in d3 format
    var _data = [];

    // UI
    var _chartMargin = {top: 60, right: 100, bottom: 50, left: 100};
    var _defaultViewBox = {x: 0, y: 0, width: 500, height: 300};

    var _yLabel = "y label";
    var _yLabelElement = null;

    /////////////////////// PUBLIC ATTRIBUTES ///////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {

        // Super call
        super_updateView.call(self);
    };

    this.pushData = function(data) {
        _data.push(data);
    };

    this.emptyChart = function() {
        self.getView().getSvg().html("");
        _data = [];
    };

    this.setYLabel = function(label) {
        _yLabel = label;
        if(_yLabelElement != null) {
            _yLabelElement.text(_yLabel);
        }
    };

    /**
     *
     */
    this.draw = function() {
        updateChart();
    };



    /////////////////////// PRIVATE METHODS ///////////////////////
    var updateChart = function() {
        var canvas = self.getView().getSvg();
        var box = self.getView().getViewBox();

        var width = box.width - _chartMargin.left - _chartMargin.right,
            height = box.height - _chartMargin.top - _chartMargin.bottom;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        x0.domain(_data[0].map(function(d) { return d.label; }));

        var dataWithoutZero = [];

        _data.forEach(function(selection, i) {
            dataWithoutZero[i] = [];
            selection.forEach(function(group, j) {
                dataWithoutZero[i].push({
                    label: group.label,
                    color: group.color,
                    group: []
                });
                group.group.forEach(function(d, z) {
                    var remove = true;
                    _data.forEach(function(otherSel) {
                        if(otherSel[j].group[z].value > 0) {
                            remove = false;
                        }
                    });
                    if(!remove) {
                        dataWithoutZero[i][j].group.push(d);
                    }
                });
            });
        });


        /*
        dataWithoutZero.forEach(function(group) {
            group.group.sort(function(a, b) {
                return b.value - a.value;
            });
        });*/

        var x1Domain = _.flatten(dataWithoutZero.map(function(sel) {
            return sel.map(function(d) {
                return d.group.map(function(d) {return d.label})
            });
        }));


        x1.domain(x1Domain).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(dataWithoutZero, function(sel) {
            return d3.max(sel, function(m) {
                return d3.max(m.group, function(d) { return d.value; });
            });
        })]);


        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            //.tickSize(width)
            .tickFormat(d3.format(".2s"));

        var g = canvas.select(".chart-content");
        if(g.empty()) {
            g = canvas.append("g")
                .classed("chart-content", true)
                .attr("transform", "translate(" + _chartMargin.left + "," + _chartMargin.top + ")");
        }

        // X Axis
        var gAxis = g.select(".x.axis");
        if(gAxis.empty()) {
            gAxis = g.append("g")
                .attr("class", "x axis")
                .style("fill", "rgba(246,246,246, 1.0)")
                .style("font-size", "30px")
                .attr("transform", "translate(0," + (height + 10) + ")");
            gAxis.select(".domain").style("fill", "rgba(0,0,0,0)")
        }
        gAxis.call(xAxis);
        gAxis.select(".domain").style("fill", "rgba(0,0,0,0)");

        // Y axis
        gAxis = g.select(".y.axis");
        if(gAxis.empty()) {
            gAxis = g.append("g")
                .attr("class", "y axis")
                .style("font-size", "30px")
                .style("fill", "rgba(246,246,246, 1.0)");
            //gAxis.select(".domain").style("fill", "rgba(0,0,0,0)");
        }
        gAxis.call(yAxis);
        //gAxis.select(".domain").style("fill", "rgba(0,0,0,0)");

        _yLabelElement = gAxis.select(".yLabel");
        if(_yLabelElement.empty()) {
            _yLabelElement = gAxis
                .append("text")
                .classed("yLabel", true)
                .attr("transform", "translate(-10, -15)")
                .attr("y", 6)
                .attr("dy", "0.0em")
                .style("text-anchor", "start");
        }
        _yLabelElement.text(_yLabel);

        // Add grid lines
        var grid = g.selectAll("line.horizontalGrid")
            .data(y.ticks(yAxis.ticks()))
            .attr({
                "x1": 0,
                "x2": function(d, i) {
                    return i == 0 ? 0 : width;
                },
                "y1": function (d) {
                    return y(d);
                },
                "y2": function (d) {
                    return y(d);
                }
            });
        grid.enter()
            .insert("line", ":first-child")
            .attr({
                "class": "horizontalGrid",
                "x1": 0,
                "x2": function(d, i) {
                    return i == 0 ? 0 : width;
                },
                "y1": function (d) {
                    return y(d);
                },
                "y2": function (d) {
                    return y(d);
                },
                "fill": "none",
                //"shape-rendering": "crispEdges",
                "stroke-dasharray": "5,5",
                "stroke": "rgba(150,150,150,1.0)",
                "stroke-width": "2px"
            });
        grid.exit().remove();



        for(var k = 0; k < dataWithoutZero.length; k++) {
            var groups = g.selectAll(".group" + k)
                .data(dataWithoutZero[k]);
            groups
                .enter().append("g")
                .attr("class", "group" + k)
                .attr("transform", function(d) {

                    return "translate(" + x0(d.label) + ",0)";
                });

            groups.exit().remove();

            var maxColumnNumberPerGroup = d3.max(dataWithoutZero, function(sel) {
                return d3.max(sel, function(d) {
                    return d.group.length;
                });
            });
            var columnWidth = x0.rangeBand() / maxColumnNumberPerGroup;

            var columns = groups.selectAll("rect")
                .data(function(d) {
                    return d.group;
                })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d, i) {
                    updateTooltip(d3.select(this.parentNode),d,i,d3.select(this), columnWidth);
                });
            columns.enter()
                .append("rect")
                .attr("width", columnWidth -2)
                .attr("x", function(d, i) {
                    return columnWidth * i;
                })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .style("fill", function(d) { return d.color; })
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d, i) {
                    updateTooltip(d3.select(this.parentNode),d,i,d3.select(this), columnWidth);
                });
            columns.exit().remove();



            var groupColors = g.selectAll(".groupColor").data(dataWithoutZero[k]);
            groupColors.enter()
                .append("rect")
                .classed("groupColor", true)
                .attr("x", function(d, i) {
                    return x0(d.label);
                })
                .attr("y", (height + 2))
                .attr("width", function(d, i) {
                    return x0.rangeBand();
                })
                .attr("height", "10px")
                .style("fill", function(d) { return d.color });

        }
    };

    // Init
    var updateTooltip = function(g, d, i,column, colWidth) {
        var tipColor;

        var macro = model.getCrimesModel().getMacroCategory(d.label);
        switch (macro) {
            case CrimeCategory.VIOLENT:
                tipColor = model.getVisualizationModel().violentCrimesMarkerColor();
                break;
            case CrimeCategory.PROPERTY:
                tipColor = model.getVisualizationModel().propertyCrimesMarkerColor();
                break;
            case CrimeCategory.QUALITY_OF_LIFE:
                tipColor = model.getVisualizationModel().qualityOfLifeCrimesMarkerColor();
                break;
        }

        var tip = d3.selectAll(".crime-tip");
        if(!tip.empty() && tip.select("text").text() == d.label) {
            tip.remove();
        } else {
            if(!tip.empty()) {
                tip.remove();
            }
            tip = g.append("g")
                .classed("crime-tip", true)
                .attr("transform", "translate(" + (parseFloat(column.attr("x")) + colWidth/2) + "," + (column.attr("y") - 20) + ")");
            var text = tip.append("text")
                .style("fill", "rgba(41,36,33, 1.0)")
                .style("text-anchor", "middle")
                .style("font-size", "24px")
                .style("font-weight", "400")
                .style()
                .text(d.label);

            var textLength = text.node().getComputedTextLength() + 20;

            tip.insert("rect", "text")
                .attr("x", - (textLength / 2))
                .attr("y", -35)
                .attr("width", textLength)
                .attr("height", 45)
                .style("fill", tipColor);

            var triangle = d3.svg.symbol().type("triangle-down");

            tip.append("g")
                .attr("transform", "translate(0, 15)")
                .append("path")
                .attr("d", triangle)
                .style("fill", tipColor);
        }
    };

    var init = function() {
        self.getView().addClass("ui-grouped-stack-bar-chart-view-controller");
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
    } ();
}

Utils.extend(UIGroupedStackBarChart, UIViewController);