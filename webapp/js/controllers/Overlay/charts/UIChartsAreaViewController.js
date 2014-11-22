/**
 * @class UIChartsAreaViewController
 * @description
 *
 * @constructor
 */
function UIChartsAreaViewController() {
    UIViewController.call(this);
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _context = "";

    var _padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    };

    var _menuHeight = 100;

    var _buttonSize =  {
        width: 200,
        height: 60
    };

    var _crimeButton;
    var _streetIssueButton;

    var _contextViewController = null;


    ///////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        self.changeContext(ChartsContext.CRIME);

        // Call super
        super_viewDidAppear.call(self);
    };

    this.viewBoxDidChange = function() {
        var box = self.getView().getViewBox();

        var size = {
            width: 200,
            height: 60
        };
        _crimeButton.getView().setFrame(
            _padding.left,
                box.height - _padding.bottom - size.height,
            size.width,
            size.height
        );
        _crimeButton.getView().setViewBox(0, 0, size.width, size.height);

        var streetIssueSize = {
            width: 200,
            height: 60
        };
        _streetIssueButton.getView().setFrame(
            _padding.left + size.width + 10,
                box.height - _padding.bottom - streetIssueSize.height,
            streetIssueSize.width,
            streetIssueSize.height
        );
        _streetIssueButton.getView().setViewBox(0, 0, streetIssueSize.width, streetIssueSize.height);
    };

    this.changeContext = function(context) {
        if(context != _context) {
            _context = context;

            if(_contextViewController != null) {
                self.remove(_contextViewController);
            }

            switch(context) {
                case ChartsContext.CRIME:
                    _contextViewController = new UICrimeChartsViewController();
                    break;
                case ChartsContext.STREET_ISSUES:
                    _contextViewController = new UIStreetIssuesChartsViewController();
                    break;
            }

            var box = self.getView().getViewBox();

            _contextViewController.getView().setFrame(
                _padding.left,
                _padding.top,
                box.width - _padding.left - _padding.right,
                box.height - _padding.top - _menuHeight
            );
            _contextViewController.getView().setViewBox(
                0,
                0,
                    box.width - _padding.left - _padding.right,
                    box.height - _padding.top - _menuHeight
            );

            self.add(_contextViewController);
        }
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////
    var addBehavior = function() {
        _crimeButton.onClick(function() {
            _crimeButton.select();
            _crimeButton.getView().setBackgroundColor(model.getThemeModel().chartsMenuButtonSelectedBackgroundColor());
            _crimeButton.setTitleColor(model.getThemeModel().chartsMenuButtonSelectedTextColor());

            _streetIssueButton.deselect();
            _streetIssueButton.getView().setBackgroundColor(model.getThemeModel().chartsMenuButtonBackgroundColor());
            _streetIssueButton.setTitleColor(model.getThemeModel().chartsMenuButtonTextColor());

            self.changeContext(ChartsContext.CRIME);
        });

        _streetIssueButton.onClick(function() {
            _streetIssueButton.select();
            _streetIssueButton.getView().setBackgroundColor(model.getThemeModel().chartsMenuButtonSelectedBackgroundColor());
            _streetIssueButton.setTitleColor(model.getThemeModel().chartsMenuButtonSelectedTextColor());

            _crimeButton.deselect();
            _crimeButton.getView().setBackgroundColor(model.getThemeModel().chartsMenuButtonBackgroundColor());
            _crimeButton.setTitleColor(model.getThemeModel().chartsMenuButtonTextColor());

            self.changeContext(ChartsContext.STREET_ISSUES);
        });
    };

    var init = function() {
        self.getView().addClass("ui-charts-area-view-controller");
        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        self.getView().getSvg().style("pointer-events", "visiblePainted");

        self.getView().setDelegate(self);


        // Setup ui
        _crimeButton = new UIButtonViewController();
        _crimeButton.setTitle("Crime");
        _crimeButton.select();
        _crimeButton.getView().setBackgroundColor(model.getThemeModel().chartsMenuButtonSelectedBackgroundColor());
        _crimeButton.setTitleColor(model.getThemeModel().chartsMenuButtonSelectedTextColor());
        _crimeButton.getView().setCornerRadius(8);
        _crimeButton.setTitleSize(model.getThemeModel().bigTextSize());
        self.add(_crimeButton);

        _streetIssueButton = new UIButtonViewController();
        _streetIssueButton.setTitle("Street Issues");
        _streetIssueButton.getView().setBackgroundColor(model.getThemeModel().chartsMenuButtonBackgroundColor());
        _streetIssueButton.setTitleColor(model.getThemeModel().chartsMenuButtonTextColor());
        _streetIssueButton.getView().setCornerRadius(8);
        _streetIssueButton.setTitleSize(model.getThemeModel().bigTextSize());
        self.add(_streetIssueButton);


        addBehavior();
    } ();
}

Utils.extend(UIChartsAreaViewController, UIViewController);

var ChartsContext = {
    CRIME: "Crime",
    STREET_ISSUES: "Street Issues"
};