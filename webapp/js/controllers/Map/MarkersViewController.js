/**
 * @description This view controller has the purpose of drawing the icons of each layer on the map
 * @constructor
 */
function MarkersViewController(){

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _lastUpdate = [];
    ////////////////////////// PUBLIC METHODS //////////////////////////

    // TODO: extend this function with the icon to display as a parameter
    /**
     * @param context is the Layer View Controller associated to the icon
     * @param points are the points to draw
     */
    this.draw = function(context,points,color){

        /*
        // Go back to the normal color if no changes occur
        points
            .attr("cx", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 1)
            .filter(function(d,i){
                // Filter out all the stations that HAVEN'T changed
                return  ! areDifferent(d ,_lastUpdate[i]);
            })
            .transition().duration(1500)
            .style("fill",color)
            .style("stroke","white")
            .style("stroke-width","0.2px");
        */

        // Update when a difference is found
        points
            .attr("cx", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 1)
            /*
            .filter(function(d,i){
                // FIlter out all the stations that HAVE changed
               var bool =   areDifferent(d ,_lastUpdate[i]);
               _lastUpdate[i] = d;
               return bool;
            })
            .transition().duration(1500)
            */
            .style("fill",color)
            .style("stroke","white")
            .style("stroke-width","0.2px");

        // Enter
        points.enter().append("circle")
            .attr("cx", function(d,i) {
                //_lastUpdate[i] = d ;
                var point = context.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = context.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 1)
            .style("fill",color)
            .style("stroke","white")
            .style("stroke-width","0.2px");

        // Exit
        points.exit().remove();

    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    // Return true when the two objects are different
    var areDifferent = function( obj1 , obj2 ) {
        return JSON.stringify(obj1) != JSON.stringify(obj2);
    };

    var init = function(){

    }();
}