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
                setupCrimePopup(popup,dictionary);
                break;
            case PopupsType.POTHOLES:
                setupPotholesPopup(popup,dictionary);
                break;
            case PopupsType.LIGHTS:
                setupLightsPopup(popup,dictionary);
                break;
            case PopupsType.DIVVY_BIKES:
                setupRestaurantsPopup(popup,dictionary);
                break;
            case PopupsType.VEHICLES:
                setupVehiclesPopup(popup,dictionary);
                break;
            case PopupsType.RESTAURANTS:
                setupRestaurantsPopup(popup,dictionary);
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
     * Setup restaurants popup
     * @param popup
     * @param dictionary
     */
    var  setupRestaurantsPopup = function(popup,dictionary) {
        // Setup popup
        var _restaurantsFrameSize = {
            width: 300,
            height: 180
        };

        var labelsSize = {
            width: _restaurantsFrameSize.width - 20,
            height: 30
        }

        var padding = {
            top : 10,
            left : 10,
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

        var dateLabel = new UILabelViewController();
        dateLabel.getView().setFrame(padding.left,padding.top,labelsSize.width,labelsSize.height);
        dateLabel.setText(dictionary.inspection_date);
        dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(dateLabel);

        var streetLabel = new UILabelViewController();
        streetLabel.getView().setFrame(padding.left,padding.top * 2 + padding.between,labelsSize.width,labelsSize.height);
        streetLabel.setText(dictionary.address);
        streetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(streetLabel);

        var riskLabel = new UILabelViewController();
        riskLabel.getView().setFrame(padding.left,padding.top * 5 ,labelsSize.width,labelsSize.height);
        riskLabel.setText("Seriousness: "+dictionary.risk);
        riskLabel.setTextAlignment(TextAlignment.LEFT);
        riskLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        riskLabel.setTextSize(model.getThemeModel().bigTextSize());
        popup.add(riskLabel);


        var nameLabel = new UILabelViewController();
        nameLabel.getView().setFrame(padding.left,padding.top * 7 ,labelsSize.width,labelsSize.height);
        nameLabel.setText("Name: " + dictionary.dba_name);
        nameLabel.setTextAlignment(TextAlignment.LEFT);
        nameLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(nameLabel);


        var inspectionTypeLabel = new UILabelViewController();
        inspectionTypeLabel.getView().setFrame(padding.left,padding.top * 10,labelsSize.width,labelsSize.height);
        inspectionTypeLabel.setText("Inspection type: "+ dictionary.inspection_type);
        inspectionTypeLabel.setTextAlignment(TextAlignment.LEFT);
        inspectionTypeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(inspectionTypeLabel);

    
        var resultLabel = new UILabelViewController();
        resultLabel.getView().setFrame(padding.left,padding.top * 11 + padding.between,labelsSize.width,labelsSize.height);
        resultLabel.setText("Result: "+dictionary.results);
        resultLabel.setTextAlignment(TextAlignment.LEFT);
        resultLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(resultLabel);

        var licenseLabel = new UILabelViewController();
        licenseLabel.getView().setFrame(padding.left,padding.top * 12 + padding.between * 2,labelsSize.width,labelsSize.height);
        licenseLabel.setText("Restaurant license: "+dictionary.license);
        licenseLabel.setTextAlignment(TextAlignment.LEFT);
        licenseLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(licenseLabel);
    
    };


    var init = function() {

    } ();
}