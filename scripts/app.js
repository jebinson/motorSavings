var app = angular.module('app', [])

.constant('motorMaster', {
	rating:[{"kW":"0.12"},{"kW":"0.18"},{"kW":"0.2"},{"kW":"0.25"},{"kW":"0.37"},
	{"kW":"0.4"},{"kW":"0.55"},{"kW":"0.75"},{"kW":"1.1"},{"kW":"1.5"},
	{"kW":"2.2"},{"kW":"3"},{"kW":"4"},{"kW":"5.5"},{"kW":"7.5"},{"kW":"11"},
	{"kW":"15"},{"kW":"18.5"},{"kW":"22"},{"kW":"30"},{"kW":"37"},{"kW":"45"},
	{"kW":"55"},{"kW":"75"},{"kW":"90"},{"kW":"110"},{"kW":"132"},{"kW":"160"},
	{"kW":"200"},{"kW":"250"},{"kW":"315"},{"kW":"355"},{"kW":"400"},{"kW":"450"},
	{"kW":"500-1000"}],
	pole:[{"poles":"2_pole"},{"poles":"4_pole"},{"poles":"6_pole"},
	{"poles":"8_pole"}],
	ieRating:[{"IE":"IE1","desc":"Standard efficiency"},
	{"IE":"IE2","desc":"High efficiency"},
	{"IE":"IE3","desc":"Premium efficiency"},
	{"IE":"IE4","desc":"Super-Premium efficiency"}]
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
	});


	$scope.motorMaster = motorMaster;
	console.log($scope.motorMaster);
	

}])