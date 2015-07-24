if (!Function.prototype.bind) {
	Function.prototype.bind = function (scope) {
		var f = this;

		return function () {
			f.apply(scope, arguments);
		}
	}
}

(function ($, window) {
    var AbstractSlider = function AbstractSlider(config) {
        this._$view = config.view;

        // create dom children
        this._$view .append('<div class="track"></div><div class="thumb"></div>');

        this._$track = this._$view.find('.track');
        this._$thumb = this._$view.find('.thumb');

        //check config
        this._value = (isNaN(config.value) ? 0 : config.value);
        this._minValue = (isNaN(config.min) ? 0 : config.min);
        this._maxValue = (isNaN(config.max) ? 100 : config.max);

        this._trackWidth = this._$track[this._sizeMethodName]();
        this._thumbWidth = this._$thumb[this._sizeMethodName]();
        this._trackLeft = this._$track.offset()[this._positionPropertyName];

        this._$view.on('mousedown', this._onMouseDownHandler.bind(this));

        //init value

        //temporarily api - replaced
        //this._$view[0].setValue = this.setValue.bind(this); //public interface, only temporarily
        //this._$view[0].getValue = this.getValue.bind(this); //public interface, only temporarily

        this.setValue(this._value);
    };

    AbstractSlider.prototype.setValue = function setValue(newValue) {
        newValue = Math.max(this._minValue, Math.min(newValue, this._maxValue));
        this._value = newValue;
        // position updaten

        this._$thumb.css(this._positionPropertyName, this._valueToPosition(newValue));
        this._$view.trigger('change');
    };

    AbstractSlider.prototype._onMouseDownHandler = function _onMouseDownHandler(e) {
        this._$view.addClass('active');
        this._$thumb.addClass('animated');
        var isAnimated = true;
        var dragOffsetX = 0;
        if(e.target == this._$thumb[0]) {
            //thumb
            dragOffsetX = e[this._mousePositionProperty] - this._$thumb.offset()[this._positionPropertyName];
        } else {
            //track
            dragOffsetX = this._thumbWidth/2;
            this._setValueByPageX(e[this._mousePositionProperty], dragOffsetX);
        }

        var that = this; //now we save this instead of bind
        $(window).on('mousemove', function(e) {
            if(isAnimated) {
                isAnimated = false;
                that._$thumb.removeClass('animated');
            }
            that._setValueByPageX(e[that._mousePositionProperty], dragOffsetX);
            e.preventDefault();
        });

        $(window).on('mouseup', function(e) {
            $(window).off('mousemove').off('mouseup');
            that._$view.removeClass('active');
            e.preventDefault();
        });
        e.preventDefault(); //otherwise text cursor
    };

    AbstractSlider.prototype.getValue = function getValue() {
        return this._value;
    };

    AbstractSlider.prototype._valueToPosition = function _valueToPosition(value) {
        var position = (value - this._minValue)/(this._maxValue - this._minValue) * (this._trackWidth - this._thumbWidth); //our thumb position
        return position;
    };

    AbstractSlider.prototype._positionToValue = function _positionToValue(position) {
        return position/(this._trackWidth - this._thumbWidth) * (this._maxValue - this._minValue) + this._minValue;
    };

    AbstractSlider.prototype._setValueByPageX = function _setValueByPageX(pageX, dragOffsetX) {
        //min: 0
        //max: this._trackWidth - thumbWidth
        var position = Math.max(0, Math.min(pageX - this._trackLeft - dragOffsetX, this._trackWidth - this._thumbWidth));
        this.setValue(this._positionToValue(position));
    };

    var VSlider = function VSlider(config) {
        this._positionPropertyName = 'top';
        this._sizeMethodName = 'height';
        this._mousePositionProperty = 'pageY';
        AbstractSlider.apply(this, arguments);
    };

    VSlider.prototype = Object.create(AbstractSlider.prototype);
    VSlider.constructor = VSlider;

    VSlider.prototype.newFunction = function() {

    };

    var HSlider = function HSlider(config) {
        this._positionPropertyName = 'left';
        this._sizeMethodName = 'width';
        this._mousePositionProperty = 'pageX';
        AbstractSlider.apply(this, arguments);
    };

    HSlider.prototype = Object.create(AbstractSlider.prototype);
    HSlider.constructor = HSlider;

    jQuery.fn.slider = function(config) {
        var returnValue = this;
        this.each(function() {
            //this == Array with DOM Elements
            var $view = $(this);
            var data = $view.data("slider"); //get slider object
            if(typeof config == "string") { //allow direkt function call (some jquery plugins allow this, e.g. Bootstrap jQuery Plugins)
                if(!data) {
                    throw new Error("jquery.slider Trying to call method or property of not existing slider.");
                }
                if(!config in data || config.indexOf('_') == 0) {
                    throw new Error("jquery.slider Trying to call private or not existing method or property.");
                }
                returnValue = (data[config]());
            } else if(!data) { //create slider

                var sliderConfig = $.extend({view: $view}, jQuery.fn.slider.DEFAULT_CONFIG, config);
                if(sliderConfig.orientation == jQuery.fn.slider.ORIENTATION.HORIZONTAL) {
                    $view.data("slider", new HSlider(sliderConfig));
                } else if(sliderConfig.orientation == jQuery.fn.slider.ORIENTATION.VERTICAL) {
                    $view.data("slider", new VSlider(sliderConfig));
                } else {
                    throw new Error("jquery.slider Unkown config parameter orientation: " + config.orientation);
                }
            }
        });
        return returnValue;
    };
    jQuery.fn.slider.ORIENTATION = {VERTICAL: "vertical", HORIZONTAL: "horizontal"};
    jQuery.fn.slider.DEFAULT_CONFIG = {orientation: jQuery.fn.slider.ORIENTATION.VERTICAL, min: 0, max: 1, value: 0};


}(jQuery, window));