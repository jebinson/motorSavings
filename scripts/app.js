var app = angular.module('app', ["kendo.directives"])

.constant('motorMaster', {
	rating:["","0.12","0.18","0.2","0.25","0.37","0.4","0.55","0.75",
	"1.1","1.5","2.2","3","4","5.5","7.5","11","15","18.5","22","30",
	"37","45","55","75","90","110","132","160","200","250","315","355",
	"400","450","500"],
	pole:["","2 pole","4 pole","6 pole","8 pole"],
	ieRating:["","IE1","IE2","IE3","IE4"]
})

.service('appService', ['$http', '$q', function($http, $q)
{
	var deffered = $q.defer();

	$http.get('https://raw.githubusercontent.com/jebinson/motorSavings/master/scripts/motordetails.json').then(function (data) {
		deffered.resolve(data);
	});

	this.getData = function () {
		return deffered.promise;
	}
}])


.controller('appCtrl', ['$scope', 'appService', 'motorMaster',
	function($scope, appService, motorMaster){
	var promise = appService.getData();
	promise.then(function (data) {
		$scope.motorDetails = data.data;

		$scope.calcData = {};

		$scope.calcData.eff1 = $scope.motorDetails[$scope.calcData.ieRatings1][$scope.calcData.kwrating1][$scope.calcData.poleSel1];


	});

	$scope.kwArray = motorMaster.rating;
	$scope.poles = motorMaster.pole;
	$scope.ieRatings = motorMaster.ieRating;

	

}])

