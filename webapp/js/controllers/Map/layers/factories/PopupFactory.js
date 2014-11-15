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
        }

        return popup;
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var setupCrimePopup = function (popup,dictionary) {
        // Setup popup
        var _crimeFrameSize = {
            width: 250,
            height: 150
        };

        var labelsSize = {
            width: 230,
            height: 20
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
        descriptionLabel.getView().setFrame(padding.left,padding.top * 8 ,labelsSize.width,labelsSize.height);
        descriptionLabel.setText("Description: " + dictionary.description);
        descriptionLabel.setTextAlignment(TextAlignment.LEFT);
        descriptionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(descriptionLabel);

        var locationDescriptionLabel = new UILabelViewController();
        locationDescriptionLabel.getView().setFrame(padding.left,padding.top * 9 + padding.between,labelsSize.width,labelsSize.height);
        locationDescriptionLabel.setText("Location: "+dictionary.location_description);
        locationDescriptionLabel.setTextAlignment(TextAlignment.LEFT);
        locationDescriptionLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(locationDescriptionLabel);

        var caseNumberLabel = new UILabelViewController();
        caseNumberLabel.getView().setFrame(padding.left,padding.top * 10 + padding.between * 2,labelsSize.width,labelsSize.height);
        caseNumberLabel.setText("Case Number: "+dictionary.case_number);
        caseNumberLabel.setTextAlignment(TextAlignment.LEFT);
        caseNumberLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        popup.add(caseNumberLabel);

    };

    var init = function() {

    } ();
}