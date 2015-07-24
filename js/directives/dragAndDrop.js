(function() {
    var app = angular.module('mp3Player');

    app.directive('draggable', function(){

        return function($scope, $element) {

            /**
             * element[0] is the native JS object.
             * Implies all HTML-Elements in scope
             */
            var element = $element[0];

            /**
             * set state 'draggable' to all HTML-elements
             */
            element.draggable = true;

            /**
             * add class 'drag' to item
             * set up the dataTransfer: the DataTransfer object captures the data,
             * that is being dragged during the drag and drop operation
             */
            element.addEventListener(
                'dragstart',
                function(event) {
                    /**
                     * Specify the effects that are allowed for this drag.
                     * 'move' enables an item to get moved around
                     */
                    event.dataTransfer.effectAllowed = 'move';
                    /**
                     * set id of dragged object
                     */
                    event.dataTransfer.setData('Text', this.id);
                    return false;
                },
                false
            );
           }
    });

    app.directive('droppable', function() {
        return function($scope, $element) {

            var element = $element[0];

            element.addEventListener(
                'dragover',
                function(event) {
                    /**
                     * holds the item back from snapping to its previous position
                     */
                    if (event.preventDefault) event.preventDefault();
                    return false;
                },
                false
            );

            /**
             * set class 'over' to item where the draggable item gets
             * dragged over
             */
            element.addEventListener(
                'dragenter',
                function() {
                    this.classList.add('over');
                    return false;
                },
                false
            );

            /**
             * remove the class 'over' from item, when the draggable
             * object is not lying on top if it anymore
             */
            element.addEventListener(
                'dragleave',
                function() {
                    this.classList.remove('over');
                    return false;
                },
                false
            );

            element.addEventListener(
                'drop',
                function(event) {

                    /**
                     * remove class 'over' when item is dropped
                     */
                    this.classList.remove('over');

                    /**
                     * get dragged element by id
                     * @type {HTMLElement}
                     */
                    var item = document.getElementById(event.dataTransfer.getData('Text'));

                    /**
                     * insert item after the element it lays over
                     */
                    this.parentNode.insertBefore(item, this.nextSibling);


                    return false;
                },
                false
            );

        }
    });

})();