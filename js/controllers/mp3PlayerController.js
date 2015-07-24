(function() {
    var playerController = angular.module('mp3Player');


    playerController.controller('playerCtrl', ['$scope', 'sliderStorage', 'trackStorage', 'audioElementProvider',
        function ($scope, sliderStorage, trackStorage, audioElementProvider) {

            /**
             * get tracks from the service called trackStorage
             */
            trackStorage.get(function(data) {
                $scope.playList = data.tracks;
            });

            /**
             * mp3Player model
             * @type {{playList: (Array|*),
             * paused: boolean,
             * playing: boolean,
             * volumeSlider: *,
             * _actualTrack: *,
             * actualTrackIdx: number,
             * _shouldRepeat: boolean,
             * _shouldShuffle: boolean,
             * setTrack: setTrack,
             * playTrack: playTrack,
             * pauseTrack: pauseTrack,
             * stopTrack: stopTrack,
             * nextTrack: nextTrack,
             * prevTrack: prevTrack,
             * shuffleTracks: shuffleTracks,
             * changeVolume: changeVolume,
             * addActiveState: addActiveState, r
             * removeActiveState: removeActiveState}}
             */
            $scope.mp3Player =  {
                playList: $scope.playList,
                paused: false,
                playing: false,
                volumeSlider: sliderStorage.getSlider(),
                _actualTrack: audioElementProvider,
                actualTrackIdx: 0,
                _shouldRepeat: false,
                _shouldShuffle: true,

                /**
                 * set source of actual track.
                 * Add HTML5 audio element standard listener to it to use
                 * multiple features provided by the HTML5 audio element
                 * (i.e. duration, currentTime, etc.)
                 * If track has ended, check if repeat-flag is set.
                 */
                setTrack: function() {
                    this._actualTrack.src = $scope.playList[this.actualTrackIdx].url;
                    this._actualTrack.controls = false;
                    this._actualTrack.autoplay = false;
                    this._actualTrack.addEventListener('ended', function() {
                        if(this._shouldRepeat) {
                          this.playTrack();
                        }
                        this.nextTrack();
                    }.bind(this));
                },

                playTrack: function() {
                    /**
                     * needs to be checked because otherwise the source of the actual track
                     * would be set again and the existing progress would vanish.
                     */
                    if(!this.paused) {
                        this.setTrack();
                    }

                    /**
                     * set active state to the view element
                     * play the actual track
                     * set playing-flag to true.
                     */
                    this.addActiveState(this.actualTrackIdx);
                    this._actualTrack.play();
                    this.playing = true;
                },

                /**
                 * remove the active state of view element.
                 * Pause actual track and set pause-flag to true.
                 */
                pauseTrack: function() {
                    this.removeActiveState();
                    this._actualTrack.pause();
                    this.playing = false;
                    this.paused = true;
                },

                /**
                 * stop the actual track by pausing element and
                 * set the currentTime to zero.
                 * Set playing-flag to false and remove active state
                 * of the view element
                 */
                stopTrack: function() {
                    this._actualTrack.pause();
                    this._actualTrack.currentTime = 0;
                    this.playing = false;
                    this.removeActiveState();
                },

                /**
                 * play next track and set paused-flag to false.
                 * Firstly check, if index of next track is within
                 * the playlist. If so, increase the index if not,
                 * begin at the very start of the playlist.
                 * Play the right track
                 */
                nextTrack: function() {
                    this.paused = false;
                    if($scope.playList.length > this.actualTrackIdx + 1) {
                        this.actualTrackIdx ++;
                    } else {
                        this.actualTrackIdx = 0;
                    }
                    this.playTrack();
                },

                /**
                 * play previous track and set paused-flag to false.
                 * Check if index is within the playList.
                 * If this is the case decrease the index else
                 * get to the top of the playlist
                 */
                prevTrack: function() {
                    this.paused = false;
                    if(this.actualTrackIdx > 0) {
                        this.actualTrackIdx --;
                    } else {
                        this.actualTrackIdx = $scope.playList.length - 1;
                    }
                    this.playTrack();

                },

                /**
                 * shuffle the playlist if button state is active.
                 * Firstly check, if the playList is not empty and
                 * carry out the shuffling while the playlist contains items.
                 * Generate a random index from zero to last possible index.
                 * Decrease the index to get the next track from the playlist.
                 * Therefore loop through all indexes and swap the tracks
                 */
                shuffleTracks: function() {
                    if(this._shouldShuffle){
                        var playListLength = $scope.playList.length;
                        var tempVar;
                        var idx;

                        while (playListLength > 0) {
                            idx = Math.floor(Math.random() * playListLength);
                            playListLength--;
                            tempVar = $scope.playList[playListLength];
                            $scope.playList[playListLength] = $scope.playList[idx];
                            $scope.playList[idx] = tempVar;
                        }
                    }

                },

                /**
                 * if volume slider changes set new value to view
                 * and the general actualVolume to the new volume-value.
                 * The actualVolume gets adopted by the other songs.
                 */
                changeVolume: function() {
                    var that = this;
                    this.volumeSlider.on("change", function(){
                        var volume = $(this).data("slider").getValue().toFixed(2);
                        $('.volumeSlider').html(volume);
                        that._actualTrack.volume = volume;
                    });
                },

                /**
                 * add active state to the view element of the actual playing track
                 * @param trackIdx
                 */
                addActiveState: function(trackIdx) {
                    this.removeActiveState();
                    $scope.playList[trackIdx].active = true;
                },

                /**
                 * remove the active state by looping through all elements
                 * and taking the active state away from them
                 */
                removeActiveState: function() {
                    $scope.playList.forEach(function (track) {
                        track.active = false;
                    });
                }
            };

            $scope.mp3Player.changeVolume();



        }]);
})();
