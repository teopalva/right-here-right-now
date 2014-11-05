/**
 * @description This view controller has the purpose of drawing the icons of each layer on the map
 * @constructor
 */
function MarkersViewController(){

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    // TODO: extend this function with the icon to display as a parameter
    /**
     * @param context is the Layer View Controller associated to the icon
     * @param points are the points to draw
     */
    this.draw = function(context,points){

        // Update
        points
            .attr("cx", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 2);

        // Enter
        points.enter().append("circle")
            .attr("cx", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 2);

        // Exit
        points.exit().remove();

    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function(){

    }();
}