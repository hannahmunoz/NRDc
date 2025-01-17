/*  Modified: 07/13/2016
    Changes: All instances of 'input' have been changed to text area for the
             purposes of making expandable text inputs */

angular.module('ionMdInput', [])

.directive('ionMdInput', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    template: '<label class="item item-input item-md-label">' +
      '<textarea class="md-input"/>' +      
      '<span class="input-label"></span>' +
      '<div class="highlight"></div>' +
      '<text-area-size><text-area-size>' +
      '</label>',
    compile: function(element, attr) {

      var highlight = element[0].querySelector('.highlight');
      var highlightColor;
      if (!attr.highlightColor) {
        highlightColor = 'calm';
      } else {
        highlightColor = attr.highlightColor;
      }
      highlight.className += ' highlight-' + highlightColor;

      var label = element[0].querySelector('.input-label');
      label.innerHTML = attr.placeholder;

      /*Start From here*/
      var input = element.find('textarea');
      angular.forEach({
        'name': attr.name,
        'type': attr.type,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'required': attr.required,
        'ng-required': attr.ngRequired,
        'ng-minlength': attr.ngMinlength,
        'ng-maxlength': attr.ngMaxlength,
        'ng-pattern': attr.ngPattern,
        'ng-change': attr.ngChange,
        'ng-trim': attr.trim,
        'ng-blur': attr.ngBlur,
        'ng-focus': attr.ngFocus,
      }, function(value, name) {
        if (angular.isDefined(value)) {
          input.attr(name, value);
        }
      });

      var cleanUp = function() {
        ionic.off('$destroy', cleanUp, element[0]);
      };
      // add listener
      ionic.on('$destroy', cleanUp, element[0]);

      return function LinkingFunction($scope, $element) {

        var mdInput = $element[0].querySelector('.md-input');

        var dirtyClass = 'used';

        var reg = new RegExp('(\\s|^)' + dirtyClass + '(\\s|$)');

        //Here is our toggle function
        var toggleClass = function() {
          if (this.value === '') {
            this.className = mdInput.className.replace(reg, ' ');
          } else {
            this.classList.add(dirtyClass);
          }
        };

        //Lets check if there is a value on load
        ionic.DomUtil.ready(function() {
          if (mdInput.value === '') {
            mdInput.className = mdInput.className.replace(reg, ' ');
          } else {
            mdInput.classList.add(dirtyClass);
          }
        });
        // Here we are saying, on 'blur', call toggleClass, on mdInput
        ionic.on('blur', toggleClass, mdInput);

      };

    }
  };
});
