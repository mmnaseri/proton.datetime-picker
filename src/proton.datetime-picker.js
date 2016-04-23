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
    var module = angular.module('proton.datetime-picker', []);
    module.run(['$templateCache', function ($templateCache) {
        $templateCache.put(templates.picker, "<div class=\'proton-multi-list-picker {{attachment}}\'>\n    <span ng-transclude class=\'proton-multi-list-picker-contents\'></span>\n    <div class=\'before\'></div>\n    <div class=\'container\'>\n        <ul class=\'lists\'>\n            <li class=\'toolbar\'>\n                <a class=\'toolbar-button\' ng-click=\'done({$model: model})\'>Done</a>\n            </li>\n            <li class=\'before-lists\' ng-init=\'first = false\'></li>\n            <li ng-repeat=\'list in items track by $index\'\n                class=\'list-container {{$index == 0 || first ? \"first\" : \"\"}} {{$index == items.length - 1 ? \"last\" : \"\"}}\'\n                data-index=\'{{$index}}\' proton-multi-list-motion data-motion-start=\'motionStart($event)\'\n                data-motion-change=\'motionChange($event)\' data-motion-end=\'motionEnd($event)\'>\n            <span class=\'divider {{!list.value ? \"blank\" : \"\"}}\' ng-if=\'list.$divider\' ng-init=\'first = !list.value\'>\n                <span ng-if=\'!bindHtml\' ng-bind=\'list.value\'></span>\n                <span ng-if=\'bindHtml\' ng-bind-html=\'list.value\'></span>\n            </span>\n                <ul class=\'list\' ng-if=\'!list.$divider\' data-selected=\'{{list.selected}}\'>\n                    <li class=\'item {{item.index == list.selected ? \"selected\" : \"\"}} {{(!list.cycle && list.selected &lt; 3) ? \"offset-down-\" + (3 - list.selected) : \"\"}} {{(list.cycle ? item.cycleIndex : item.index) &lt; list.selected && (list.cycle ? item.cycleIndex : item.index) &gt;= list.selected - 3 ? \"distance-\" + (list.selected - (list.cycle ? item.cycleIndex : item.index)) : \"\"}} {{(list.cycle ? item.cycleIndex : item.index) &gt; list.selected && (list.cycle ? item.cycleIndex : item.index) &lt;= list.selected + 3 ? \"distance-\" + ((list.cycle ? item.cycleIndex : item.index) - list.selected) : \"\"}}\'\n                        ng-repeat=\'item in list.view track by $index\' data-index=\'{{item.index}}\'\n                        ng-click=\'select(list, item.index)\' style=\'width: {{list.width}}px;\'>\n                        <span ng-if=\'item.$placeholder\'></span>\n                        <span ng-if=\'!item.$placeholder && !bindHtml\' ng-bind=\'item.label\'></span>\n                        <span ng-if=\'!item.$placeholder && bindHtml\' ng-bind-html=\'item.label\'></span>\n                    </li>\n                </ul>\n            </li>\n            <li class=\'after-lists\'></li>\n        </ul>\n    </div>\n    <div class=\'after\'></div>\n</div>");
    }]);
    module.directive('protonDatetimePicker', [function () {

    }]);
})();