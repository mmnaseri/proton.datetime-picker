/**
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/8/16)
 */
/**
 * AngularJS module for demoing the component
 * @type {angular.Module}
 */
(function () {
    var module = angular.module('Demo', ['proton.datetime-picker']);

    module.run(function () {
        self && self.webView && self.webView.scrollView && (self.webView.scrollView.bounces = NO);
        angular.element(document.body).on("touchmove", function (event) {
            event.preventDefault();
        })
    });

    module.controller("MainController", function ($scope) {
        $scope.model = {};
        $scope.model.date = null;
        $scope.model.dateTime = new Date();
        $scope.model.time = {
            hour: 4,
            minute: 3
        };
    });
})();
