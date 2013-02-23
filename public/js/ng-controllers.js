RUN.controller(
	"AppController",
	function( $scope, $http, socket ) {
		$scope.pagetitle = '';
		$scope.runOrder = [];
		$scope.availableItems = [];
		$scope.setPageTitle = function(val){
			$scope.pagetitle = ' | ' + val;
		};
		$scope.socket = io.connect('http://localhost:3000');
		$scope.socket.on('news', function (data) {
			console.log(data);
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
	}
);