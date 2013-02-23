var redis = require("redis"),
	uuid = require("node-uuid"),
	async = require("async"),
	redis_cli;
	
var RunStore = function() {
	redis_cli = redis.createClient();
}

RunStore.prototype.createRun = function(params, callback) {
	var self = this;

	if (params.override === true) {
		this.initRun(params, callback);
	} else {
		redis_cli.get(params.fb_id + ':run', function(e, run) {
			if (null == run) {
				self.initRun(params, callback);
			} else {
				callback(run);
			}
		});
	}
}

RunStore.prototype.initRun = function(params, callback) {
	var rid = uuid.v1();
	rid = rid.substring(4, 4) + rid.substring(27);
	var m = redis_cli.multi();
	m.set(params.fb_id + ':run', rid); // expire in 4 hours
	m.set(rid + ':order:next_id', 0); // expire in 4 hours (IF TIME)
	m.exec(function(err, res) {
		if (
			res[0] == "OK"
			&& res[1] == "OK"
			) {
			callback(rid);
		}
	});
}

RunStore.prototype.finishRun = function(params, callback) {
	var self = this;

	redis_cli.smembers(params.r_id + ':order', function(e, members) {
		// gives me each facebook user who has added an order to the run
		async.each(members, function(member, o_callback) {
			redis_cli.smembers(params.r_id + ':order:' + member, function(e, ids) {
				async.each(ids, function(id, i_callback) {
					// gives me each order id in the run
					var m = redis_cli.multi();
					m.del(params.r_id + ':order:' + member + ':' + id + ':got');
					m.del(params.r_id + ':order:' + member + ':' + id);
					m.exec(function(err, res) {
						if (
							res[0] == 1
							&& res[1] == 1
							) {
							i_callback();
						}
					});
				}, function(e) {
					redis_cli.del(params.r_id + ':order:' + member, function(e, r) {
						o_callback();
					});
				});
			});
		}, function(e) {
			// each user callback

			var m = redis_cli.multi();
			// remove next id
			m.del(params.r_id + ':order:next_id');
			// remove order
			m.del(params.r_id + ':order');
			// remove run
			m.del(params.fb_id + ':run');

			m.exec(function(err, res) {
				if (
					res[0] == 1
					&& res[1] == 1
					&& res[2] == 1
					) {
					
					console.log('goddamn');
					callback(1);	
				}
			});
		});
	});
}

RunStore.prototype.addItemToRun = function(params, data, callback) {
	var m = redis_cli.multi();
		m.sadd(params.r_id + ':order:' + params.fb_id, data.id);
		m.set(params.r_id + ':order:' + params.fb_id + ':' + data.id, JSON.stringify(data));
		m.set(params.r_id + ':order:' + params.fb_id + ':' + data.id + ':got' , 0);
	
	m.exec(function(err, res) {
		if (
			res[0] == 1
			&& res[1] == "OK"
			&& res[2] == "OK"
			) { // pour jamie <3
		  	redis_cli.incr(params.r_id + ':order:next_id', function(e, r) { 
				if (e) {
					callback(e);
				} else {
					callback(data.id);
				}
			});	
		}
	});
}

RunStore.prototype.addItem = function(params, data, callback) {
	var self = this;
	redis_cli.get(params.r_id + ':order:next_id', function(e, id) {
		if (e) {
			callback(e);
		} else {
			data.id = id;
			redis_cli.sismember(params.r_id + ':order', params.fb_id, function(e, isMember) {
				if (!isMember) {
					redis_cli.sadd(params.r_id + ':order', params.fb_id, self.addItemToRun(params, data, callback));
				} else {
					self.addItemToRun(params, data, callback);
				}
			});
		}
	});
}

RunStore.prototype.gotItem = function(params, callback) {
	redis_cli.smembers(params.r_id + ':order:' + params.fb_id, function(e, order) {
		if (e) {
			callback(e);
		} else {
			redis_cli.set(params.r_id + ':order:' + params.fb_id + ':' + params.item_id + ':got', params:status, function(e, r) {
				if (e) {
					callback(e);
				} else {
					callback(1);
				}
			});
		}
	});
}

RunStore.prototype.getPricelist = function(params, callback) {
	redis_cli.get(params.vendor + ':pricelist', function(e, prices) {
		if (e) {
			callback(true);
		} else {
			callback(null, JSON.parse(prices));
		}
	});
}

RunStore.prototype.storePricelist = function(data, callback) {
	redis_cli.setex('garrison:pricelist', 3600 * 24, JSON.stringify(params.data), function(e, r) {
		if (e) {
			callback(false);
		} else {
			callback(true);
		}
	});
}

module.exports = RunStore;