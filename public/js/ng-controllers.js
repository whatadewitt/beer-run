RUN.controller(
	"AppController",
	function( $scope, $http, socket ) {
		$scope.pagetitle = '';
		$scope.runOrder = [];
		$scope.pricelist = [];
		$scope.setPageTitle = function(val){
			$scope.pagetitle = ' | ' + val;
		};

		$http.get('/api/pricelist/').success(function(data) {
			$scope.pricelist = data;
		});

		$scope.socket = io.connect('http://localhost:3000');
		$scope.socket.on('news', function (data) {
			socket.emit('my other event', { my: 'data' });
		});
	}
);

RUN.controller(
	"HomeController",
	function( $scope, $http ) {
		$scope.setPageTitle('Welcome');
	}
);


RUN.controller(
	"CreateRunController",
	function( $scope, $http ) {
		//console.log('Create An New Run');
		$scope.setPageTitle('Create A Run');

		$scope.inviteFriends = function(){
			//https://www.facebook.com/dialog/send?app_id=**app_id**&to=**friend_id**&picture=**imageurl**&link=**yoursitelink**&redirect_uri="+redirect_uri
		};
	}
);

RUN.controller(
	"OrderController",
	function( $scope, $http ) {
		$scope.setPageTitle('Make An Order');
		$scope.order = [];
	}
);