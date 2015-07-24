(function() {
    /**
     * slider service to provide the sliders for the controller
     */
    angular.module('mp3Player')
        .factory('sliderStorage', function() {

            /**
             * create the horizontal and the vertical slider for track animation and volume visualization
             */
            $('#vslider').slider({orientation: 'vertical', min: 0, max: 1, value: 1.0});
            $('#hslider').slider({orientation: 'horizontal', min: 0, max: 100, value: 0});

            /**
             * provide a get function for the controller to get the volume slider
             */
            return {
                getSlider: function() {
                    return $('#vslider').slider();
                }
            }
        });
})();