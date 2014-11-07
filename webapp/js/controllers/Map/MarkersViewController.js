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
            .filter(function(d){
                return hasChanged(d , _lastUpdate);
            })
            .style("fill",color)
            .style("stroke","white")
            .style("stroke-width","0.2px");

        // Enter
        points.enter().append("circle")
            .attr("cx", function(d) {
                console.log("New Point Notification");
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
        points.exit()
            .attr("dont_care",function(){
                console.log("Remove Notification");
            })
            .remove();

        // Repopulate _lastUpdate
        _lastUpdate = [];
        points.attr("dontcare",function(d){_lastUpdate.push(d);});

    };

    ////////////////////////// PRIVATE METHODS //////////////////////////


    /**
     * Checks if obj has changed
     * @param obj
     * @param arr
     * @returns {boolean}
     */
    var hasChanged = function (obj , arr){
        for (i in arr){
            if(isIt(arr[i], obj) && ! isEqual(arr[i], obj)) {
                console.log("Update Notification");
                return true;
            }}
        return false;
    };

    /**
     * Checks if two objects are the same looking at their ID
     * @param obj1
     * @param obj2
     * @returns {boolean}
     */
    var isIt = function (obj1 , obj2){
        // TODO: need to handle in a different way for the buses
        return obj1.id == obj2.id;
    };

    /**
     * Checks if two object are exactly the same
     * @param obj1
     * @param obj2
     * @returns {boolean}
     */
    var isEqual = function( obj1 , obj2 ){
        return JSON.stringify(obj1) == JSON.stringify(obj2);
    };

    var init = function(){

    }();
}