/**
 * Copyright (c) 2016 Milad Naseri
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/21/16)
 */
(function () {
    var templates = {
        picker: "$/proton/datetime-picker/picker.html"
    };
    var module = angular.module('proton.datetime-picker', ['proton.multi-list-picker']);
    module.run(['$templateCache', function ($templateCache) {
        $templateCache.put(templates.picker, "<div class=\'proton-datetime-picker {{type}}\'>\n    <proton-multi-list-picker ng-model=\'model\' attachment=\'{{attachment}}\' done=\'done($model);\'>\n        <proton-multi-list-picker-list ng-if=\'type == \"dateTime\" || type == \"date\"\' alias=\'year\' static=\'true\' source=\'getYears()\'></proton-multi-list-picker-list>\n        <proton-multi-list-picker-list ng-if=\'type == \"dateTime\" || type == \"date\"\' alias=\'month\' static=\'true\' source=\'getMonths()\' cycle=\'true\' strict-matching=\'true\'></proton-multi-list-picker-list>\n        <proton-multi-list-picker-list ng-if=\'type == \"dateTime\" || type == \"date\"\' alias=\'day\' static=\'false\' source=\'getDays()\' cycle=\'true\' strict-matching=\'true\'></proton-multi-list-picker-list>\n        <proton-multi-list-picker-divider ng-if=\'type == \"dateTime\"\'></proton-multi-list-picker-divider>\n        <proton-multi-list-picker-list ng-if=\'type == \"dateTime\" || type == \"time\"\' alias=\'hour\' static=\'true\' source=\'getHours()\' cycle=\'true\'></proton-multi-list-picker-list>\n        <proton-multi-list-picker-list ng-if=\'type == \"dateTime\" || type == \"time\"\' alias=\'minute\' static=\'true\' source=\'getMinutes()\' cycle=\'true\'></proton-multi-list-picker-list>\n        <proton-multi-list-picker-list ng-if=\'(type == \"dateTime\" || type == \"time\") && hours == \"half\"\' alias=\'time\' static=\'true\'>\n            <proton-multi-list-picker-list-item>AM</proton-multi-list-picker-list-item>\n            <proton-multi-list-picker-list-item>PM</proton-multi-list-picker-list-item>\n        </proton-multi-list-picker-list>\n    </proton-multi-list-picker>\n</div>");
    }]);

    var oneOf = function (value, _) {
        var match = undefined;
        for (var i = 1; i < arguments.length; i ++) {
            if (value == arguments[i]) {
                match = value;
                break;
            }
        }
        return {
            orElse: function (value) {
                return match || value;
            }
        };
    };

    /**
     * courtesy of http://stackoverflow.com/a/32899854/1048157
     * @param yr
     * @returns {boolean}
     */
    var isLeap = function(yr) {
        if (yr > 1582) return !((yr % 4) || (!(yr % 100) && (yr % 400)));
        if (yr >= 0) return !(yr % 4);
        if (yr >= -45) return !((yr + 1) % 4);
        return false;
    };

    module.directive('protonDatetimePicker', ["$parse", function ($parse) {
        return {
            restrict: "E",
            require: "?ngModel",
            templateUrl: templates.picker,
            scope: {
                type: "@?",
                hours: "@?",
                done: "&?"
            },
            link: function ($scope, $element, $attrs) {
                var parentScope = $element.parent().scope();
                var ngModel = $parse($attrs.ngModel);
                var getter = ngModel.bind(ngModel, parentScope);
                var setter = ngModel.assign.bind(ngModel, parentScope);
                $scope.type = oneOf($scope.type, "dateTime", "date", "time").orElse("dateTime");
                $scope.hours = oneOf($scope.hours, "half", "full").orElse("half");
                $scope.months = oneOf($scope.months, "names", "abbreviations", "numbers").orElse("names");
                var months;
                var years;
                var hours = [];
                var minutes = [];
                (function () {
                    var labels = [];
                    switch ($scope.months) {
                        case "names":
                            labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            break;
                        case "abbreviations":
                            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            break;
                        case "numbers":
                            labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
                            break;
                    }
                    months = [];
                    angular.forEach(labels, function (label, index) {
                        months.push({
                            label: label,
                            value: index
                        });
                    });
                })();
                for (var i = 0; i < ($scope.hours == "half" ? 12 : 24); i ++) {
                    hours.push({
                        label: (i < 10 ? "0" : "") + i,
                        value: i
                    });
                }
                for (var j = 0; j < 60; j ++) {
                    minutes.push({
                        label: (j < 10 ? "0" : "") + j,
                        value: j
                    });
                }
                $attrs.$observe('attachment', function (value) {
                    $scope.attachment = value;
                });
                $scope.model = {};
                $scope.$watch(function () {
                    return getter();
                }, function (model) {
                    var now = new Date();
                    if (angular.isUndefined(model)) {
                        $scope.model = {
                            year: now.getFullYear(),
                            month: now.getMonth(),
                            day: now.getDate(),
                            actualHour: now.getHours(),
                            minute: now.getMinutes()
                        };
                        return;
                    }
                    if ($scope.type == "date" || $scope.type == "dateTime") {
                        if (!(model instanceof Date)) {
                            model = now;
                            setter(model);
                        }
                        $scope.model.year = model.getFullYear();
                        $scope.model.month = model.getMonth();
                        $scope.model.day = model.getDate();
                        $scope.model.actualHour = model.getHours();
                        $scope.model.minute = model.getMinutes();
                    } else {
                        if (!angular.isObject(model)) {
                            model = {};
                            setter(parentScope, model);
                        }
                        if (!angular.isNumber(model.hour)) {
                            model.hour = now.getHours();
                        }
                        if (!angular.isNumber(model.minute)) {
                            model.minute = now.getMinutes();
                        }
                        $scope.model.actualHour = model.hour;
                        $scope.model.minute = model.minute;
                    }
                    $scope.$broadcast('protonDatetimePicker:changed', $scope.model, model);
                }, $scope.type == "time");
                $scope.$on('protonDatetimePicker:changed', function () {
                    if (!$scope.model) {
                        return;
                    }
                    if ($scope.hours == 'half') {
                        $scope.model.hour = $scope.model.actualHour % 12;
                        $scope.model.time = $scope.model.actualHour > 11 ? "PM" : "AM";
                    } else {
                        $scope.model.hour = $scope.model.actualHour;
                    }
                    years = [];
                    for (var year = $scope.model.year - 100; year <= $scope.model.year + 50; year ++) {
                        years.push({
                            label: "" + year,
                            value: year
                        });
                    }
                });
                $scope.$watch('model', function (model) {
                    var date;
                    var value;
                    if ($scope.type == "dateTime") {
                        date = new Date();
                        date.setFullYear(model.year);
                        date.setMonth(model.month);
                        date.setDate(model.day);
                        date.setHours(model.hour + ($scope.hours == "half" && model.time == "PM" ? 12 : 0));
                        date.setMinutes(model.minute);
                        value = date;
                    } else if ($scope.type == "date") {
                        date = new Date();
                        date.setFullYear(model.year);
                        date.setMonth(model.month);
                        date.setDate(model.day);
                        value = date;
                    } else {
                        value = {
                            hour: model.hour + ($scope.hours == "half" && model.time == "PM" ? 12 : 0),
                            minute: model.minute
                        };
                    }
                    setter(value);
                }, true);
                $scope.getYears = function () {
                    return years;
                };
                $scope.getMonths = function () {
                    return months;
                };
                $scope.getDays = function () {
                    var daysInMonth = [31, isLeap($scope.model.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][$scope.model.month];
                    var days = [];
                    for (var day = 1; day <= daysInMonth; day ++) {
                        days.push(day);
                    }
                    return days;
                };
                $scope.getHours = function () {
                    return hours;
                };
                $scope.getMinutes = function () {
                    return minutes;
                };
            }
        };
    }]);
})();