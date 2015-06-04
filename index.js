/**
 * Created by harry on 15/6/3.
 */
var _ = require("lodash");
var request = require('supertest');
var sessionCookie;
var globalData = {};
var gTestConfig;
var gReq;
function getMethod(oReq) {
	var result;
	_.forEach(["post", "get", "put", "delete", "head", "trace", "options", "connect"], function (method) {
		if (method in oReq) {
			result = {
				method: method,
				path: oReq[method]
			};
			return false;
		}
	});
	return result;
}
function getBindId(bindId) {
	var result = {};
	for (var model  in globalData) {
		var v = globalData[model];
		for (k in v) {
			for (var bind in bindId) {
				if (bindId[bind] == k) {
					result[model] = v[k];
					break;
				}
			}
		}
	}
	return result;
}
function getRequet() {
	if(gTestConfig.getReqeust){
		return gTestConfig.getReqeust(request);
	}else if(gTestConfig.endPoint){
		return request(gTestConfig.endPoint);
	}
}
function runTestCase(oReq) {
	var methodAndPath = getMethod(oReq);
	it(oReq.name, function (done) {
		var req = gReq;
		var bindIds = getBindId(oReq.bindId);
		_.forEach(bindIds, function (v, k) {
			var reg = new RegExp("\/(" + k + ")\/{{id}}", "gi");
			if (reg.test(methodAndPath.path)) {
				methodAndPath.path = methodAndPath.path.replace(reg, "/" + k + "/" + v);
			} else {
				oReq.body.id = v;
			}
		});
		req = req[methodAndPath.method](methodAndPath.path);
		if (sessionCookie) {
			req = req.set("Cookie", sessionCookie)
		}
		if (oReq.body && (methodAndPath.method == "post" || methodAndPath.method == "put")) {
			req = req.send(oReq.body);
		}
		req = req.expect(oReq.code || 200);
		req.end(function (err, res) {
			if(oReq.assert){
				oReq.assert(res);
			}
			var id = oReq.getId ? oReq.getId(res) : res.body.id;
			var model = /\/([^\/]+)$/gi.test(methodAndPath.path) && RegExp.$1;

			if (model && id) {
				globalData[model] = globalData[model] || {};
				globalData[model][oReq.name] = id;
			}
			res.headers["set-cookie"] && (sessionCookie = res.headers["set-cookie"]);
			if (err) return done(err);
			done()
		});

	});
}
module.exports = function (testConfig) {
	gTestConfig = testConfig;
	gReq = getRequet();
	var testCases = testConfig.testCases;
	for (var i = 0; i < testCases.length; i++) {
		runTestCase(testCases[i]);
	}
}