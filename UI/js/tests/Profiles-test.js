/*
http://qunitjs.com/
JS Unit Tests for the Person Profile
 */

//Test 1, See if we can load up the knockout model and html.
    //Mostly checking for model typos.
    QUnit.test("compile / load", function (assert) {
        var done = assert.async();
        var domEl = $('#profile')[0];
        var options = options || {};
        options.domElement = domEl;
        eb_profile.render(options).done(function () {
            eb_profile.live = new eb_profile.model(undefined, domEl);
            assert.ok(typeof eb_profile.live != 'undefined', "Passed!");
            done();//Tell QUnit that our aynsc stuff is done.
        });
    });

/*
Check and see if all of the side wide control settings can be overwritten from the page.
 */
QUnit.test("Render Control Options override",function(assert){
    var done = assert.async();
    var domEl = $('#profile')[0];
    var options = options || {};
    options.domElement = domEl;
    options.SitePath = "https://colinhayes.tech/Leto/";
    options.ServicePath = "https://colinhayes.tech:5000/";
    options.TemplatePath = "/html/Profile.html";
    eb_profile.render(options).done(function () {
        eb_profile.live = new eb_profile.model(fakeUserData, domEl);
        assert.ok(eb_profile.TemplatePath=== options.TemplatePath,"Template Path Accepted.");
        assert.ok(eb_profile.SitePath===options.SitePath,"Site Path Accepted.");
        assert.ok(eb_profile.ServicePath===options.ServicePath,"Service Path Accepted.");
        assert.ok(eb_profile.live.domElement===options.domElement,"Dom Element Accepted.");
        done();//Tell QUnit that our aynsc stuff is done.
    }).fail(function(){
        assert.ok(eb_profile.TemplatePath===options.TemplatePath,"Template Path Accepted.");
        assert.ok(eb_profile.SitePath===options.SitePath,"Site Path Accepted.");
        assert.ok(eb_profile.ServicePath===options.ServicePath,"Service Path Accepted.");
        assert.ok(eb_profile.live.domElement===options.domElement,"Dom Element Accepted.");
        done();//Tell QUnit that our aynsc stuff is done.
    });
});