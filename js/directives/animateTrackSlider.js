(function() {
    var app = angular.module('mp3Player');

    app.directive('animateTrackSlider', function($interval){

        return {
            restrict: "A",
            scope: true,
            link: function($scope) {

                /**
                 * scope variable to display the current- and absolute time in the view
                 * @type {number}
                 */
                $scope.currentTrackTime = 0;
                $scope.trackDuration = 0;

                /**
                 * event is fired when track gets played - in chrome all 250ms
                 * assign track duration and currentTime of track to scope and
                 * display them in the view. Set these values also to the animateTrackSlider
                 * object. Call the time-format function to get the displayed time formatted.
                 * Call display-trackTime function to visualize the playProgress with the thumb
                 */
                $scope.mp3Player._actualTrack.addEventListener('timeupdate', function() {
                    $scope.animateTrackSlider.trackDuration = $scope.mp3Player._actualTrack.duration;
                    $scope.trackDuration = $scope.timeFormater.formatTime($scope.animateTrackSlider.trackDuration);

                    $scope.animateTrackSlider.currentTime = $scope.mp3Player._actualTrack.currentTime;
                    $scope.currentTrackTime = $scope.timeFormater.formatTime($scope.animateTrackSlider.currentTime);
                    $scope.animateTrackSlider.displayActualTrackTime();
                });

                /**
                 * format the time to 00.00
                 * @type {{formatTime: formatTime}}
                 */
                $scope.timeFormater = {
                    formatTime: function(value) {
                        /**
                         * crops the decimal places because the time is given
                         * in milliseconds
                         */
                        var roundedVal = Math.round(value);
                        /**
                         * move the decimal point two places to the left to receive the
                         * format 00.00
                         */
                        var shiftedVal = roundedVal / 100;
                        /**
                         * should add 0 if one is missing
                         */
                        return shiftedVal < 10 ? '0' + shiftedVal : shiftedVal;

                    }
                };

                /**
                 * object animateTrackSlider
                 * @type {{currentTime: number,
                 * trackDuration: number,
                 * thumb: (*|jQuery|HTMLElement),
                 * slider: (*|jQuery|HTMLElement),
                 * percentTrackPath: number,
                 * displayActualTrackTime: displayActualTrackTime,
                 * calculateSliderLengthWithThumbOffset: calculateSliderLengthWithThumbOffset,
                 * setSoundOnThumbPull: setSoundOnThumbPull,
                 * setTrackToThumbPosition: setTrackToThumbPosition,
                 * animateThumb: animateThumb,
                 * updateTimeValues: updateTimeValues}}
                 */
                $scope.animateTrackSlider = {

                    currentTime: 0,
                    trackDuration: 0,
                    thumb: $($('#hslider').children()[1]),
                    slider:  $('#hslider'),
                    percentTrackPath: 0,

                    displayActualTrackTime: function() {
                        /**
                         * percent amount of trackTime that was already played
                         */
                        var percentTimeProgress = 100 / (this.trackDuration / this.currentTime);

                        /**
                         * multiply percent amount of actual track with one percent of the slider track.
                         * I.e. if track is played to 10%, the slider value also gets multiplied with it
                         * and therefor is also 10%
                         */
                        this.percentTrackPath = ((this.calculateSliderLengthWithThumbOffset() / 100) * percentTimeProgress);

                        this.animateThumb();

                        this.setSoundOnThumbPull();

                        this.updateTimeValues();
                    },

                    /**
                     * subtract the thumb width from the slider width so that
                     * the thumb does nt float out of the range.
                     * @returns {number}
                     */
                    calculateSliderLengthWithThumbOffset: function() {
                        return this.slider.width() - this.thumb.width();
                    },

                    setSoundOnThumbPull: function() {
                        var that = this;
                        this.slider.click(function(e){
                            /**
                             * measure the offset of the container.
                             * Body has 40px padding
                             * @type {*|jQuery}
                             */
                            var parentOffset = $(this).parent().offset();
                            /**
                             * get leftOffset of body
                             * @type {number}
                             */
                            var thumbPosition = e.pageX - parentOffset.left;

                            /**
                             * thumb position is the x-coordinate of the mouse-click
                             * minus the left Offset
                             */
                            that.thumb.css( "left", thumbPosition);
                            that.setTrackToThumbPosition(thumbPosition);
                        });
                    },

                    /**
                     * Calculate the percent amount of the position, the thumb is located.
                     * Calculate one percent of the track according to the slider-length
                     * set trackProgress to same percent value as the thumb
                     * @param thumbPosition
                     */
                    setTrackToThumbPosition: function(thumbPosition) {
                        this.thumb.stop();
                        var percentThumbPosition = (100 / (this.calculateSliderLengthWithThumbOffset() / thumbPosition));
                        var trackPercent = this.calculateSliderLengthWithThumbOffset() / this.trackDuration;
                        $scope.mp3Player._actualTrack.currentTime = (trackPercent * percentThumbPosition);
                    },

                    /**
                     * animate track and set it to its´ correspondent value
                     */
                    animateThumb: function() {
                        this.thumb.animate({
                            left: "+" + this.percentTrackPath
                        }, 100);
                    },

                    /**
                     * set interval to keep the view updated
                     */
                    updateTimeValues: function() {
                        $scope._intervall = $interval(function(){
                        }, 100);
                    }
                };

            }
        };
    });

})();

