/**
* My Downloads class.
* @class eb_myDownloads
* */
var eb_myDownloads = eb_myDownloads || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_myDownloads.SitePath
 * @type {String}
 **/
eb_myDownloads.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_myDownloads.ServicePath
 * @type {String}
 * */
eb_myDownloads.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get list of downloads available for the logged in user.
 * @property eb_myDownloads.getMyDownloadsService
 * @type {String}
 * */
eb_myDownloads.getMyDownloadsService = eb_myDownloads.ServicePath + "ProfilePersons/{id}/DownloadableProducts";

/**
 * GET service to download single file
 * @property eb_myDownloads.getdownloadDoc
 * @type {String}
 */
eb_myDownloads.getdownloadDoc = eb_myDownloads.ServicePath + "ProfilePersons/{id}/DownloadSingleAttachment/{attachmentId}?downloadItemId={downloadItemId}";

/**
 * PATCH service to update Product Downloads record.
 * @property eb_myDownloads.updateProductDownloadsRecord
 * @type {String}
 */
eb_myDownloads.updateProductDownloadsRecord = eb_myDownloads.ServicePath + "ProfilePersons/{id}/UpdateProductDownloads/{orderId}/{productId}";

/*Default error message to be displayed.*/
eb_myDownloads.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * List of my downloads list properties on which search is applied.
 * @method eb_myDownloads.fieldsToSearch
 * @return {Object} Array of committee list property.
 */
