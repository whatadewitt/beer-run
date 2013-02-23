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
			$.each(data.products, function(index, item) {
				data.products[index].qty = 1;
				data.products[index].price = Number(data.products[index].price.replace('$',''));
				data.products[index].itemSubtotal = data.products[index].qty*data.products[index].price;
			});
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