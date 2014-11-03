/**
 * @class UIButtonViewController
 * @description
 *
 * @constructor
 */
function UIButtonViewController() {
    UIViewController.call(this);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _title;
    var _image;

    var _defaultViewBox = {x: 0, y: 0, width: 50, height: 50};

    var _singleClickTimeout = null;

    var _singleClickTimeInterval = 400;

    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {
        _image.getView().setFrame(0, 0, self.getView().getViewBoxWidth(), self.getView().getViewBoxHeight());
        _image.getView().setViewBox(0, 0, self.getView().getViewBoxWidth(), self.getView().getViewBoxHeight());

        // Call super
        super_viewDidAppear.call(self);
    };

    /**
     *
     * @param title
     */
    this.setTitle = function(title) {
        var d3Svg = self.getView().getSvg();

        // Update
        _title = d3Svg.selectAll(".title").data([title]);
        _title.text(title);

        // Enter
        _title.enter()
            .append("text")
            .classed("title", true)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("dy", "0.5em")
            .attr("text-anchor", "middle")
            .text(title);
    };

    /**
     *
     * @returns {*}
     */
    this.getTitle = function() {
        return _title.text();
    };

    /**
     * @param path [css icon class name]
     */
    this.setImage = function(path) {
        _image.setImagePath(path);
    };

    /**
     *
     * @param callBack
     * @param params
     */
    this.onClick = function(callBack, params) {
        self.getView().on("click",
            function(p){
                clearTimeout(_singleClickTimeout);
                _singleClickTimeout = window.setTimeout(
                    function(){callBack(p);}, _singleClickTimeInterval);
            },
            params);
    };


    this.onDoubleClick = function(callBack, params) {
        self.getView().on("dblclick", function(p){
            clearTimeout(_singleClickTimeout);
            callBack(p);
        }, params);
    };

    /**
     *
     */
    this.select = function() {
        self.getView().addClass(UIButtonStatus.SELECTED);
    };

    /**
     *
     */
    this.deselect = function() {
        self.getView().removeClass(UIButtonStatus.SELECTED);
    };

    /**
     *
     */
    this.isSelected = function() {
        self.getView().hasClass(UIButtonStatus.SELECTED);
    };


    //////////////////// PRIVATE METHODS ///////////////////////
    var init = function() {


        // Add button css class
        self.getView().addClass("ui-button-view-controller");



        // Setup default size
        self.getView().setFrame(0, 0, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Setup image controller
        _image = new UIImageViewController(self);
        self.add(_image);
        self.setTitle("");

    } ();
}

Utils.extend(UIButtonViewController, UIViewController);

var UIButtonStatus = {
    NORMAL: "normal",
    SELECTED: "selected"
};