eb_myDownloads.fieldsToSearch = function () {
    return ["id", "productName", "fileName", "orderId", "orderDate"];
};

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const MyDownloads = () => {
    const [myDownloads, setMyDownloads] = useState(null);
    const [myDownloadsToShow, setMyDownloadsToShow] = useState(null);
    const [filteredMyDownloads, setFilteredMyDownloads] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortOptionSelected, setSortOptionSelected] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filterCollapse, setFilterCollapse] = useState(0);
    const [error, setError] = useState(null);

    /*Responsible for the initial set up of the page dependencies.*/
    useEffect(() => {
        eb_UserContext.getContextData(true).done(function (userData) {
            eb_UserContext.live = new eb_UserContext.model(userData);
            if (eb_UserContext.live.isUserLoggedIn()) {
                eb_shoppingCart.getShoppingCart(eb_UserContext.live.LinkId()).done(function (cartData) {

                    var cartOptions = {};
                    cartOptions.shoppingCartData = cartData;
                    eb_shoppingCart.live = new eb_shoppingCart.shoppingCartModel(cartOptions);

                    //load footer control
                    var footerOptions = footerOptions || {};
                    footerOptions.domElement = eBusinessJQObject('#ebFooter')[0];
                    footerOptions.templatePath = eb_Config.SitePath + "html/Footer.html";
                    eb_Footer.render(footerOptions).done(function () {
                        //load header control
                        var headerOptions = headerOptions || {};
                        headerOptions.domElement = eBusinessJQObject('#ebHeaderMenu')[0];
                        headerOptions.templatePath = eb_Config.SitePath + "html/HeaderMenu.html";
                        headerOptions.userContext = eb_UserContext.live;
                        headerOptions.shoppingCart = eb_shoppingCart.live;
                        headerOptions.sitePath = "../";
                        eb_HeaderMenu.render(headerOptions).done(function () {
                            eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                            ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement); /*Apply KO bindings, fire up the control*/

                            /*Fetch call to retrieve list of committees.*/
                            fetch(eb_myDownloads.getMyDownloadsService.replace("{id}", eb_UserContext.live.LinkId()), {
                                method: 'get',
                                credentials: 'include'
                            }).then(response => {
                                if (!response.ok) {
                                    throw Error(eb_myDownloads.defaultErrorMessage);
                                }
                                return response.json();
                            }).then(data => {
                                extractModels(data);
                                setIsLoading(false);
                                setError(null);
                            }).catch(err => {
                                setIsLoading(false);
                                setError(err.message);
                            });
                        }).fail(function (data, msg, jhr) {
                            console.error('Failed to render header control...');
                            eb_Config.getErrorMessageForControl(data.responseJSON, eb_myDownloads);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render footer control...');
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to getShoppingCart...');
                    eb_Config.getErrorMessageForControl(data.responseJSON, eb_myDownloads);
                });
            } else {
                window.location.assign(eb_Config.loginPageURL);
            }
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });
    }, []);

    /*Set up myDownloads state in the form an array that consists of bifurcations based on filters applied on order date.*/
    const extractModels = data => {
        var models = [];
        var categoryList = [{ name: 'Last 30 days', records: [] }, { name: 'Last 90 days', records: [] }, { name: 'Last 180 days', records: [] }, { name: 'Last Year', records: [] }, { name: 'All Time', records: [] }];
        var date = new Date(); /*get current date of system*/
        var thirtyDaysThreshold = new Date(date.setDate(date.getDate() - 30));
        var nintyDaysThreshold = new Date(date.setDate(date.getDate() - 90));
        var halfYearlyDaysThreshold = new Date(date.setDate(date.getDate() - 180));
        var yearlyDaysThreshold = new Date(date.setDate(date.getDate() - 365));

        if (data === null) {
            setMyDownloads(categoryList);
            filterData(categoryList, 'All Time');
            return;
        }

        for (var index = 0; index < data.length; index++) {
            var row = data[index];
            models.push(row);

            var categoryRecord = categoryList.find(record => record.name === 'All Time');

            if (categoryRecord) {
                categoryRecord.records.push(row);
            }

            if (row.orderDate.toString().split('T')[0] >= thirtyDaysThreshold.toISOString().split('T')[0]) {
                var categoryRecord = categoryList.find(record => record.name === 'Last 30 days');

                if (categoryRecord) {
                    categoryRecord.records.push(row);
                }
            }
            if (row.orderDate.toString().split('T')[0] >= nintyDaysThreshold.toISOString().split('T')[0]) {
                var categoryRecord = categoryList.find(record => record.name === 'Last 90 days');

                if (categoryRecord) {
                    categoryRecord.records.push(row);
                }
            }
            if (row.orderDate.toString().split('T')[0] >= halfYearlyDaysThreshold.toISOString().split('T')[0]) {
                var categoryRecord = categoryList.find(record => record.name === 'Last 180 days');

                if (categoryRecord) {
                    categoryRecord.records.push(row);
                }
            }
            if (row.orderDate.toString().split('T')[0] >= yearlyDaysThreshold.toISOString().split('T')[0]) {
                var categoryRecord = categoryList.find(record => record.name === 'Last Year');

                if (categoryRecord) {
                    categoryRecord.records.push(row);
                }
            }
        }
        setMyDownloads(categoryList);
        filterData(categoryList, 'All Time');
        return;
    };

    /*Filter data according to filter set.*/
    const filterData = (data, filter) => {
        setSortOptionSelected('');
        setSearchTerm('');
        setSelectedFilter(filter);

        var filteredData = [];

        if (data === null) {
            setFilteredMyDownloads(filteredData);
            setMyDownloadsToShow(filteredData);
        } else {
            filteredData = data.filter(category => category.name.includes(filter));
            setFilteredMyDownloads(filteredData[0].records);
            setMyDownloadsToShow(filteredData[0].records);
        }
    };

    /*Gets called everytime something is typed in the search bar.*/
    useEffect(() => {
        setSortOptionSelected('');
        if (filteredMyDownloads && filteredMyDownloads.length > 0) {
            const searchItems = setTimeout(() => {

                var filteredRecords = [];
                var ifFound = false;
                var item;

                for (var record = 0; record < filteredMyDownloads.length; record++) {

                    for (var field = 0; field < eb_myDownloads.fieldsToSearch().length; field++) {
                        item = filteredMyDownloads[record][eb_myDownloads.fieldsToSearch()[field]];

                        if (item.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            ifFound = true;
                            break;
                        }
                    }
                    if (ifFound) {
                        filteredRecords.push(filteredMyDownloads[record]);
                        ifFound = false;
                    }
                }
                setMyDownloadsToShow(filteredRecords);
            }, 500);

            return () => clearTimeout(searchItems);
        } else {
            return;
        }
    }, [searchTerm]);

    /*To expand/collapse filter on mobile*/
    const toggleFilterControl = () => {
        setFilterCollapse(!filterCollapse);
    };

    /*Sorting function.*/
    const sortMyDownloads = e => {
        setSortOptionSelected(e.target.value);
        if (e.target.value == 'productName') {
            setMyDownloadsToShow([...myDownloadsToShow.sort((a, b) => a.productName.localeCompare(b.productName))]);
        }
        if (e.target.value == 'fileName') {
            setMyDownloadsToShow([...myDownloadsToShow.sort((a, b) => a.fileName.localeCompare(b.fileName))]);
        }
        if (e.target.value == 'orderId') {
            setMyDownloadsToShow([...myDownloadsToShow.sort((a, b) => a.orderId - b.orderId)]);
        }
        if (e.target.value == 'orderDate') {
            setMyDownloadsToShow([...myDownloadsToShow.sort((a, b) => {
                return new Date(a.orderDate) - new Date(b.orderDate);
            })]);
        }
    };

    /*Text to display on download link for each row.*/
    const textToDisplay = item => {
        var expiryDate = new Date(item.DownloadExpirationDate);
        var today = new Date();
        if (expiryDate < today) {
            return "Download Expired";
        }
        if (item.MaximumNumberOfDownloads > 0 && item.NumberOfDownloads >= item.MaximumNumberOfDownloads) {
            return "Max Downloads Reached";
        }

        return "Download";
    };

    /*Responsible for downloading the attachment and refreshing the list of downloads.*/
    const downloadAttachment = (e, item) => {
        setIsLoading(true);
        var service = eb_myDownloads.getdownloadDoc.replace("{id}", eb_UserContext.live.LinkId()).replace("{attachmentId}", item.id).replace("{downloadItemId}", item.downloadItemId);

        const link = document.createElement('a');
        link.href = service;
        link.target = '_blank';
        link.dispatchEvent(new MouseEvent('click')); //Starts downloading the attachment

        /*Update the Product Downloads record.*/
        eb_Config.retrieveCSRFTokens().always(function (headers) {
            Object.assign(headers, { 'Content-type': 'application/json; charset=UTF-8' });
            var patchService = eb_myDownloads.updateProductDownloadsRecord.replace("{id}", eb_UserContext.live.LinkId()).replace("{orderId}", item.orderId).replace("{productId}", item.productId);
            fetch(patchService, {
                method: 'PATCH',
                headers: headers,
                credentials: 'include'
            }).then(response => {
                if (!response.ok) {
                    throw Error(eb_myDownloads.defaultErrorMessage);
                }
                return response;
            }).then(data => {
                /*Get the refreshed information of the list of downloads available for the user.*/
                fetch(eb_myDownloads.getMyDownloadsService.replace("{id}", eb_UserContext.live.LinkId()), {
                    method: 'get',
                    credentials: 'include'
                }).then(response => {
                    if (!response.ok) {
                        throw Error(eb_myDownloads.defaultErrorMessage);
                    }
                    return response.json();
                }).then(data => {
                    extractModels(data);
                    setIsLoading(false);
                    setError(null);
                }).catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                });
            }).catch(err => {
                setIsLoading(false);
                setError(err.message);
            });
        });
    };

    return React.createElement(
        "div",
        { className: "myDownloads" },
        myDownloadsToShow && React.createElement(
            "div",
            { id: "ebMyDownloads", className: "ebMyDownloads" },
            React.createElement(
                "div",
                { className: "ebusiness-all-products  ebWrapper  ebClear ebusiness-main-container offcanvas" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-lg-2" },
                            React.createElement(
                                "div",
                                { className: "text-right" },
                                React.createElement(
                                    "span",
                                    { className: "d-inline d-sm-inline d-md-inline d-lg-none", onClick: toggleFilterControl },
                                    React.createElement(
                                        "a",
                                        { className: "fa-icon", title: "Sort/Filter" },
                                        React.createElement("img", { src: "../images/icons/fontawesome/filter.svg" })
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { id: "filterSort", className: filterCollapse ? "isFilterOpen" : "isFilterClosed" },
                                React.createElement(
                                    "div",
                                    { className: "ebusiness-filter-details-panel" },
                                    React.createElement(
                                        "div",
                                        { className: "ebusiness-sorting" },
                                        React.createElement(
                                            "div",
                                            { className: "ebusiness-filter-section-title ebusiness-filter-options" },
                                            "Sorting"
                                        ),
                                        React.createElement(
                                            "ul",
                                            { role: "menu" },
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "label",
                                                    { className: "cat-name" },
                                                    React.createElement("input", { type: "radio", name: "radioGroupSort", value: "productName", checked: sortOptionSelected === 'productName', onChange: sortMyDownloads }),
                                                    "Product Name"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "label",
                                                    { className: "cat-name" },
                                                    React.createElement("input", { type: "radio", name: "radioGroupSort", value: "fileName", checked: sortOptionSelected === 'fileName', onChange: sortMyDownloads }),
                                                    "File Name"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "label",
                                                    { className: "cat-name" },
                                                    React.createElement("input", { type: "radio", name: "radioGroupSort", value: "orderId", checked: sortOptionSelected === 'orderId', onChange: sortMyDownloads }),
                                                    "Order ID"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "label",
                                                    { className: "cat-name" },
                                                    React.createElement("input", { type: "radio", name: "radioGroupSort", value: "orderDate", checked: sortOptionSelected === 'orderDate', onChange: sortMyDownloads }),
                                                    "Order Date"
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { "class": "ebusiness-filter" },
                                        React.createElement(
                                            "div",
                                            { "class": "ebusiness-filter-section-title" },
                                            "Filters"
                                        ),
                                        React.createElement(
                                            "div",
                                            { "class": "ebusiness-filter-options" },
                                            React.createElement(
                                                "ul",
                                                { role: "menu" },
                                                myDownloads.map(category => React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "label",
                                                        null,
                                                        React.createElement("input", { type: "radio", value: category.name, checked: selectedFilter === category.name, onChange: e => filterData(myDownloads, e.target.value) }),
                                                        React.createElement(
                                                            "span",
                                                            { className: "cat-name" },
                                                            React.createElement(
                                                                "span",
                                                                null,
                                                                category.name
                                                            )
                                                        )
                                                    )
                                                ))
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-lg-10" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "productCatalogModal" },
                                    React.createElement(
                                        "div",
                                        { className: "ebusiness-filter-control" },
                                        React.createElement(
                                            "div",
                                            { className: "row" },
                                            React.createElement(
                                                "div",
                                                { className: "col-sm-4" },
                                                React.createElement(
                                                    "h3",
                                                    null,
                                                    "My Downloads"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-sm-8 ebusiness-view-switcher" },
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement("input", { name: "txteventsListSearch", type: "text", placeholder: "Search", className: "form-control required ebusiness-clientside-generic-search-animated", value: searchTerm, onChange: e => setSearchTerm(e.target.value) })
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "d-sm-none d-xs-none d-none d-md-block" },
                                    React.createElement(
                                        "div",
                                        { className: "ebMyOrderHeader row ml-0 mr-0" },
                                        React.createElement(
                                            "div",
                                            { className: "col-md-3" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Product Name"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-3" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " File Name"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Order ID"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Order Date"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Download"
                                            )
                                        )
                                    )
                                ),
                                myDownloadsToShow.length < 1 && React.createElement(
                                    "div",
                                    { className: "NoRecords text-center" },
                                    React.createElement(
                                        "span",
                                        null,
                                        "No records found."
                                    )
                                ),
                                myDownloadsToShow.length > 0 && React.createElement(
                                    "div",
                                    { className: "ebusiness-my-orderlist" },
                                    myDownloadsToShow.map(download => React.createElement(
                                        "div",
                                        { className: "ebusiness-my-orders-list" },
                                        React.createElement(
                                            "div",
                                            { className: "row order-heading-panel" },
                                            React.createElement(
                                                "div",
                                                { className: "col-md-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { className: "label-orders" },
                                                    " Product Name"
                                                ),
                                                download.productName
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { className: "label-orders" },
                                                    " File Name"
                                                ),
                                                download.fileName
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { className: "label-orders" },
                                                    " Order ID"
                                                ),
                                                download.orderId
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { className: "label-orders" },
                                                    " Order Date"
                                                ),
                                                moment(download.orderDate).format(eb_Config.defaultDateFormat)
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { className: "label-orders" },
                                                    " Download"
                                                ),
                                                React.createElement(
                                                    "a",
                                                    { className: textToDisplay(download) == "Download Expired" || textToDisplay(download) == "Max Downloads Reached" ? 'eb-disable-link' : '', onClick: e => downloadAttachment(e, download) },
                                                    textToDisplay(download)
                                                )
                                            )
                                        )
                                    ))
                                )
                            )
                        )
                    )
                )
            )
        ),
        isLoading && React.createElement(
            "div",
            { className: "loaderwrapper", style: { display: 'none' } },
            React.createElement("div", { className: "ebloader" })
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('myDownloads'));
root.render(React.createElement(MyDownloads, null));