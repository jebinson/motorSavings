var app = angular.module('app', [])

.service('appService', ['$http', '$q', function($http, $q)
{
	var deffered = $q.defer();

	$http.get('scripts/motordetails.json').then(function (data) {
		deffered.resolve(data);
	});

	this.getData = function () {
		return deffered.promise;
	}
}])

.controller('appCtrl', ['$scope', 'appService', function($scope, appService){

	var promise = appService.getData();
	promise.then(function (data) {
		$scope.motorDetails = data.data;
		motorData($scope.motorDetails);
	});
	
	var motorData = function (data) {
		for (var i = 0; i < data["IE Rating"].length ; i++) {
			var ie = data["IE Rating"][i];
			console.log(data.motorData[ie]);
		}
	}

}])