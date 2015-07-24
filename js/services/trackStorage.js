(function() {
    /**
     * service to assign tracks to the controller
     */
    angular.module('mp3Player')
        .factory('trackStorage', function($http) {
            /**
             * get function to call in controller to get all the tracks from the assets file
             * $http-service from angular that loads the tracks
             */
            return {
                get: function(data) {
                    $http.get('assets/tracks.json').success(data);
                }
            }
        });
})();