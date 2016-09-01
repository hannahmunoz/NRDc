angular.module('app.directives', [])

//http://stackoverflow.com/questions/16207202/required-attribute-not-working-with-file-input-in-angular-js

.directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      //change event is fired when file is selected
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
})


//throws a flag when the last element is loaded from an ng-repeat
.directive('repeatDirective', function(){
    return function(element, scope, attrs){
        scope = angular.element(element)[0];
        if (scope.$last){
            scope.$emit('LastElemLoaded');
        }
    };
})


//directive for expandable input

/*Function: Adds a hidden div which checks the expected size of
            our active text-area & resizes text area (sibling-node) appropriately
            and offsets input label
*/

.directive('textAreaSize', function(){
    
    var link = function(scope, element, attrs){
        var textSize = element[0];                          //hidden div holding text 
                                                            // for height measurement
        var localTxt = element.parent()[0].childNodes[0];   //text area to be modified
        var label = element.parent()[0].childNodes[1];      //input label eg 'name'
        
        
        //on intial load reasize any already populated text fields
        localTxt.onclick = function(){
            //update data in localdiv to be localTxt height
            textSize.innerHTML = localTxt.value + "<br/>";
            localTxt.style.height = textSize.offsetHeight + 'px';
            
            //maintain the offset of the input label so it remains above the text box
            label.style = ' transform: translate3d(0,-' + (textSize.offsetHeight + 25) + 'px, 0) scale(.9); transition: all 0s linear;';
        }
        
        
        localTxt.oninput = function(){
            
            //update data in localdiv to be localTxt height
            textSize.innerHTML = localTxt.value + "<br/>";
            localTxt.style.height = textSize.offsetHeight + 'px';
            
            //maintain the offset of the input label so it remains above the text box
            label.style = ' transform: translate3d(0,-' + (textSize.offsetHeight + 25) + 'px, 0) scale(.9); transition: all 0s linear;';
        }
    };
    
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="text-format-mirror"></div>',
        link:link
    }
})


//directive declaring and controlling
// a floating action button cluster
.directive('fabCluster', function(){
    
    function HideController($scope, $rootScope, $ionicModal){
        
        $scope.active = false;
        
        $scope.toggleActive = function(){
                $scope.active = true;
        };
        
        $scope.toggleInactive = function(){
                $scope.active = false;
                console.log("called");
        };
        
    }

    
    return{
        restrict: 'E',
        templateUrl: 'templates/directive_templates/fabCluster.html',
        controller: HideController
    }
    
})

//Extracted from GitHub
.directive('clickOff', function($parse, $document) {
    var dir = {
        compile: function($element, attr) {
          // Parse the expression to be executed
          // whenever someone clicks _off_ this element.
          var fn = $parse(attr["clickOff"]);
          return function(scope, element, attr) {
            // add a click handler to the element that
            // stops the event propagation.
            element.bind("click", function(event) {
              event.stopPropagation();
            });
            angular.element($document[0].body).bind("click", function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
          };
        }
      };
    return dir;
})


.directive('deletable', function(){
    
    function deletableController($scope, $rootScope, SaveNew, $ionicHistory, DynamicPage, ListOrganizationService){
        $scope.deletable = false;
        
        //determine if my current view in deletable
        //by checking for membership in unsyncedJSON
        $scope.isDeletable = function(){
            for(var category in $rootScope.unsyncedJSON){
                for(var unsEntry = 0; 
                    unsEntry < $rootScope.unsyncedJSON[category].length; 
                    unsEntry++){
                        if($scope.JSON === $rootScope.unsyncedJSON[category][unsEntry]){
                            console.log ("hello")
                            console.log ($rootScope.unsyncedJSON[category][unsEntry], $scope.JSON)
                            $scope.deletable = true;
                    }
                }
            
            }
            
        };
        
        //delete the current view JSON from the list of unsynced items
        $scope.deleteView = function(){
            //variables            
            $scope.JSON = DynamicPage.getJSON();
            $scope.title = ListOrganizationService.getParentTitle(DynamicPage.getTitle());
            
            $ionicHistory.goBack();
            SaveNew.deleteJSON($scope.JSON.Name, $rootScope.unsyncedJSON[$scope.title],
                               $rootScope.chosenJSONlist, $rootScope.listJSON,$scope.title);
            
            $rootScope.back();
        };
        
        $scope.deletePeople = function(){
            SaveNew.deletePeople(($scope.JSON['First Name'] + $scope.JSON['Last Name']), 
                                 $rootScope.unsyncedJSON[DynamicPage.getTitle()],
                               $rootScope.chosenJSONlist, $rootScope.listJSON);
            $ionicHistory.goBack();
        };
            
        };
    
    
    
    return{
        restrict: 'A',
        controller: deletableController
    }


})

//http://stackoverflow.com/questions/30537886/error-ngmodeldatefmt-expected-2015-05-29t190616-693209z-to-be-a-date-a/35014420
.directive('dateInput', function(){
    return {
        restrict : 'A',
        scope : {
            ngModel : '='
        },
        link: function (scope) {
            if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
        }
    }
})

// .directive('spinnerInput', function(){
//     return {
//         restrict : 'A',
//         scope : {
//             ngModel : '='
//         },
//         link: function (scope) {
//             if (!angular.isUndefined (scope.ngModel)){
//                 if (!angular.isString (scope.ngModel)){
//                    scope.ngModel = JSON.stringify (scope.ngModel);
//                 }
//                 else{
//                     scope.ngModel = parseInt (scope.ngModel); 
//                 }
//             }
//             else{
//                 if (scope.ngModel) scope.ngModel = null;
//             }
//         }
//     }
// });




// .directive('blankDirective', [function(){

// }]);

