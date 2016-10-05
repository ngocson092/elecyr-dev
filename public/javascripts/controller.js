app = angular.module("everBlog",['ngRoute', 'seo'])





//for dynamically loading the title
app.run(['$rootScope', '$routeParams', 'loadingService', function($rootScope, $routeParams, loadingService){
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous){
		
		$rootScope.title = $routeParams.param
		var myTestHere = loadingService.clearCatArr();

		
	});
}]);

/*
Factories
*/
	var scrollOn = true; //switch to turn off scroll listener until the value of the first call have been returned
app.factory('loadingService', function($http){

	var articles = [];
	var dateRange;
		
	var tempCategoryArr = [];	
	var tempDateRange;
	var setFilter;


	return {
		clearCatArr: function(){
			tempCategoryArr = [];
			return tempCategoryArr;
		},
		someDamnTest: function(){

			var testing = "YAY";
			tempCategoryArr = [];
			setFilter = '';
			tempDateRange = dateRange;
			return tempDateRange;
		},
		
		updateArticles: function(callback){

			var queryString = "?limit=9"
			var queryString = (dateRange === undefined) ? queryString : queryString + "&dateRange=" + dateRange + "";

			if(scrollOn == true){
				scrollOn = false;
				$http.get("/api/posts/" + queryString + "")
								
					.then(function(response) {				
						var data = response.data;
						for(i=0;i<data.length;i++){
							articles.push(data[i]);
							console.log("the filter date is " + data[i].filterDate);
							dateRange = data[i].filterDate;
						}

						callback(dateRange)
					}, 
					function(response){
						return err;
					});
			}
		},
		
		updateCategory: function(givenFilter, dateFilter, callback){ //called for just updating individual categories
			
			setFilter = givenFilter;
			
			var queryString = "?myLimit=9&dateRange=" + tempDateRange + "&category=" + setFilter +"";

			if(scrollOn == true){
				scrollOn = false;
				$http.get("/api/posts/" + queryString + "")
								
					.then(function(response) {				
						var data = response.data;
						for(i=0;i<data.length;i++){		
							tempCategoryArr.push(data[i]);
							tempDateRange = data[i].filterDate;
						}					
						callback(tempDateRange)
					}, 
					function(response){
						return err;
					});
			}
			
		},
		
		getArticles: function(){

			return articles;
		},
		getByCategory: function(){

			return tempCategoryArr
		}
	}
});

//For dynamically loading the meta description
app.factory('metaService', function($routeParams){
	return {
		metaDescription: function(){
		
			var descriptionParam = $routeParams.param || '';
			var description = 'Elecyr solar battery storage and energy management ' + descriptionParam;
			return description
		}
	}
});

/*
Main Controller
 */
app.controller('BlogCtrl', function($scope, $http, $sce, $routeParams, $window, $rootScope, metaService, loadingService) {

	$rootScope.metaservice = metaService.metaDescription();
	
	$scope.param = $routeParams.param;
	$scope.myFilter = function (param) {
		return {categories:param}
	};


	$scope.loading = true;


	$scope.updateData = function(filter, myTempDateFilter, callback){ /*calls the function to load more blog articles */
		//console.log("9 - updateDate function - filter: " + filter);
		if(filter === undefined){
			//console.log("10 - filter undefined");
			loadingService.updateArticles(function(){
				scrollOn = true;
				console.log("New Articles!");
				loadCategory();
			})
		}else{
			console.log("11 - filterDefined:" + filter);
			loadingService.updateCategory(filter, myTempDateFilter, function(){
				scrollOn = true;
				console.log("New Categories!");
				loadCategory();
			})
		}
	}
	

	$scope.callCategory = function clickTest(param){ /* could do the test for clearing the last category in here */


		var myCategoryArr = loadingService.clearCatArr();
		if(param !== undefined){
				var myTempDateFilter = loadingService.someDamnTest();

				$scope.updateData(param, myTempDateFilter, function(){

				
			});
		}
	}
	

	
	function loadData(){ //first primary call for the main data
		
		var articles = loadingService.getArticles();
				
		$scope.articles = articles;
				
		$scope.snippet = function snippet(articles){
			var screenWidth = $window.innerWidth;
			var snippet = $sce.trustAsHtml(articles.snippet);
			
			//If there is no image then show the snippet on the mobile version, if not hide the snippet
			if (!articles.headlineImage && screenWidth <= 480 || screenWidth > 480 ) {
				return snippet;
			}
		}
		$scope.headlineImage = function headlineImage(data){
			var headlineImage = $sce.trustAsHtml(data.headlineImage);
			return headlineImage;
		}
		$scope.author = function author(data){
			if(data.author === null){
				return '';
			}
			else{
				var authorStr = "Posted By " + data.author;
				return authorStr;
			}
		}
		$scope.param = $routeParams.param;
		
	}
	function loadCategory(){ //seconddary call for grabbing just category data

		var someArticles = loadingService.getByCategory();
	
		$scope.someArticles = someArticles;
		
		$scope.snippet = function snippet(someArticles){
			var screenWidth = $window.innerWidth;
			var snippet = $sce.trustAsHtml(someArticles.snippet);
			
			//If there is no image then show the snippet on the mobile version, if not hide the snippet
			if (!someArticles.headlineImage && screenWidth <= 480 || screenWidth > 480 ) {
				return snippet;
			}
		}
		$scope.headlineImage = function headlineImage(someArticles){
			var headlineImage = $sce.trustAsHtml(someArticles.headlineImage);
			return headlineImage;
		}
		$scope.author = function author(someArticles){
			if(someArticles.author === null){
				return '';
			}
			else{
				var authorStr = "Posted By " + someArticles.author;
				return authorStr;
			}
		}
		
		$scope.loading = false;
		
	}
	if($scope.articles === undefined){
		$scope.updateData();
	}	
	loadData();
	//loadCategory();	
	

	
})



