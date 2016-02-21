"use strict";
/**
 * __author__ = 'ilov3'
 */
function DeleteModalBaseController($scope, $uibModalInstance, $state, ngNotify, resource) {
    this.cancel = function () {
        $uibModalInstance.close();
    };
    this.confirm = function(){
        resource.$delete(function(data){
            ngNotify.set(resource.name + ' successfully deleted!', 'success');
            $uibModalInstance.close();
        })
    };
    $scope.$on('modal.closing', function () {
        $state.go('^')
    });
}