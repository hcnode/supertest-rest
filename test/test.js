/**
 * Created by harry on 15/6/3.
 */
var supertest_rest = require("../index");
var assert = require("assert");
var testConfig = {
	endPoint : "http://45.33.54.117",
	testCases: [
		{
			name: "addPets1",
			post: "/pets",
			body: {
				name: "旺财",
				age: 5
			},
			assert : function (res) {
				assert.equal(res.body.name, "旺财");
				assert.equal(res.body.age, "5");
			},
			code : 201
		},{
			name: "addPets2",
			post: "/pets",
			body: {
				name: "老王",
				age: 3
			},
			code : 201
		},{
			name: "listPet",
			get: "/pets",
			body: {}
		},{
			name: "updatePets1",
			put: "/pets/{{id}}",
			body: {
				name : "小强",
				age : 2
			},
			bindId : ["addPets1"]
		},{
			name: "getPets1",
			get: "/pets/{{id}}",
			body: {},
			assert : function (res) {
				assert.equal(res.body.name, "小强");
				assert.equal(res.body.age, 2);
			},
			bindId : ["addPets1"]
		},{
			name: "addPhoto1",
			post: "/pets/{{id}}/photos",
			body: {},// param url is required
			bindId : ["addPets1"],
			code : 400
		},{
			name: "addPhoto2",
			post: "/pets/{{id}}/photos",
			body: {
				url : "http://photo url"
			},
			bindId : ["addPets1"],
			getId : function(res){
				return res.body.photos[0].id;
			}
		},{
			name: "getPhoto2",
			get: "/pets/{{id}}/photos/{{id}}",
			body: {},
			assert : function (res) {
				assert.equal(res.body[0].url, "http://photo url");
			},
			bindId : ["addPets1", "addPhoto2"]
		},{
			name: "deletePhotos1",
			delete: "/pets/{{id}}/photos/{{id}}",
			body: {},
			bindId : ["addPets1", "addPhoto2"]
		},{
			name: "deletePets1",
			delete: "/pets/{{id}}",
			body: {},
			bindId : ["addPets1"]
		}
	]
}
describe('test supertest-rest', function () {
	supertest_rest(testConfig);
});
