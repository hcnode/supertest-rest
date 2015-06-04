**About**

 supertest-rest is http api test framework and base on supertest, especially for REST architectural api

**Install**

    npm install supertest-rest

**Test**

    mocha
  
**Example**

[test/test.js](https://github.com/hcnode/supertest-rest/blob/master/test/test.js)

**Usage**

make a config object for some setting and test cases

    {
		// you can define endPoint or make your owner custom supertest request as well
		endPoint :   // base url of api
		getReqeust : // custom supertest
		testCases : // Array of test case object
    }

test cases object can be like sample bellow:

    {
			name: "updatePets1",
			put: "/pets/{{id}}",
			params: {
				name : "new name"
			},
			assert : function (res) {
				assert.equal(res.body.name, "new name");
			},
			bindId : ["addPets1"]
		}

 - name : name of the test case
 - put : the key is method of http request, value is the path of the api
 - body : the body of the request when the method is post or put
 - assert : the function will be called after receive the response, you can put some assert codes here to assert the body or header in the response object as you expected
 - bindId : Array of the other test cases name, which provide the id that will be replace the "{{id}}" in this case's path, and the id is obtained from the response object that from bindId's test case

**中文说明**


 - name : 测试用例的名称
 - put ： key是http请求的method，值是请求的path
 - body ：post或者put请求的body
 - assert：http请求返回后的调用，传入的res参数，可以在assert语句中判断body或者header是否符合预期
 - bindId：其他测试用例的name，用来替换path中的id，通常是在其他测试用例的response body里面获取的id属性

