/**
 * @class UINotificationCenterViewController
 * @description ..
 *
 * @constructor
 */
function UIPopupViewController(dictionary) {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    var _idDict = dictionary;

    var _delegate;

    var _closeButton;
    var _closeButtonBox = {
        padding: {
            top: 10,
            right: 10
        },
        width: 20,
        height: 20
    };

    var _dataSourceImage;
    var _dataSourceImageBox = {
        padding: {
            top: 10,
            left: 10
        },
        width: 40,
        height: 40
    };

    /////////////////////  PUBLIC METHODS /////////////////////

    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();



        // Call super
        super_viewDidAppear.call(self);
    };


    this.setDelegate = function(delegate) {
        _delegate = delegate;
    };

    this.close = function() {
        _delegate.closePopup(self);
    };

    this.getDictionary = function() {
        return _idDict;
    };

    this.setDataSourceImage = function(path){
        _dataSourceImage.setImagePath(path);
    };

    this.frameDidChange = function() {
        updateChildren();
    };

    this.viewBoxDidChange = function() {
      updateChildren();
    };

    /////////////////////  PRIVATE METHODS /////////////////////
    var updateChildren = function() {
        var box = self.getView().getViewBox();
        _closeButton.getView().setFramePosition(box.width - _closeButtonBox.width - _closeButtonBox.padding.right, _closeButtonBox.padding.top);
        _dataSourceImage.getView().setFramePosition(_dataSourceImageBox.padding.left , _dataSourceImageBox.padding.top);
    };

    var addBehaviors = function() {
        _closeButton.onClick(function() {
            self.close();
        });
    };

    var init = function () {
        self.getView().addClass("ui-popup-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        self.getView().setCornerRadius(10);

        self.getView().setDelegate(self);

        // Setup UI
        _closeButton = new UIButtonViewController();
        _closeButton.setImage("assets/icon/closePopup.svg");
        _closeButton.getView().setFrameSize(_closeButtonBox.width, _closeButtonBox.height);
        self.add(_closeButton);

        _dataSourceImage = new UIImageViewController();
        _dataSourceImage.getView().setFrameSize(_dataSourceImageBox.width, _dataSourceImageBox.height);
        self.add(_dataSourceImage);

        addBehaviors();
    }();
}

Utils.extend(UIPopupViewController, UIViewController);
