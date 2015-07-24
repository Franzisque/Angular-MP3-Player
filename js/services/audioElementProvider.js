(function() {
    /**
     * service for the HTML5 audio element
     */
    angular.module('mp3Player')
        .factory('audioElementProvider', function($document) {
            /**
             * create an audio element and append it to the dom.
             * make it accessible for the controller
             */
            return $document[0].createElement('audio');

        });
})();