RUN.controller(
	"AppController",
	function( $scope, $http, socket ) {
		$scope.pagetitle = '';
		$scope.runId = '';
		$scope.runOrder = [];
		$scope.pricelist = [];
        $scope.friends = [];
		$scope.setPageTitle = function(val){
			$scope.pagetitle = ' | ' + val;
		};

		$http.get('/api/pricelist/').success(function(data) {
			$.each(data.products, function(index, item) {
				data.products[index].qty = 1;
				data.products[index].price = Number(data.products[index].price.replace('$',''));
				data.products[index].subtotal = data.products[index].qty*data.products[index].price;
			});
			$scope.pricelist = data;
		});

		$scope.socket = io.connect('http://localhost:3000');
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

        $http({
            method: 'POST',
            url: '/api/createRun',
            data: $scope.order,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.runId = data.runId;
            $scope.friends = data.data.friends;
            console.log($scope.friends);
        });


		$scope.inviteFriends = function(){
			
		};
	}
);

RUN.controller(
	"ViewRunController",
	function( $scope, $http, $routeParams ) {
		//console.log('Create An New Run');
		$scope.runId = $routeParams.runID;
		$scope.setPageTitle('Viewing A Run');

		$scope.socket.on('newItem', function (data) {
			alert('NEW ITEM');
		});
	}
);

RUN.controller(
	"OrderController",
	function( $scope, $http, $routeParams ) {
		$scope.runId = $routeParams.runID;
		$scope.setPageTitle('Make An Order');
		$scope.order = [];
		$scope.order.items = [];
		$scope.order.subtotal = 0;

		$scope.updateOrder = function(){
			var st = 0;
			$.each($scope.order.items, function(index, item) {
				$scope.order.items[index].subtotal = $scope.order.items[index].price*$scope.order.items[index].qty;
				st += $scope.order.items[index].subtotal;
			});
			$scope.order.subtotal = st;
		};

		$scope.submitOrder = function(){
			if($scope.order.items.length !== 0){
				$http({
					method: 'POST',
					url: '/api/addItem/'+$scope.runId,
					data: $scope.order,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				});
			} else {
				alert('Nothing To Order.  GO HOME, YOU\'RE DRUNK.');
			}
		};
	}
);