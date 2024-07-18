var login__c = login__c || {};
login__c.childModel = function (data, domElement) {
    _that = this;
    _that.domElement = domElement;
    console.info('childModel new name');
    userName1 = ko.observable();
    eb_Login.loginModel.apply(_that, domElement);

    //Once we applied parent model, we can call all methods of parent class.
    //Find and Inject Custom Consulting HTML DOM object Here and apply binding.

    //_that.userName = ko.observable("Ansar shaikh");

    _that.Login = function () {
        alert("overridden parent method.");
    };
    eb_Login.render.apply(_that, domElement);
};