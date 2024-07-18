/**
 * Filter Sort class.
 * @class eb_filterSort
 * */
var eb_filterSort = eb_filterSort || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_filterSort.SitePath
 * @type {String}
 * */
eb_filterSort.SitePath = eb_Config.SitePath;

/**
 * Filter sort template path.
 * @property eb_filterSort.TemplatePath
 * @type {String}
 * */
eb_filterSort.TemplatePath = "html/my/FilterSort.html";

/**
 * SOA path.
 * @property eb_filterSort.ServicePath
 * @type {String}
 * */
eb_filterSort.ServicePath = eb_Config.ServicePathV1;

/**
 * The service will return filter sort HTML.
 * @method eb_filterSort.render
 * @param {any} options Array of requried data.
 * @param {String} options.templatePath Filter sort template URL.
 * @return {String} Filter sort HTML template.
 * */
eb_filterSort.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_filterSort.SitePath + eb_filterSort.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};

/*Handle the response from the server re our input*/
eb_filterSort.HandleResponse = function (data) {
    /*Todo: Handle response from server*/
};

/*A list of known service responses and the messages that should be displayed to the user in the event that they are recieved.*/
eb_filterSort.KnownResponses = [
    { code: "Error", message: "There was a problem loading the page" },
    { code: "Failure", message: "Your request could not be completed." }];

/**
 * Order filter sort model.
 * Responsible to all order filter operations.
 * @method eb_filterSort.model
 * @param {any} options Object of required data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {String} options.personId User Linked ID.
 * @param {Object} options.domElement Product catalog DOM element.
 * @param {Object} options.data List of orders.
 */
eb_filterSort.model = function (options) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    _that.radioSelectedOptionValue = ko.observable("Latest"); /*By default selected latest order*/
    _that.selectedCategory = ko.observable("All Time");/* By default selected allTime filter*/
    _that.filterCollapse = ko.observable(0); /*To collapse filter on mobile*/
    _that.orderData = ko.observableArray();
    if (options.data) {
        _that.orderData = ko.observableArray(options.data);/*Already data in array*/
    }

    if (options.orderHistoryObject) {
        eb_filterSort.orderHistoryObject(options.orderHistoryObject);
    }

    /*filter by days*/
    _that.filterByDays = function () {
        if (_that.selectedCategory() === "All Time") {
            if (eb_filterSort.orderHistoryObject) {
                eb_filterSort.orderHistoryObject.loadOrderHistoryDataFromServer(_that.orderData());
                eb_filterSort.orderHistoryObject.filterData(_that.selectedCategory());
            }
            return true;
        }
        var days = _that.selectedCategory().split(" ")[0];
        var date = new Date(); /*get current date of system*/
        var d = new Date(date.setDate(date.getDate() - days));
        var dateString = d.toISOString().split('T')[0];

        var filteredOrderData = _that.orderData().filter(function (a, idx) {
            var orderDate = a.orderDate.toString().split('T')[0];
            return orderDate >= dateString ? true : false;
        });

        if (eb_filterSort.orderHistoryObject) {
            eb_filterSort.orderHistoryObject.loadOrderHistoryDataFromServer(filteredOrderData);
            eb_filterSort.orderHistoryObject.filterData(_that.selectedCategory());
        }
        return true;
    };

    /*Sort data by Latest*/
    _that.setLatestOrders = function () {

        /*Get Id in descending order for latest order*/
        _that.orderData().sort(function (a, b) {
            return b.id - a.id;
        });

        /*To Sort by date, with latest id of current date*/
        _that.orderData().sort(function (a, b) {
            return new Date(b.orderDate) - new Date(a.orderDate);
        });

        if (eb_filterSort.orderHistoryObject) {
            eb_filterSort.orderHistoryObject.loadOrderHistoryDataFromServer(_that.orderData());
            eb_filterSort.orderHistoryObject.sortData(_that.radioSelectedOptionValue());
            /*Calling filter by days*/
            _that.filterByDays();
        }
        return true;
    };

    /*By default it takes latest order*/
    _that.setLatestOrders();

    /*Sort data by oldest*/
    _that.setOldestData = function () {

        /*Get Id in ascending order for oldest order*/
        _that.orderData().sort(function (a, b) {
            return a.id - b.id;
        });

        /*To sort the order by oldest order*/
        _that.orderData().sort(function (a, b) {
            return new Date(a.orderDate) - new Date(b.orderDate);
        });

        if (eb_filterSort.orderHistoryObject) {
            eb_filterSort.orderHistoryObject.loadOrderHistoryDataFromServer(_that.orderData());
            eb_filterSort.orderHistoryObject.sortData(_that.radioSelectedOptionValue());
            /*Calling filter by days*/
            _that.filterByDays();
        }
        return true;
    };

    /*Sort data by orderType*/
    _that.setOrderType = function () {
        /*for sorting the array by order type*/
        _that.sortOrderType = function (array) {
            var done = false;
            while (!done) {
                done = true;
                for (var i = 1; i < array.length; i += 1) {
                    if (array[i - 1].orderType > array[i].orderType) {
                        done = false;
                        var tmp = array[i - 1];
                        array[i - 1] = array[i];
                        array[i] = tmp;
                    }
                }
            }
            return array;
        };

        _that.sortOrderType(_that.orderData());
        if (eb_filterSort.orderHistoryObject) {
            eb_filterSort.orderHistoryObject.loadOrderHistoryDataFromServer(_that.orderData());
            eb_filterSort.orderHistoryObject.sortData(_that.radioSelectedOptionValue());
            /*Calling filter by days*/
            _that.filterByDays();
        }
        return true;
    };

    /*By default it check the All Time Record*/
    _that.filterByDays();

    /* Filter control show hide on mobile device*/
    _that.toggleFilterControl = function () {
        _that.filterCollapse(!_that.filterCollapse());
    };
};

/**
 * Global function to hold order history object.
 * @method eb_filterSort.orderHistoryObject
 * @param {Object} orderHistoryObject Instance of eb_OrderHistory.model.
 */
eb_filterSort.orderHistoryObject = function (orderHistoryObject) {
    var self = this;
    self.orderHistoryObject = orderHistoryObject;
};
