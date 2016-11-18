var app = angular.module('app', ["kendo.directives"])

//Standard motor details, to populate dropdown lists.
.constant('motorMaster', {
	rating:["0.12","0.18","0.2","0.25","0.37","0.4","0.55","0.75",
	"1.1","1.5","2.2","3","4","5.5","7.5","11","15","18.5","22","30",
	"37","45","55","75","90","110","132","160","200","250","315","355",
	"400","450","500"],
	pole:["2 pole","4 pole","6 pole","8 pole"],
	ieRating:["IE1","IE2","IE3","IE4"]
})

//appService to make AJAX calls.
.service('appService', ['$http', '$q', function($http, $q){

	var deffered = $q.defer(); 

	var url = 'https://raw.githubusercontent.com/jebinson/motorSavings/master/scripts/motordetails.json';
	$http.get(url).then(
		function (response) {
			motordetails = response.data;
			deffered.resolve(motordetails);
		})

	//returns the whole json on call.
	this.getEffData = function(){
		return deffered.promise;
	}

}])

//main controller
.controller('appCtrl', 
	['$scope','motorMaster', 'appService', function($scope, motorMaster, appService){

		//constant made availabe to view for binding.
		$scope.kwArray = motorMaster.rating;
		$scope.poles = motorMaster.pole;
		$scope.ieRatings = motorMaster.ieRating;

		//calcData defined for ng-models.
		$scope.calcData = {ieRatings1:"", kwrating1:"", poleSel1:"",ieRatings2:"", kwrating2:"",
		poleSel2:"", eff1:"", eff2:"", elecCost:0.21, display:false};

		//efficiency table ng-show control.
		$scope.tableData = {display:false};

		//calculates annual savings for motors, considering it operational for one hour per day.
		$scope.calcSavings = calcSavings;
		function calcSavings() {

			var ie1 = $scope.calcData.ieRatings1;
			var kw1 = $scope.calcData.kwrating1;
			var pol1 = $scope.calcData.poleSel1;
			var ie2 = $scope.calcData.ieRatings2;
			var kw2 = $scope.calcData.kwrating2;
			var pol2 = $scope.calcData.poleSel2;

			if (ie1 && kw1 && pol1 && ie2 && kw2 && pol2) {

				appService.getEffData().then(function (response) {
					//pulls efficiency data from JSON.
					$scope.calcData.eff1 = response[ie1][kw1][pol1];
					$scope.calcData.eff2 = response[ie2][kw2][pol2];
					//kw1 is a string, kWH = kW / (%eff / 100);
					$scope.calcData.kwH1 = (parseFloat(kw1) * 100) / $scope.calcData.eff1;
					console.log($scope.calcData.kwH1);
					$scope.calcData.kwH2 = (parseFloat(kw2) * 100) / $scope.calcData.eff2;
					console.log($scope.calcData.kwH2);
					//difference between kWH of motor 1 and motor 2, times electrical cost.
					$scope.tableData.savingPerhour = Math.abs($scope.calcData.kwH1 - $scope.calcData.kwH2) * $scope.calcData.elecCost;
					$scope.tableData.annualSaving = $scope.tableData.savingPerhour * 52; //savings per year.
					//calculation table ng-show control.
					$scope.calcData.display = true;

				});

			} else {
				alert('Fill in motor deatils.') //alerts when all the motor fields are not filled.
			}
			
		}

		//convert objects in JSON to array to do ng-repeat.
		appService.getEffData().then(function (response) {
			var tempEffData = [];
			for (i in $scope.kwArray) {
				tempEffData[i] = [];
				for (j in $scope.ieRatings) {
					for (k in $scope.poles) {
						tempEffData[i].push(response[$scope.ieRatings[j]][$scope.kwArray[i]][$scope.poles[k]]);
					}
				}
			}
			$scope.effArray = tempEffData;
		})

	}])