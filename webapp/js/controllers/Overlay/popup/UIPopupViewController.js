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

    var _triangle;
    var _triangleSize = {
        width: 22,
        height: 22
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

    this.setDataSourceFrame = function(left,top,width,height){
        _dataSourceImage.getView().setFrame(left,top,width,height);
    };

    this.frameDidChange = function() {
        var box = self.getView().getViewBox();

        if(box.height == null) {
            box = self.getView().getFrame();
        }

        if(box.height != 0) {
            self.getView().setContentHeight(box.height - _triangleSize.height);
            _triangle.getView().setFrame(
                (box.width / 2) - (_triangleSize.width /2),
                    box.height - _triangleSize.height,
                _triangleSize.width,
                _triangleSize.height);
        }
        updateChildren();
    };

    this.viewBoxDidChange = function() {
        var box = self.getView().getViewBox();

        if(box.height == null) {
            box = self.getView().getFrame();
        }

        if(box.height != 0) {
            self.getView().setContentHeight(box.height - _triangleSize.height);
            _triangle.getView().setFrame(
                    (box.width / 2) - (_triangleSize.width /2),
                    box.height - _triangleSize.height *1.16,
                _triangleSize.width,
                _triangleSize.height);
        }

        updateChildren();
    };

    /////////////////////  PRIVATE METHODS /////////////////////
    var updateChildren = function() {
        var box = self.getView().getViewBox();
        _closeButton.getView().setFramePosition(box.width - _closeButtonBox.width - _closeButtonBox.padding.right, _closeButtonBox.padding.top);
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
        //self.getView().setContentHeight("88%");

        _triangle = new UIImageViewController();
        _triangle.setImagePath("assets/icon/triangle.svg");
        //_triangle.getView().setFrame("50%", "90%", "12%", "12%");
        self.add(_triangle);


        self.getView().setDelegate(self);

        // Setup UI
        _closeButton = new UIButtonViewController();
        _closeButton.setImage("assets/icon/closePopup.svg");
        _closeButton.getView().setFrameSize(_closeButtonBox.width, _closeButtonBox.height);
        self.add(_closeButton);

        _dataSourceImage = new UIImageViewController();
        self.add(_dataSourceImage);

        addBehaviors();
    }();
}

Utils.extend(UIPopupViewController, UIViewController);
