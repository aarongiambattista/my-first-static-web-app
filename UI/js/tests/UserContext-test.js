/*
http://qunitjs.com/,
https://api.qunitjs.com
JS Unit Tests for the UserContext
 */
var fakeUserData = { "userID": "colin.hayes@communitybrands.com", "FirstName": "Colin", "lastName": "Hayes", "Email": "n@n.com", "personID": 12345, "company": "Community Brands", "companyID": 1, "SOAToken": "1234567891011121314151617181920" };

var fakeloginParameters = { "Password": "1", "RememberMe": true, "UserName": "n@n.com" };

var fakeLogoutModel = { "Email": "mbj@gmail.com", "FirstName": "Mayur", "LastName": "J", "LinkId": "2596", "UserId": "63", "UserName": "mbj@gmail.com", "company": "null", "companyID": "null", "personID": "null" };

var loginResultObj = {
    "AptifyUser": "sa",
    "AptifyUserID": 11,
    "AuthenticatedPersonId": 2561,
    "AuthenticationTime": "2018-06-08T12:17:14.4849764+05:30",
    "CompanyId": "347",
    "Database": "Aptify",
    "Email": "n@n.com",
    "FirstName": "Navin",
    "LastName": "Prasad",
    "LinkId": "2561",
    "Server": "il013177",
    "Title": "",
    "TokenId": "cb5de3b1-5e7a-4503-bda8-1ebb12d9f10",
    "UserId": 18,
    "UserName": "n@n.com"
};
//'AuthenticationTime' and 'TokenId' will be different everytime. So to assert with strict check these should be updated.


//UserContext Test suite
QUnit.begin(function (details) {
    console.log("No. of Tests : ", details.totalTests);
});


//Test 1, See if we can load up the knockout model and html.
//Mostly checking for model typos.
QUnit.test("compile / load", function (assert) {
    var done = assert.async();
    var domEl = $('#UserContext')[0];
    var options = options || {};
    options.domElement = domEl;

    eb_UserContext.live = new eb_UserContext.model(undefined, domEl);
    assert.ok(typeof eb_UserContext.live != 'undefined', "Passed!");
    done();//Tell QUnit that our aynsc stuff is done.

});

//Test 2, lets try loading some data and storing it.
QUnit.test("Saved Context Object Properties in Local storage" , function (assert) {
    var done = assert.async();
    var domEl = $('#UserContext')[0];
    var options = options || {};
    options.domElement = domEl;

    eb_UserContext.live = new eb_UserContext.model(undefined, domEl);
    assert.ok(typeof eb_UserContext.live != 'undefined', "Loaded Ok");

    eb_UserContext.live.getDataFromCacheOrServer();//Call the user to see if we have any user context.

    //Expecting none
    assert.ok(eb_UserContext.live.personID() == null, "User is not logged in as expected");
    eb_UserContext.live.Load(fakeUserData);//Load up our fake person.

    assert.ok(eb_UserContext.live.FirstName() == fakeUserData.FirstName, "Loaded fake user ok");
    eb_UserContext.saveContext(eb_UserContext.live);//Save to local storage
    assert.ok(localStorage.getItem("eb_FirstName") == fakeUserData.FirstName, "First Name Stored to local storage");
    //Kill Model and reload from local storage.
    eb_UserContext.live = "";
    eb_UserContext.live = new eb_UserContext.model(undefined, domEl);
    eb_UserContext.live.getDataFromCacheOrServer();//Load from cache
    assert.ok(eb_UserContext.live.FirstName() == fakeUserData.FirstName, "Loaded fake user from local storage ok");
    //Destory local cache
    eb_UserContext.destoryContext(eb_UserContext.live);
    assert.ok(eb_UserContext.live.FirstName() == null, "User Context model destroyed");
    assert.ok(localStorage.getItem("eb_FirstName") == null, "User Context cache destoryed");
    done();//Tell QUnit that our aynsc stuff is done.

});
/*
Check and see if all of the side wide control settings can be overwritten from the page.
 */
QUnit.test("Render Control Options override", function (assert) {
    var done = assert.async();
    var domEl = $('#UserContext')[0];
    var options = options || {};
    options.SitePath = eb_Config.SitePath;
    options.ServicePath = eb_Config.ServicePath;
    options.ServicePath = eb_Config.ServicePath + "services";
    options.TemplatePath = "UserContext.html";
    options.domElement = domEl;

   
        eb_UserContext.live = new eb_UserContext.model(fakeUserData, domEl);
        assert.ok(eb_UserContext.TemplatePath === options.TemplatePath, "Template Path Accepted.");
        assert.ok(eb_UserContext.SitePath === options.SitePath, "Site Path Accepted.");
        assert.ok(eb_UserContext.ServicePath === options.ServicePath, "Service Path Accepted.");
        assert.ok(eb_UserContext.live.domElement === options.domElement, "Dom Element Accepted.");
        done();//Tell QUnit that our aynsc stuff is done.
    
});


/*Simple login function test*/
QUnit.test("login validation successful", function (assert) {
    var done = assert.async();
    var domEl = $('#UserContext')[0];
    var options = options || {};
    eb_UserContext.live = new eb_UserContext.model(fakeUserData, domEl);
    eb_UserContext.live.login(fakeloginParameters).done(function (loginResult) {
        assert.ok(loginResult.UserName == fakeloginParameters.UserName, "Login Successful");
        done();
    });
});

/*Simple logout function test*/
/*Change 'todo' to 'test' or 'only' to run the test*/
QUnit.test("logout successful", function (assert) {
    var done = assert.async();
    var domEl = $('#UserContext')[0];
    var options = options || {};
    eb_UserContext.live = new eb_UserContext.model(fakeLogoutModel, domEl);
    assert.ok(eb_UserContext.live.UserName() === fakeLogoutModel.UserName,"Logout Person okay");
    eb_UserContext.live.Logout().done(function (logoutResult) {
        assert.strictEqual(logoutResult , undefined, "Logout Successful");
        done();
    });
});

/*Test using Qunit's different methods*/
/*Change 'todo' to 'test' or 'only' to run the test*/
QUnit.todo("login validation using 'equal'", function (assert) {
    var done = assert.async();
    var domEl = $('#UserContext')[0];
    var options = options || {};
    eb_UserContext.live = new eb_UserContext.model(fakeUserData, domEl);
    eb_UserContext.live.login(fakeloginParameters).done(function (loginResult) {
        assert.equal(loginResult, loginResultObj, "equal behaves as '==' ");
        assert.strictEqual(loginResult, loginResultObj, "StrictEqual behaves as '===' ");
        done();
    });
});


//Test Run Details
QUnit.on("runEnd", function (data) {
    console.log("Passed: " + data.testCounts.passed);
    console.log("Failed: " + data.testCounts.failed);
    console.log("Skipped: " + data.testCounts.skipped);
    console.log("Todo: " + data.testCounts.todo);
    console.log("Total: " + data.testCounts.total);
});


