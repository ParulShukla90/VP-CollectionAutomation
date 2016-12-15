taxiapp.directive('maxNum', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            //console.log('input linked');
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '').slice(0,3);
                //console.log(value);
                var max = parseInt($attrs.max);
                //console.log('max,val',max,value);
                if(parseInt(value) > max){
                    $element.val(max);
                }else if(value<=0){
                    $element.val(0);
                }
                else{ 
                    $element.val(value);
                }
                $scope.$apply();
            };
            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                    return;
                }
                $browser.defer(listener); 
            });
            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
}).directive('currencyInput', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            return ctrl.$parsers.push(function(inputValue) {
                var inputVal = element.val();
                //clearing left side zeros
                while (inputVal.charAt(0) == '0') {
                    inputVal = inputVal.substr(1);
                }
                inputVal = inputVal.replace(/[^\d.\',']/g, '');
                var point = inputVal.indexOf(".");
                if (point >= 0) {
                    inputVal = inputVal.slice(0, point + 3);
                }
                var decimalSplit = inputVal.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];
                intPart = intPart.replace(/[^\d]/g, '');
                //if (intPart.length > 3) {
                //    var intDiv = Math.floor(intPart.length / 3);
                //    while (intDiv > 0) {
                //        var lastComma = intPart.indexOf(",");
                //        if (lastComma < 0) {
                //            lastComma = intPart.length;
                //        }
                //        if (lastComma - 3 > 0) {
                //            intPart = intPart.slice(0, lastComma - 3) + "," + intPart.slice(lastComma - 3);
                //        }
                //        intDiv--;
                //    }
                //}
                if (decPart === undefined) {
                    decPart = "";
                } else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;
                //console.log(res, '---------', inputValue)
                if (res != inputValue) {
                    ctrl.$setViewValue(res);
                    ctrl.$render();
                }
                return res;
            });

        }
    };
}).directive('datepickerPopup', function (){
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
    }
  }
});/*.directive('currencyInput', function($filter, $browser) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            //return ctrl.$parsers.push(function(inputValue) {
             var listener = function() {
                console.log('listener called')
                var inputVal = element.val();
                //clearing left side zeros
                while (inputVal.charAt(0) == '0') {
                    inputVal = inputVal.substr(1);
                }
                inputVal = inputVal.replace(/[^\d.\',']/g, '');
                var point = inputVal.indexOf(".");
                if (point >= 0) {
                    inputVal = inputVal.slice(0, point + 3);
                }
                var decimalSplit = inputVal.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];
                intPart = intPart.replace(/[^\d]/g, '');
                if (intPart.length > 3) {
                    var intDiv = Math.floor(intPart.length / 3);
                    while (intDiv > 0) {
                        var lastComma = intPart.indexOf(",");
                        if (lastComma < 0) {
                            lastComma = intPart.length;
                        }
                        if (lastComma - 3 > 0) {
                            intPart = intPart.slice(0, lastComma - 3) + "," + intPart.slice(lastComma - 3);
                        }
                        intDiv--;
                    }
                }
                if (decPart === undefined) {
                    decPart = "";
                } else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;
                element.val(res);
            };
            console.log('linking');
            element.bind('change', listener);
            element.bind('keydown', function(event) {
                $browser.defer(listener); 
            });
            element.bind('paste cut', function() {
                $browser.defer(listener);
            });
            listener();
        }
    };
})*/