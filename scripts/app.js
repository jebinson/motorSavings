var app = angular.module('app', ["kendo.directives"])

.constant('motorMaster', {
	rating:["","0.12","0.18","0.2","0.25","0.37","0.4","0.55","0.75",
	"1.1","1.5","2.2","3","4","5.5","7.5","11","15","18.5","22","30",
	"37","45","55","75","90","110","132","160","200","250","315","355",
	"400","450","500"],
	pole:["","2 pole","4 pole","6 pole","8 pole"],
	ieRating:["","IE1","IE2","IE3","IE4"]
})

.controller('appCtrl', 
	['$scope','motorMaster', '$http', '$q', function($scope, motorMaster, $http, $q){

		$scope.kwArray = motorMaster.rating;
		$scope.poles = motorMaster.pole;
		$scope.ieRatings = motorMaster.ieRating;

		$scope.calcData = {ieRatings1:"", kwrating1:"", poleSel1:"",
		ieRatings2:"", kwrating2:"", poleSel2:"", eff1:"", eff2:""};

		function getEffData(ie, kw, po) {
			var deffered = $q.defer(); //$q for AJAX call

			var url = 'https://raw.githubusercontent.com/jebinson/motorSavings/master/scripts/motordetails.json';
			$http.get(url).then(
				function (response) {
					motordetails = response.data;
					effData = motordetails[ie][kw][po];
					deffered.resolve(effData); //$q for AJAX call
				})
			return deffered.promise; //$q for AJAX call
		}

		$scope.getEff = getEff;
		function getEff(ie1, kw1, po1, ie2, kw2, po2) {
			$scope.calcData.eff1 = "Fetching..."
			$scope.calcData.eff2 = "Fetching..."
			getEffData(ie1, kw1, po1).then(function (response) {
				$scope.calcData.eff1 = response;
			})			
			getEffData(ie2, kw2, po2).then(function (response) {
				$scope.calcData.eff2 = response;
			})
			
		}
	}])

