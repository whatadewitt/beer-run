var redis = require("redis"),
	uuid = require("node-uuid"),
	async = require("async"),
	redis_cli;
	
var RunStore = function() {
	redis_cli = redis.createClient();
}

RunStore.prototype.createRun = function(params) {
	var rid = uuid.v1();
	rid = rid.substring(4, 4) + rid.substring(27);
	redis_cli.setex(params.fb_id + ':run', 3600 * 4, rid); // expire in 4 hours
	redis_cli.setex(rid + ':order:next_id', 3600 * 4, 0); // expire in 4 hours
	
	return rid;
}

RunStore.prototype.finishRun = function(params, callback) {
	redis_cli.get(redis_cli.del(params.fb_id + ':run'), function(e, r_id) {
		redis_cli.del(params.fb_id + ':run', function(e, r) {
			if (e) { 
				callback(e);
			} else {
				var orders = redis_cli.smembers(r_id + ':order', function(e, r) {
					if (e) {
						callback(e);
					} else {
						async.each(orders, function(order) {
							redis_cli.srem(order);
						}, function() {
							callback(null, true);
						});
					}
				});
			}
		});
	});
}

RunStore.prototype.addItem = function(params, data, callback) {
	data.id = redis_cli.get(r_id + ':order:next_id', function() {
		redis_cli.sadd(r_id + ':order', params.fb_id);
		redis_cli.set(r_id + ':order:' + params.fb_id, JSON.stringify(data));
		redis_cli.incr(r_id + ':order:next_id');

		callback(data.id);
	});
}

RunStore.prototype.gotItem = function(params, callback) {
	redis_cli.get(r_id + ':order:' + params.fb_id, function(e, order) {
		if (e) {
			callback(e);
		} else {
			order.status = 1;

			callback(null, order);
		}
	});
}

module.exports = RunStore;