/*
Directives
*/
app.directive('whenScrollEnds', function() {

	return {
		restrict: "A",
		scope: true,
		link: function(scope, element, attrs) {
			

	//put delay timer in here for the container to grow to height				
			$(window).scroll(function() {				
								
				var threshold = 100;
				var myHeight = screen.height;			
				var comboHeight = threshold + myHeight;
				//Only call the database for new articles if the user is in the list of articles view
				var absUrl = window.location.pathname;
				var paramVal = scope.param;
				var myParam = (typeof paramVal === 'undefined') ? '' : "/" + paramVal;
				var myPathname = "/solar-blog" + myParam;
	
				if(absUrl == myPathname){
					
					
//put an on and off switch to debounce the listener						
					var containerHeight = $('#newspaper').height();
					
					var scrolledHeight = $(window).scrollTop();
					var totalHeight = scrolledHeight + comboHeight;
					
					

					if (containerHeight - totalHeight <= 0) {

						scope.$apply(attrs.whenScrollEnds);
					}
				}
			});
		}
	};
});

app.directive('sideHeight', function(){ /* make the height of the sidebar be no longer than the main content */
	
	return{
		link: function(scope, element, attrs){
			   scope.$watch(function(){ //watch any changes to our element

					scope.style = { //scope variable style, shared with our controller
						height:element.height() + 'px'//set the height in style to our elements height
					};
				});
		}
	}
})

app.directive('loading',   ['$http' ,function ($http)
{
	return {
		restrict: 'A',
		link: function (scope, elm, attrs)
		{
			scope.isLoading = function () {
				return $http.pendingRequests.length > 0;
			};

			scope.$watch(scope.isLoading, function (v)
			{
				if(v){
					elm.show();
				}else{
					elm.hide();
				}
			});
		}
	};

}])


/*
routing
*/
app.config(function($routeProvider, $locationProvider){ /* the page routing */


	$locationProvider.html5Mode({
		enabled:true,
		requireBase: false,
		reloadOnSearch: false})
		
		$locationProvider.hashPrefix('!');
			
	$routeProvider.when("/solar-blog",
		{
			title:'param',
			templateUrl: '/partials/blogList.ejs',
			controller: "BlogCtrl",
			controllerAs: "app"
		}
	)
	.when("/solar-blog/:param",
		{
			title:'param',
			templateUrl: '/partials/blogList.ejs',
			controller: "BlogCtrl",
			controllerAs: "app"			
		}
	)
	.when("/solar-blog/link/:param",
		{
			templateUrl: '/partials/blogPage.ejs',
			controller: "BlogCtrl",
			controllerAs: "app"
		}
	)
	.when("/solar-blog/pdfLink/:param",
		{
			templateUrl: '/partials/blogPDF.ejs',
			controller: "BlogCtrl",
			controllerAs: "app"
		}
	)
	.otherwise({
		redirectTo: '/partials/blogList.ejs',

	})
})	


