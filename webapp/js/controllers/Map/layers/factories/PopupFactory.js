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

    var init = function() {

    } ();
}