/***
 * @class CtaBusVehiclesLayerViewController
 * @description Layer of CTA buses lines and stops.
 *
 * @constructor
 */
function CtaBusVehiclesLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // Local copy of vehicles to update with simulation data
    var _vehicles = [];
    var _mobileMeanSize = 5;

    // Animation Timer
    var _updateTimer = null;
    var _fps = 10.0;
    // Default value is 0.00004
    var _meanSpeed = 0.0004;


    // TODO: use queue.js
    var _counter = 0;

    // To draw the icons on the map
    var _markersViewController;

    //////////////////////// PUBLIC METHODS ////////////////////////
    //this.timeChanged = function() {
    //    var time = model.getCtaModel().getCtaTime();
    //    console.log(time);
    //};

    this.vehiclesChanged = function () {

        // Just for debug purposes or when key expires.
        var fakeVehicles = model.getCtaModel().getFakeVehicles();

        console.log(_counter);

        // Draw only when all the queries ended.
        if (++_counter === model.getCtaModel().getRoutes().length || fakeVehicles) {
            stopAnimation();

            var vehicles = model.getCtaModel().getVehicles();


            console.log(vehicles);
            updateVehiclesInformation(vehicles);

            draw(vehicles);

            _counter = 0;

            startAnimation();
        }

    };

    this.pathChanged = function () {
        stopAnimation();
        model.getCtaModel().stopUpdates();
        _vehicles = [];
        _counter = 0;
        //draw();
        self.vehiclesChanged();
    };

    this.zoomUpdated = function () {
        draw(_vehicles);
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function () {
        console.log("CTA Bus Dispose");

        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getCtaModel().stopUpdates();
        stopAnimation();
        notificationCenter.unsuscribeFromAll(self);
    };


    //////////////////////// PRIVATE METHODS ////////////////////////
    var draw = function (vehicles) {
        vehicles = model.getAreaOfInterestModel().filterObjects(vehicles);

        //console.log("Vehicles");
        //console.log(vehicles);

        //
        //var data = vehicles;
        //if (model.getAreaOfInterestModel().getAreaOfInterest()) {
        //    // filter objects
        //    data = model.getAreaOfInterestModel().filterObjects(vehicles);
        //}

        var canvas = self.getView().getSvg();
        //var points = canvas.selectAll("circle").data(data);
        //_markersViewController.draw(self, points, _vehiclesColor);

        var size = {
            width: model.getVisualizationModel().CTAMarkerIconSize().width,
            height: model.getVisualizationModel().CTAMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if (model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(vehicles);

            // Update
            markers
                .attr("x", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.x - (size.width / 2);
                })
                .attr("y", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.y - size.height;
                })
                //.attr("transform", function(d) {
                //    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                //
                //    var angle = parseFloat(_vehicles[d.id].headingAngle);
                //
                //    var x = point.x - (size.width / 2) * Math.cos(angle) - size.height * Math.cos(angle);
                //
                //    var y = point.y - size.height * Math.cos(angle) + (size.width / 2) * Math.cos(angle);
                //    return "translate(" + x + "," + y + ")" +
                //            " rotate(" + (90 + angle) + ")";
                //});

            // Enter
            markers.enter()
                .append("g")
                .append("image")
                .classed("marker", true)
                .classed("pin", true)
                //.attr("transform", function(d) {
                //    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                //    return "translate(" + (point.x - (size.width / 2)) + "," + (point.y - size.height) + ")";
                //})
                //.append("image")
                .attr("xlink:href", model.getVisualizationModel().CTAMarkerIconPath())
                .attr("x", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.x - (size.width / 2);
                })
                .attr("y", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.y - size.height;
                })
                .attr("width", size.width)
                .attr("height", size.height)
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });


            // Exit
            markers.exit().remove();

        } else {
            canvas.selectAll(".marker.pin").remove();
            markers = canvas.selectAll(".marker.point").data(vehicles);
            // Update
            markers
                .attr("cx", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.x;
                })
                .attr("cy", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.y;
                });

            // Enter
            markers.enter()
                .append("circle")
                .classed("marker", true)
                .classed("point", true)
                .style("fill", model.getVisualizationModel().CTAMarkerColor())
                .attr("cx", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.x;
                })
                .attr("cy", function (d) {
                    var point = self.project(d.latitude + _vehicles[d.id].deltaLat, d.longitude + _vehicles[d.id].deltaLng);
                    return point.y;
                })
                .attr("r", model.getVisualizationModel().markerRadius())
                .attr("stroke", model.getVisualizationModel().markerStrokeColor())
                .attr("stroke-width", model.getVisualizationModel().markerStrokeWidth())
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });

            // Exit
            markers.exit().remove();
        }

    };

    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.BUS_VEHICLES,
            info: d
        });
    };

    /**
     * Start the animation of the buses
     */
    var startAnimation = function () {
        if (_updateTimer === null) {
            _updateTimer = setInterval(frameUpdate, 1000 / _fps);
        }
    };

    /**
     * Stops the animation of buses
     */
    var stopAnimation = function () {
        clearInterval(_updateTimer);
        _updateTimer = null;
    };

    /**
     * Update information for animation purposes
     */
    var updateVehiclesInformation = function (newVehicles) {
        var timerInterval = model.getCtaModel().getUpdateInterval() / 1000;

        // Update existing vehicles and add new vehicles
        for (var i in newVehicles) {
            var id = newVehicles[i].id;

            // If it is a new vehicle
            if (_vehicles[id] === undefined) {
                _vehicles[id] = newVehicles[i];
                _vehicles[id].speedValues = [];
                _vehicles[id].deltaLat = 0;
                _vehicles[id].deltaLng = 0;
                _vehicles[id].meanSpeed = _meanSpeed;
            }
            else {
                // If vehicles are changed
                if (parseFloat(_vehicles[id].longitude) !== parseFloat(newVehicles[i].longitude) ||
                    parseFloat(_vehicles[id].latitude) !== parseFloat(newVehicles[i].latitude)) {

                    // Update values
                    _vehicles[id].oldLatitude   = parseFloat(_vehicles[id].latitude);
                    _vehicles[id].oldLongitude  = parseFloat(_vehicles[id].longitude);

                    _vehicles[id].longitude     = newVehicles[i].longitude;
                    _vehicles[id].latitude      = newVehicles[i].latitude;
                    _vehicles[id].heading       = newVehicles[i].heading;

                    _vehicles[id].deltaLat      = 0;
                    _vehicles[id].deltaLng      = 0;

                    // In order to let the animation recalculate the actual position of the bus.
                    _vehicles[id].headingPoint = undefined;

                    var xSpeed = parseFloat(_vehicles[id].longitude) - _vehicles[id].oldLongitude;
                    var ySpeed = parseFloat(_vehicles[id].latitude) - _vehicles[id].oldLatitude;

                    var newSpeed = Math.sqrt(Math.pow(xSpeed, 2) + Math.pow(ySpeed, 2)) / timerInterval;

                    var speedRegister = _vehicles[id].speedValues;

                    // Adds new value and shifts register
                    speedRegister.unshift(newSpeed);

                    // Takes just the _mobileMeanSize latest values
                    if (speedRegister.length > _mobileMeanSize) {
                        speedRegister = speedRegister.slice(0, _mobileMeanSize);
                    }

                    var meanSpeed = 0;
                    var j = 0;

                    // Computes the mobile mean
                    for (j = 0; j < speedRegister.length; j++) {
                        meanSpeed += speedRegister[j];
                    }

                    meanSpeed /= j;

                    var weigthedSpeed = (meanSpeed + _meanSpeed)/2;

                    // TODO: try with weightedSpeed computed above
                    _vehicles[id].meanSpeed = _meanSpeed;
                }


            }


        }

        // Remove vehicles that are not in the array anymore.
        var indexesToRemove = [];

        for (var k in _vehicles) {
            var found = false;

            newVehicles.forEach(function(vehicle) {
                if(vehicle.id === k) {
                    found = true;
                }
            });

            if(found === false) {
                indexesToRemove.push(k);
            }
        }

        indexesToRemove.forEach(function(index) {
            delete _vehicles[index];
        });


    };

    /***
     * Animate buses
     */
    var frameUpdate = function () {
        var count = 0;

        for (var i in _vehicles) {
            // 0°   : North
            // 90°  : East
            // 180° : South
            // 270° : West
            //var alpha = parseInt(_vehicles[i].heading);
            var alpha = getHeadingFromPath(_vehicles[i]);
            _vehicles[i].headingAngle = alpha;


            // Inverted because of alpha angle which is described above
            if (_vehicles[i].meanSpeed !== undefined) {
                //_vehicles[i].longitude = parseFloat(_vehicles[i].longitude) + parseFloat(_vehicles[i].meanSpeed)/_fps * Math.sin(alpha);
                //_vehicles[i].latitude = parseFloat(_vehicles[i].latitude) + parseFloat(_vehicles[i].meanSpeed)/_fps * Math.cos(alpha);

                _vehicles[i].deltaLng += (parseFloat(_vehicles[i].meanSpeed) / _fps) * Math.sin(toRadians(alpha));
                _vehicles[i].deltaLat += (parseFloat(_vehicles[i].meanSpeed) / _fps) * Math.cos(toRadians(alpha));

            }
        }
        draw(_vehicles);
    };

    /***
     * Return the simulated heading of the bus analyzing the path
     * and determining which stop is the next.
     * @param vehicle
     */
    var getHeadingFromPath = function (vehicle) {
        var patternID = vehicle.patternID;
        var longitude = vehicle.longitude;
        var latitude = vehicle.latitude;

        var busPosition = {
            longitude:  longitude + vehicle.deltaLng,
            latitude:   latitude  + vehicle.deltaLat
        };

        var busRoute = model.getCtaModel().getRoutesPaths()[patternID];

        var points = busRoute.points;

        // Just the first time
        if(vehicle.headingPoint === undefined) {

            // Old implementation
            vehicle.headingPoint = getNearestSegmentEndPoint(busPosition, points);

            //vehicle.headingPoint = model.getCtaModel().getVehicleNextStop(vehicle.id);

        }

        // Get the next point to face in the bus route.
        var headingPoint = vehicle.headingPoint;

        // If near enough to a stop/way-point select the next point in the path.
        if(getDistanceBetweenTwoPoints(busPosition, headingPoint) < 0.0005) {
            //console.log("changing to: " + headingPoint.seq);
            //console.log(points);
            if(points[headingPoint.seq] !== undefined) {
                headingPoint = points[headingPoint.seq];
                vehicle.headingPoint = headingPoint;
            }
        }

        return getWorldAngle(busPosition, headingPoint);
    };

    /***
     *  Get angle between two points in the "world-like" system
     *  0:   North
     *  90:  East
     *  180: South
     *  270: West
     */
    var getWorldAngle = function(pointA,pointB) {
        var deltaX = pointB.longitude - pointA.longitude;
        var deltaY = pointB.latitude - pointA.latitude;

        return (Math.atan2(deltaX, deltaY) * 180) / Math.PI;
    };

    /***
     * Get distance of a point from a segment
     */
    //var getDistanceFromPointAndSegment = function(point, segment) {
    //    var pointA = segment.start;
    //    var pointB = segment.end;
    //
    //    var vertexes = [point, pointA, pointB];
    //
    //    var area = gaussArea(vertexes);
    //
    //
    //    var segmentLength = getDistanceBetweenTwoPoints(pointA, pointB);
    //
    //    return (2 * area) / segmentLength;
    //};

    var getDistanceFromPointAndSegment = function(point, segment) {
        var pointA = segment.start;
        var pointB = segment.end;
        return dotLineLength(point.longitude, point.latitude, pointA.longitude, pointA.latitude, pointB.longitude, pointB.latitude, true);
    };

    /**
     * See: http://jsfromhell.com/math/dot-line-length
     *
     * Distance from a point to a line or segment.
     *
     * @param {number} x point's x coord
     * @param {number} y point's y coord
     * @param {number} x0 x coord of the line's A point
     * @param {number} y0 y coord of the line's A point
     * @param {number} x1 x coord of the line's B point
     * @param {number} y1 y coord of the line's B point
     * @param {boolean} overLine specifies if the distance should respect the limits
     * of the segment (overLine = true) or if it should consider the segment as an
     * infinite line (overLine = false), if false returns the distance from the point to
     * the line, otherwise the distance from the point to the segment.
     */
    var dotLineLength = function(x, y, x0, y0, x1, y1, o) {
        function lineLength(x, y, x0, y0){
            return Math.sqrt((x -= x0) * x + (y -= y0) * y);
        }
        if(o && !(o = function(x, y, x0, y0, x1, y1){
                if(!(x1 - x0)) return {x: x0, y: y};
                else if(!(y1 - y0)) return {x: x, y: y0};
                var left, tg = -1 / ((y1 - y0) / (x1 - x0));
                return {x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
            }(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))){
            var l1 = lineLength(x, y, x0, y0), l2 = lineLength(x, y, x1, y1);
            return l1 > l2 ? l2 : l1;
        }
        else {
            var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
            return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
        }
    };

    var gaussArea = function(vertexes) {
        var i;
        var sum = 0;

        for(i = 0; i < vertexes.length -1; i++) {
            sum += vertexes[i].longitude * vertexes[i +1].latitude;
        }
        sum += vertexes[i].longitude * vertexes[0].latitude;

        for(i = 1; i < vertexes.length; i++) {
            sum -= vertexes[i].longitude * vertexes[i -1].latitude;
        }

        sum -= vertexes[0].longitude * vertexes[vertexes.length -1].latitude;

        sum = Math.abs(sum);

        return sum / 2;
    };

    var toRadians = function(degrees) {
        return degrees * Math.PI / 180;
    };

    var getDistanceBetweenTwoPoints = function(pointA, pointB) {
        var deltaX = pointB.longitude - pointA.longitude;
        var deltaY = pointB.latitude - pointA.latitude;

        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };

    var getNearestSegmentEndPoint = function(position, points) {
        /***
         * Structure which contains information about the nearest segment of the path.
         * It determines in which segment the bus actually is.
         * @type {{distance: null, startPoint: null, endPoint: null}}
         */
        var nearestSegment = {
            distance: null,
            startPoint: null,
            endPoint: null
        };

        // Iterates on each segment of the path in order to determine the nearest segment.
        for (var i = 0; i < points.length - 1; i++) {

            var segmentStart = {
                longitude: points[i].longitude,
                latitude: points[i].latitude,
                seq: points[i].seq
            };

            var segmentEnd = {
                longitude: points[i + 1].longitude,
                latitude: points[i + 1].latitude,
                seq: points[i + 1].seq
            };

            var segment = {
                start: segmentStart,
                end: segmentEnd
            };


            var distance = getDistanceFromPointAndSegment(position, segment);

            // Get the min
            if (nearestSegment.distance === null || distance < nearestSegment.distance) {
                nearestSegment.distance = distance;
                nearestSegment.startPoint = segmentStart;
                nearestSegment.endPoint = segmentEnd;
            }
        }
        return nearestSegment.endPoint;
    };




    var init = function() {
        self.getView().addClass("cta-layer-view-controller");

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.cta.VEHICLES);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomUpdated, Notifications.mapController.ZOOM_CHANGED);
    } ();
}

Utils.extend(CtaBusVehiclesLayerViewController, MapLayerController);
