/**
 * @class PopupFactory
 * @description Factory that returns the layers of the map based on the status of the model
 *
 * @constructor
 */
function PopupFactory() {
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    /////////////////////////////// PUBLIC METHODS ///////////////////////////////
    this.getPopup = function(dictionary) {
        var popup = new UIPopupViewController(dictionary);

        switch(dictionary.type) {
            case PopupsType.CRIME:
                popup.setDataSourceFrame(10,10,40,40);
                popup.setDataSourceImage("assets/icon/data_sources/311.svg");
                setupCrimePopup(popup,dictionary);
                break;
            case PopupsType.POTHOLES:
                popup.setDataSourceFrame(10,10,40,40);
                popup.setDataSourceImage("assets/icon/data_sources/311.svg");
                setupPotholesPopup(popup,dictionary);
                break;
            case PopupsType.LIGHTS:
                popup.setDataSourceFrame(10,10,40,40);
                popup.setDataSourceImage("assets/icon/data_sources/311.svg");
                setupLightsPopup(popup,dictionary);
                break;
            case PopupsType.DIVVY_BIKES:
                popup.setDataSourceFrame(10,5,50,50);
                popup.setDataSourceImage("assets/icon/data_sources/divvy.svg");
                setupDivvyBikesPopup(popup,dictionary);
                break;
            case PopupsType.VEHICLES:
                popup.setDataSourceFrame(10,10,40,40);
                popup.setDataSourceImage("assets/icon/data_sources/311.svg");
                setupVehiclesPopup(popup,dictionary);
                break;
            case PopupsType.RESTAURANTS:
                popup.setDataSourceFrame(10,5,50,50);
                popup.setDataSourceImage("assets/icon/data_sources/yelp.svg");
                setupPassedRestaurantsPopup(popup,dictionary);
                break;
            case PopupsType.BUS_STOPS:
                popup.setDataSourceFrame(10,5,50,50);
                popup.setDataSourceImage("assets/icon/data_sources/cta.svg");
                setupBusStopPopup(popup,dictionary);
                break;
            case PopupsType.BUS_VEHICLES:
                popup.setDataSourceFrame(10,5,50,50);
                popup.setDataSourceImage("assets/icon/data_sources/cta.svg");
                setupBusVehiclePopup(popup,dictionary);
                break;
            case PopupsType.BUS_ROUTES:
                popup.setDataSourceFrame(10,5,50,50);
                popup.setDataSourceImage("assets/icon/data_sources/cta.svg");
                setupBusRoutePopup(popup,dictionary);
                break;
            case PopupsType.TRAIN_STATIONS:
                popup.setDataSourceFrame(10,5,50,50);
                popup.setDataSourceImage("assets/icon/data_sources/cta.svg");
                setupTrainStopPopup(popup,dictionary);
                break;


        }

        return popup;
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    /**
     * Setup crimes
     * @param popup
     * @param dictionary
     */
    var setupCrimePopup = function (popup,dictionary) {
        // Setup popup
        var _crimeFrameSize = {
            width: 300,
            height: 180
        };

        var labelsSize = {
            width: _crimeFrameSize.width - 20,
            height: 30
        };

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.position.latitude, dictionary.position.longitude);
        popup.getView().setFrame(
            position.x - (_crimeFrameSize.width / 2),
            position.y - _crimeFrameSize.height,
            _crimeFrameSize.width,
            _crimeFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _crimeFrameSize.width, _crimeFrameSize.height);

        var dateLabel = new UILabelViewController();
        dateLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        dateLabel.setText(dictionary.date);
        dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(dateLabel);

        var streetLabel = new UILabelViewController();
        streetLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        streetLabel.setText(dictionary.block);
        streetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(streetLabel);

        var typeLabel = new UILabelViewController();
        typeLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        typeLabel.setText(dictionary.primaryType);
        typeLabel.setTextAlignment(TextAlignment.LEFT);
        typeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        typeLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(typeLabel);

        var descriptionLabel = new UILabelViewController();
        descriptionLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        descriptionLabel.setText(dictionary.description);
        descriptionLabel.setTextAlignment(TextAlignment.LEFT);
        descriptionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(descriptionLabel);

        var locationDescriptionLabel = new UILabelViewController();
        locationDescriptionLabel.getView().setFrame(padding.left,padding.top * 10,labelsSize.width,labelsSize.height);
        locationDescriptionLabel.setText("Location: "+dictionary.location_description);
        locationDescriptionLabel.setTextAlignment(TextAlignment.LEFT);
        locationDescriptionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(locationDescriptionLabel);

        var caseNumberLabel = new UILabelViewController();
        caseNumberLabel.getView().setFrame(padding.left,padding.top * 11 + padding.between,labelsSize.width,labelsSize.height);
        caseNumberLabel.setText("Case Number: "+dictionary.case_number);
        caseNumberLabel.setTextAlignment(TextAlignment.LEFT);
        caseNumberLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(caseNumberLabel);


        var arrestLabel = new UILabelViewController();
        arrestLabel.getView().setFrame(padding.left,padding.top * 12 + padding.between * 2,labelsSize.width,labelsSize.height);
        arrestLabel.setText("Arrested: "+dictionary.arrest);
        arrestLabel.setTextAlignment(TextAlignment.LEFT);
        arrestLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(arrestLabel);

    };

    /**
     * Setup potholes
     * @param popup
     * @param dictionary
     */
    var setupPotholesPopup = function(popup,dictionary) {

        // Setup popup
        var _potholesFrameSize = {
            width: 300,
            height: 120
        };

        var labelsSize = {
            width: _potholesFrameSize.width - 20,
            height: 30
        }

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.position.latitude, dictionary.position.longitude);
        popup.getView().setFrame(
            position.x - (_potholesFrameSize.width / 2),
            position.y - _potholesFrameSize.height,
            _potholesFrameSize.width,
            _potholesFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _potholesFrameSize.width, _potholesFrameSize.height);

        var dateLabel = new UILabelViewController();
        dateLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        dateLabel.setText(dictionary.creation_date);
        dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(dateLabel);

        var streetLabel = new UILabelViewController();
        streetLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        streetLabel.setText(dictionary.street_address);
        streetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(streetLabel);

        var typeLabel = new UILabelViewController();
        typeLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        typeLabel.setText("STREET POTHOLE");
        typeLabel.setTextAlignment(TextAlignment.LEFT);
        typeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        typeLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(typeLabel);

        var descriptionLabel = new UILabelViewController();
        descriptionLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        descriptionLabel.setText("Service Request Number: " + dictionary.id);
        descriptionLabel.setTextAlignment(TextAlignment.LEFT);
        descriptionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(descriptionLabel);
    };

    /**
     * Setup Lights
     * @param popup
     * @param dictionary
     */
    var setupLightsPopup = function(popup, dictionary) {
        // Setup popup
        var _lightsFrameSize = {
            width: 300,
            height: 120
        };

        var labelsSize = {
            width: _lightsFrameSize.width - 20,
            height: 30
        }

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.position.latitude, dictionary.position.longitude);
        popup.getView().setFrame(
            position.x - (_lightsFrameSize.width / 2),
            position.y - _lightsFrameSize.height,
            _lightsFrameSize.width,
            _lightsFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _lightsFrameSize.width, _lightsFrameSize.height);

        var dateLabel = new UILabelViewController();
        dateLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        dateLabel.setText(dictionary.creation_date);
        dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(dateLabel);

        var streetLabel = new UILabelViewController();
        streetLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        streetLabel.setText(dictionary.street_address);
        streetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(streetLabel);

        var typeLabel = new UILabelViewController();
        typeLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        typeLabel.setText("LIGHTS OUT : "+ dictionary.number_out);
        typeLabel.setTextAlignment(TextAlignment.LEFT);
        typeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        typeLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(typeLabel);

        var descriptionLabel = new UILabelViewController();
        descriptionLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        descriptionLabel.setText("Service Request Number: " + dictionary.id);
        descriptionLabel.setTextAlignment(TextAlignment.LEFT);
        descriptionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(descriptionLabel);
    };

    /**
     * Setup divvy popup
     * @param popup
     * @param dictionary
     */
    var  setupDivvyBikesPopup = function(popup,dictionary) {
        // Setup popup
        var _divvyBikeFrameSize = {
            width: 300,
            height: 150
        };

        var labelsSize = {
            width: _divvyBikeFrameSize.width - 20,
            height: 30
        }

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.position.latitude, dictionary.position.longitude);
        popup.getView().setFrame(
            position.x - (_divvyBikeFrameSize.width / 2),
            position.y - _divvyBikeFrameSize.height,
            _divvyBikeFrameSize.width,
            _divvyBikeFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _divvyBikeFrameSize.width, _divvyBikeFrameSize.height);

        var dateLabel = new UILabelViewController();
        dateLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        dateLabel.setText(dictionary.last_update);
        dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(dateLabel);

        var streetLabel = new UILabelViewController();
        streetLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        streetLabel.setText(dictionary.stationName);
        streetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(streetLabel);

        var stationNameLabel = new UILabelViewController();
        stationNameLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        stationNameLabel.setText("STATION " + dictionary.id);
        stationNameLabel.setTextAlignment(TextAlignment.LEFT);
        stationNameLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        stationNameLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(stationNameLabel);

        var statusLabel = new UILabelViewController();
        statusLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        statusLabel.setText("Status: " + dictionary.statusValue);
        statusLabel.setTextAlignment(TextAlignment.LEFT);
        statusLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(statusLabel);

        var docksLabel = new UILabelViewController();
        docksLabel.getView().setFrame(padding.left,padding.top * 10,labelsSize.width,labelsSize.height);
        docksLabel.setText("Free docks: "+dictionary.availableDocks+" out of "+ dictionary.totalDocks);
        docksLabel.setTextAlignment(TextAlignment.LEFT);
        docksLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(docksLabel);


        var availableBikesLabel = new UILabelViewController();
        availableBikesLabel.getView().setFrame(padding.left,padding.top * 11 + padding.between,labelsSize.width,labelsSize.height);
        availableBikesLabel.setText("Available bikes: "+dictionary.availableBikes);
        availableBikesLabel.setTextAlignment(TextAlignment.LEFT);
        availableBikesLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(availableBikesLabel);

    };

    /**
     * Setup abandoned vehicles popup
     * @param popup
     * @param dictionary
     */
    var setupVehiclesPopup = function(popup, dictionary) {
        // Setup popup
        var _vehiclesFrameSize = {
            width: 300,
            height: 180
        };

        var labelsSize = {
            width: _vehiclesFrameSize.width - 20,
            height: 30
        }

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.position.latitude, dictionary.position.longitude);
        popup.getView().setFrame(
            position.x - (_vehiclesFrameSize.width / 2),
            position.y - _vehiclesFrameSize.height,
            _vehiclesFrameSize.width,
            _vehiclesFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _vehiclesFrameSize.width, _vehiclesFrameSize.height);

        var dateLabel = new UILabelViewController();
        dateLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        dateLabel.setText(dictionary.creation_date);
        dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(dateLabel);

        var streetLabel = new UILabelViewController();
        streetLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        streetLabel.setText(dictionary.street_address);
        streetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(streetLabel);

        var vehicleMakeModelLabel = new UILabelViewController();
        vehicleMakeModelLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        vehicleMakeModelLabel.setText(dictionary.vehicle_make_model);
        vehicleMakeModelLabel.setTextAlignment(TextAlignment.LEFT);
        vehicleMakeModelLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        vehicleMakeModelLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(vehicleMakeModelLabel);

        var idLabel = new UILabelViewController();
        idLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        idLabel.setText("Service Request: " + dictionary.id);
        idLabel.setTextAlignment(TextAlignment.LEFT);
        idLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(idLabel);

        var statusLabel = new UILabelViewController();
        statusLabel.getView().setFrame(padding.left,padding.top * 10,labelsSize.width,labelsSize.height);
        statusLabel.setText("Status: "+dictionary.most_recent_action);
        statusLabel.setTextAlignment(TextAlignment.LEFT);
        statusLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(statusLabel);

        var colorLabel = new UILabelViewController();
        colorLabel.getView().setFrame(padding.left,padding.top * 11 + padding.between,labelsSize.width,labelsSize.height);
        colorLabel.setText("Color: " + dictionary.vehicle_color);
        colorLabel.setTextAlignment(TextAlignment.LEFT);
        colorLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(colorLabel);

        var plateLabel = new UILabelViewController();
        plateLabel.getView().setFrame(padding.left,padding.top * 12 + padding.between *2,labelsSize.width,labelsSize.height);
        plateLabel.setText("Plate: " + dictionary.license_plate);
        plateLabel.setTextAlignment(TextAlignment.LEFT);
        plateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(plateLabel);

    };

    /**
     * Setup passedRestaurants popup
     * @param popup
     * @param dictionary
     */
    var  setupPassedRestaurantsPopup = function(popup,dictionary) {
        // Setup popup
        var _restaurantsFrameSize = {
            width: 300,
            height: 180
        };

        var labelsSize = {
            width: _restaurantsFrameSize.width - 20,
            height: 30
        };

        var imageSize = {
            width: 60,
            height: 60
        };

        var padding = {
            top : 10,
            left : 10,
            afterImage : imageSize.width + 20,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.position.latitude, dictionary.position.longitude);
        popup.getView().setFrame(
            position.x - (_restaurantsFrameSize.width / 2),
            position.y - _restaurantsFrameSize.height,
            _restaurantsFrameSize.width,
            _restaurantsFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _restaurantsFrameSize.width, _restaurantsFrameSize.height);

        var addressLabel1 = new UILabelViewController();
        addressLabel1.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        addressLabel1.setText(dictionary.address);
        addressLabel1.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(addressLabel1);

        var addressLabel2 = new UILabelViewController();
        addressLabel2.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        addressLabel2.setText(dictionary.city);
        addressLabel2.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(addressLabel2);

        var nameLabel = new UILabelViewController();
        nameLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        nameLabel.setText(dictionary.name);
        nameLabel.setTextAlignment(TextAlignment.LEFT);
        nameLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        nameLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(nameLabel);


        var categoryLabel = new UILabelViewController();
        categoryLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        categoryLabel.setText("Category: "+dictionary.category);
        categoryLabel.setTextAlignment(TextAlignment.LEFT);
        categoryLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(categoryLabel);

        var inspectionLabel = new UILabelViewController();
        inspectionLabel.getView().setFrame(padding.afterImage,padding.top * 9,labelsSize.width,labelsSize.height);
        inspectionLabel.setText("Inspection: "+ dictionary.inspection);
        inspectionLabel.setTextAlignment(TextAlignment.LEFT);
        inspectionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(inspectionLabel);

        var phoneLabel = new UILabelViewController();
        phoneLabel.getView().setFrame(padding.afterImage,padding.top * 10 + padding.between,labelsSize.width,labelsSize.height);
        phoneLabel.setText("Phone: "+ dictionary.phone);
        phoneLabel.setTextAlignment(TextAlignment.LEFT);
        phoneLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(phoneLabel);

    
        var ratingLabel = new UILabelViewController();
        ratingLabel.getView().setFrame(padding.afterImage,padding.top * 11 + padding.between * 2,labelsSize.width,labelsSize.height);
        ratingLabel.setText("Rating: "+dictionary.rating+" out of 5");
        ratingLabel.setTextAlignment(TextAlignment.LEFT);
        ratingLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(ratingLabel);

        var reviewsLabel = new UILabelViewController();
        reviewsLabel.getView().setFrame(padding.afterImage,padding.top * 12 + padding.between * 3,labelsSize.width,labelsSize.height);
        reviewsLabel.setText("Reviews: "+dictionary.reviews);
        reviewsLabel.setTextAlignment(TextAlignment.LEFT);
        reviewsLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(reviewsLabel);

        var imageLabel = new UIImageViewController();
        imageLabel.getView().setFrame(padding.left,padding.top * 10, imageSize.width, imageSize.height);
        imageLabel.setImagePath(dictionary.image);
        popup.add(imageLabel);
    };

    /**
     * Setup bus stop popup
     * @param popup
     * @param dictionary
     */
    var  setupBusStopPopup = function(popup,dictionary) {
        // Setup popup
        var _busStopFrameSize = {
            width: 250,
            height: 100
        };

        var labelsSize = {
            width: _busStopFrameSize.width - 20,
            height: 30
        };

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var position = model.getMapModel().projectAtCurrentZoom(dictionary.info.latitude, dictionary.info.longitude);
        popup.getView().setFrame(
            position.x - (_busStopFrameSize.width / 2),
            position.y - _busStopFrameSize.height,
            _busStopFrameSize.width,
            _busStopFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _busStopFrameSize.width, _busStopFrameSize.height);

        var idLabel = new UILabelViewController();
        idLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        idLabel.setText(dictionary.info.id);
        idLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(idLabel);

        var nameLabel = new UILabelViewController();
        nameLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        nameLabel.setText(dictionary.info.name);
        nameLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(nameLabel);

        var routeLabel = new UILabelViewController();
        routeLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        routeLabel.setText("ROUTE: " + dictionary.info.route);
        routeLabel.setTextAlignment(TextAlignment.LEFT);
        routeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(routeLabel);


    };

    /**
     * Setup bus stop popup
     * @param popup
     * @param dictionary
     */
    var  setupBusVehiclePopup = function(popup,dictionary) {
        // Setup popup
        var _busStopFrameSize = {
            width: 250,
            height: 100
        };

        var labelsSize = {
            width: _busStopFrameSize.width - 20,
            height: 30
        };

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var latitude = dictionary.info.latitude;
        var longitude = dictionary.info.longitude;

        var position = model.getMapModel().projectAtCurrentZoom(latitude, longitude);
        popup.getView().setFrame(
            position.x - (_busStopFrameSize.width / 2),
            position.y - _busStopFrameSize.height,
            _busStopFrameSize.width,
            _busStopFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _busStopFrameSize.width, _busStopFrameSize.height);

        var idLabel = new UILabelViewController();
        idLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        idLabel.setText(dictionary.info.id);
        idLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(idLabel);

        var routeLabel = new UILabelViewController();
        routeLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        routeLabel.setText("ROUTE: " + dictionary.info.route);
        routeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(routeLabel);

        var delayLabel = new UILabelViewController();
        delayLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        delayLabel.setText("Delay: " + dictionary.info.delay);
        delayLabel.setTextAlignment(TextAlignment.LEFT);
        delayLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(delayLabel);


    };

    /**
     * Setup bus route popup
     * @param popup
     * @param dictionary
     */
    var  setupBusRoutePopup = function(popup,dictionary) {
        // Setup popup
        var _busStopFrameSize = {
            width: 250,
            height: 100
        };

        var labelsSize = {
            width: _busStopFrameSize.width - 20,
            height: 30
        };

        var padding = {
            top : 10,
            left : 10,
            between : 4
        };

        var latitude = dictionary.info.latitude;
        var longitude = dictionary.info.longitude;

        var position = model.getMapModel().projectAtCurrentZoom(latitude, longitude);
        popup.getView().setFrame(
            position.x - (_busStopFrameSize.width / 2),
            position.y - _busStopFrameSize.height,
            _busStopFrameSize.width,
            _busStopFrameSize.height
        );
        popup.getView().setViewBox(0, 0, _busStopFrameSize.width, _busStopFrameSize.height);

        var idLabel = new UILabelViewController();
        idLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        idLabel.setText(dictionary.info.route + " - " + dictionary.info.direction);
        idLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(idLabel);



    };

    var init = function() {

    } ();
}