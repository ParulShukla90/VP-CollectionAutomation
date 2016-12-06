taxiapp.directive('maxNum', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            console.log('input linked');
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '').slice(0,3);
                //console.log(value);
                var max = parseInt($attrs.max);
                //console.log('max,val',max,value);
                if(parseInt(value) > max){
                    $element.val(max);
                }else if(value<=0){
                    $element.val(1);
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
})