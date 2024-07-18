/**
 * Purchase Membership Admin class.
 * @class eb_PurchaseMembershipAdmin
 * */
var eb_PurchaseMembershipAdmin = eb_PurchaseMembershipAdmin || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_PurchaseMembershipAdmin.SitePath
 * @type {String}
 * */
eb_PurchaseMembershipAdmin.SitePath = eb_Config.SitePath;

/**
 * Purchase Membership Admin template path.
 * @property eb_PurchaseMembershipAdmin.TemplatePath
 * @type {String}
 * */
eb_PurchaseMembershipAdmin.TemplatePath = "html/admin/PurchaseMembershipAdmin.html";

/**
 * SOA path.
 * @property eb_PurchaseMembershipAdmin.ServicePath
 * @type {String}
 * */
eb_PurchaseMembershipAdmin.ServicePath = eb_Config.ServicePathV1;

/**
 * Get service to get company's non members.
 * @property eb_PurchaseMembershipAdmin.getCompanyNonMembersService
 * @type {String}
 * */
eb_PurchaseMembershipAdmin.getCompanyNonMembersService = eb_PurchaseMembershipAdmin.ServicePath + "admin/company/{id}/NonMembers";

/**
 * Get service to get membership products.
 * @property eb_PurchaseMembershipAdmin.getMembershipProductsService
 * @type {String}
 * */
eb_PurchaseMembershipAdmin.getMembershipProductsService = eb_PurchaseMembershipAdmin.ServicePath + "admin/company/{id}/MembershipProducts";

/*Path of View Cart page of selected company from dropdown.*/
eb_PurchaseMembershipAdmin.viewCartURL = eb_PurchaseMembershipAdmin.SitePath + 'admin/ViewCart.html';

/*Default error message*/
eb_PurchaseMembershipAdmin.defaultErrorMessage = "Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.";

/**
 * Public method to get company's non members from the server.
 * The service will return a list of non members from the selected company.
 * @method eb_PurchaseMembershipAdmin.getCompanyNonMembers
 * @return { Object } jQuery promise object which when resolved returns list of non members.
 **/
eb_PurchaseMembershipAdmin.getCompanyNonMembers = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_PurchaseMembershipAdmin.getCompanyNonMembersService.replace("{id}", companyId);
    }
    eBusinessJQObject.get(
        {
            url: service,
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data) {
        deferred.resolve(data);
    }).fail(deferred.reject);

    return deferred.promise();
};

/**
 * Public method to get membership products from the server.
 * The service will return a list of membership products.
 * @method eb_PurchaseMembershipAdmin.getMembershipProducts
 * @return { Object } jQuery promise object which when resolved returns list of membership products.
 **/
eb_PurchaseMembershipAdmin.getMembershipProducts = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_PurchaseMembershipAdmin.getMembershipProductsService.replace("{id}", companyId);
    }
    eBusinessJQObject.get(
        {
            url: service,
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data) {
        deferred.resolve(data);
    }).fail(deferred.reject);

    return deferred.promise();
};

/**
 * List of Non Members properties on which search is applied.
 * @method eb_PurchaseMembershipAdmin.fieldsToSearch
 * @return {Object} Array of Non Members name property.
 */
eb_PurchaseMembershipAdmin.fieldsToSearch = function () {
    return ["id", "name", "emailId"];
};

/**
 * The service will return Purchase Membership Admin HTML.
 * @method eb_PurchaseMembershipAdmin.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Purchase Membership Admin template URL.
 * @return {String} Purchase Membership Admin HTML template.
 * */
eb_PurchaseMembershipAdmin.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_PurchaseMembershipAdmin.SitePath + eb_PurchaseMembershipAdmin.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
    });
    return defer.promise();
};

/**
 * Purchase Membership Admin model responsible for Purchase Membership Admin operations.
 * @method eb_PurchaseMembershipAdmin.model
 * @param { any } options Object of Purchase Membership Admin data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Purchase Membership Admin DOM element.
 * 
 * */
eb_PurchaseMembershipAdmin.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.companyId = ko.observable();
    _that.companyName = ko.observable();
    _that.companyNonMembers = options.nonMembers;
    _that.membershipProductsList = options.membershipProducts;

    _that.nonMembersObserver = ko.observableArray();
    _that.nonMembers = ko.observableArray();
    _that.membershipProducts = ko.observableArray();

    _that.nonMembersAvailable = ko.observable();
    _that.radioSelectedOptionValue = ko.observable();
    _that.mainSelectedMembershipProduct = ko.observable();
    _that.filterCollapse = ko.observable(0); /*To collapse filter on mobile*/

    /*Search text-box value binding. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.*/
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: eb_Config.companyAdminSearchTimeOut } });
    
    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable("");
    _that.allowLoader = ko.observable(0);

    _that.mainSelect = ko.observable(0);
    _that.totalChecked = ko.observable(0);  /*To keep count of records that have been selected.*/

    if (options.userContext) {
        _that.userContext = options.userContext;
        _that.companyId(_that.userContext.companyId());
        _that.companyName(_that.userContext.CompanyName());
    }

    if (options.shoppingCart) {
        _that.shoppingCart = options.shoppingCart;
        eb_PurchaseMembershipAdmin.shoppingCart(options.shoppingCart);
    }

    /*Sorting functions start here*/
    _that.sortById = function () {
        var done = false;
        var data = _that.nonMembers();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].id() > data[i].id()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.nonMembers(data);
        return true;
    };

    _that.sortByName = function () {
        var done = false;
        var data = _that.nonMembers();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].name() > data[i].name()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.nonMembers(data);
        return true;
    };

    _that.sortByEmailId = function () {
        var done = false;
        var data = _that.nonMembers();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].emailId() > data[i].emailId()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.nonMembers(data);
        return true;
    };

    /*Sorting functions end here*/

    /*Load non members from the company into observable arrays.*/
    _that.loadCompanyNonMembers = function (nonMembersData) {
        if (nonMembersData.length === 0) {
            _that.nonMembersAvailable(0);
        } else {
            _that.nonMembersObserver.removeAll();
            _that.nonMembersAvailable(1);
        }
        eBusinessJQObject.map(nonMembersData, function (row) {
            _that.nonMembersObserver.push(new _that.nonMembersData(row));
        });

        /* This function will be triggered whenever there is change in search text-box or _that.nonMembersObserver */
        _that.resultRecords = ko.computed(function () {
            var res = new eb_PurchaseMembershipAdmin.searchRecords(_that.search(), eb_PurchaseMembershipAdmin.fieldsToSearch(), _that.nonMembersObserver());
            return res;
        });

        /* Pass the search method's return value to this method so that whenever search method is triggered
          this method also gets triggered.*/
        _that.filteredNonMembers = ko.computed(function () {
            _that.radioSelectedOptionValue("");
            _that.showError(0);
            _that.nonMembers(_that.resultRecords().filteredRecords());
        })
    }

    /*Model of non members data.*/
    _that.nonMembersData = function (data) {
        var self = this;
        self.id = ko.observable(data.id);
        self.name = ko.observable(data.FirstLast);
        self.title = ko.observable(data.Title);
        self.emailId = ko.observable(data.Email);
        self.city = ko.observable(data.City);
        self.state = ko.observable(data.State);
        self.membershipProducts = ko.observableArray();

        self.isSelected = ko.observable(0);
        self.selectedMembershipProduct = ko.observable();
        self.price = ko.observable();
        self.showPrice = ko.observable();
        self.showCurrencySymbol = ko.observable();
        self.autoRenew = ko.observable(false);

        _that.loadMembershipProducts(self.membershipProducts);

        self.membershipProductChanged = ko.computed(function () {
            /*Pricing scenario*/
            if (self.selectedMembershipProduct()) {
                if (self.selectedMembershipProduct().defaultPrice() > 0) {
                    self.price(self.selectedMembershipProduct().defaultPrice());
                }
                else {
                    self.price(self.selectedMembershipProduct().retailPrice());
                }

                if (self.selectedMembershipProduct().hasComplexPricing()) {
                    self.showPrice(0);
                    self.showCurrencySymbol("");
                }
                else {
                    self.showPrice(1);
                    self.showCurrencySymbol(self.selectedMembershipProduct().currencySymbol());
                }
            }
        });

        /* Non-Member selected via checkbox*/
        self.nonMemberClicked = function () {
            _that.showError(0);
            if (event.target.checked) {
                _that.totalChecked(_that.totalChecked() + 1);
                if (_that.totalChecked() == _that.resultRecords().filteredRecords().length) {
                    _that.mainSelect(1);
                }
            }
            else {
                _that.totalChecked(_that.totalChecked() - 1);
                _that.mainSelect(0);
            }

            return true;
        };
    }

    /*Model of membership products data.*/
    _that.membershipProductsData = function (data) {
        var self = this;
        self.id = ko.observable(data.id);
        self.name = ko.observable(data.webName);

        /*Prices.*/
        self.defaultPrice = ko.observable(parseFloat(data['defaultPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.retailPrice = ko.observable(parseFloat(data['retailPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.currencySymbol = ko.observable(data['CurrencySymbol'] || data['currencySymbol']);

        self.showCurrencySymbol = ko.observable('');
        self.showPrice = ko.observable();
        self.hasComplexPricing = ko.observable(data['hasComplexPricing']);

    }

    /*Load the membership products data into observable arrays.*/
    _that.loadMembershipProducts = function (data) {
        eBusinessJQObject.map(_that.membershipProductsList, function (row) {
            data.push(new _that.membershipProductsData(row));
        });
    }

    if (_that.membershipProductsList) {
        _that.loadMembershipProducts(_that.membershipProducts);
    }

    /*Actions to be performed when main membership product selection is changed.*/
    _that.mainSelectedMembershipProductChanged = function () {
        _that.allowLoader(1);
        if (_that.mainSelectedMembershipProduct()) {
            eBusinessJQObject.map(_that.resultRecords().filteredRecords(), function (row) {
                row.selectedMembershipProduct(ko.utils.arrayFirst(row.membershipProducts(), function (item) {
                    return item.id() === _that.mainSelectedMembershipProduct().id();
                }));
            });
        }
        
        _that.allowLoader(0);
    };

    _that.getCompanyNonMembersFromServer = function () {
        return eb_PurchaseMembershipAdmin.getCompanyNonMembers(_that.companyId());
    }

    _that.getAndLoadNonMembersDataFromServer = function () {
        _that.allowLoader(1);
        _that.getCompanyNonMembersFromServer().done(function (nonMembersData) {
            _that.loadCompanyNonMembers(nonMembersData);
            _that.allowLoader(0);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.allowLoader(0);
            console.info("getCompanyNonMembersFromServer failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_PurchaseMembershipAdmin);
        });
    }

    if (_that.companyNonMembers) {
        _that.loadCompanyNonMembers(_that.companyNonMembers);
    }
    else {
        _that.getAndLoadNonMembersDataFromServer();
    }

    /*Select and Unselect All checkbox*/
    _that.selectAll = function (data, event) {
        _that.showError(0);
        _that.totalChecked(0);
        eBusinessJQObject.map(_that.resultRecords().filteredRecords(), function (row) {
            if (event.target.checked) {
                row.isSelected(true);
                _that.mainSelect(1);
                _that.totalChecked(_that.totalChecked() + 1);
            } else {
                row.isSelected(false);
                _that.mainSelect(0);
            }
        });
        return true;
    };

    /*disable the Proceed to Checkout Button if no entries are checked*/
    _that.proceedToCheckoutButtonHandler = ko.computed(function () {
        if (_that.totalChecked() > 0) {
            eBusinessJQObject(_that.domElement).find("#proceedToCheckoutButton")[0].disabled = false;
        }
        else {
            eBusinessJQObject(_that.domElement).find("#proceedToCheckoutButton")[0].disabled = true;
        }
    });

    /*Add Subscription General Product to cart.*/
    _that.addSubscriptionGeneralProductToCart = function () {
        var deferred = eBusinessJQObject.Deferred();
        var nonMemberArray = [];
        ko.utils.arrayForEach(_that.nonMembersObserver(), function (nonMember) {
            if (nonMember.isSelected() === true) {

                var postData = {
                    "productId": nonMember.selectedMembershipProduct().id(),
                    "subscriberId": nonMember.id(),
                    "autoRenew": nonMember.autoRenew()
                };

                nonMemberArray.push(postData);

            }
        });
        
        eb_PurchaseMembershipAdmin.shoppingCart.addSubscriptionGeneralProductsToCart(nonMemberArray).done(function (result) {
            deferred.resolve(result);
        }).fail(function (xhr, textStatus, errorThrow) {
                _that.showError(1);
                deferred.reject();
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_PurchaseMembershipAdmin));                
        });
        return deferred.promise();
    }

    /*Actions to be performed when "Proceed To Checkout" button is clicked.*/
    _that.proceedToCheckout = function () {
        _that.allowLoader(1);
        _that.addSubscriptionGeneralProductToCart().done(function () {
            _that.allowLoader(0);
            window.location.assign(eb_PurchaseMembershipAdmin.viewCartURL);
        }).fail(function () {
            _that.allowLoader(0);
            console.log("proceedToCheckout failed!!!");
        });

    }

    /*Actions to be performed on company change from company dropdown control*/
    _that.handleUserContext = function () {
        eb_PurchaseMembershipAdmin.shoppingCart.getShoppingCart().done(function () {
            _that.showError(0);
            _that.errorMessage("");
            _that.radioSelectedOptionValue("");
            _that.mainSelect(0);
            _that.companyId(_that.userContext.companyId());
            _that.companyName(_that.userContext.CompanyName());
            _that.search("");
            _that.totalChecked(0);
            _that.membershipProducts.removeAll();
            _that.loadMembershipProducts(_that.membershipProducts);
            _that.getAndLoadNonMembersDataFromServer();
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getShoppingCart failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_PurchaseMembershipAdmin);
        });

    }

    /* Filter control show hide on mobile device*/
    _that.togglefiltercontrol = function () {
        _that.filterCollapse(!_that.filterCollapse());
    };

}

/**
 * Purchase Membership Admin search function.
 * @method eb_PurchaseMembershipAdmin.searchRecords
 * @param { String } toSearch Value entered in search text - box field.
 * @param { Object } fields Array of non member properties on which search will be performed.
 * @param { Object }  nonMembers List of non-members from the company.
 **/
eb_PurchaseMembershipAdmin.searchRecords = function (toSearch, fields, nonMembers) {
    var _that = this;
    _that.filteredRecords = ko.computed(function () {
        var filteredRecords = [];
        var ifFound = false;
        var item;

        for (var record = 0; record < nonMembers.length; record++) {

            for (var field = 0; field < fields.length; field++) {
                /*check whether the field is observable or not and access the value according to it.*/
                if (ko.isObservable(nonMembers[record][fields[field]]))
                    item = nonMembers[record][fields[field]]();
                else
                    item = nonMembers[record][fields[field]];

                if (item.toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                    ifFound = true;
                    break;
                }
            }
            if (ifFound) {
                filteredRecords.push(nonMembers[record]);
                ifFound = false;
            }
        }
        return filteredRecords;
    });
};

/*Shopping cart object.*/
eb_PurchaseMembershipAdmin.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_PurchaseMembershipAdmin.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_PurchaseMembershipAdmin);
});