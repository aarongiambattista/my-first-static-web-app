/**
* Committee Listing class.
* @class eb_committeeListing
* */
var eb_committeeListing = eb_committeeListing || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_committeeListing.SitePath
 * @type {String}
 **/
eb_committeeListing.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_committeeListing.ServicePath
 * @type {String}
 * */
eb_committeeListing.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get committees list.
 * @property eb_committeeListing.getCommitteeListService
 * @type {String}
 * */
eb_committeeListing.getCommitteeListService = eb_committeeListing.ServicePath + "Committees?sort=id";

/* To Check blank date, if we didn't enter any value in date in smart client, then by default it returns "01/01/0001" */
eb_committeeListing.defaultDate = "01/01/0001";

/* If date was entered and then later deleted in smart client, then by default it returns "01/01/1900" */
eb_committeeListing.defaultDateAfterDeletion = "01/01/1900";

/*Default error message to be displayed.*/
eb_committeeListing.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * List of committee list properties on which search is applied.
 * @method eb_committeeListing.fieldsToSearch
 * @return {Object} Array of committee list property.
 */
eb_committeeListing.fieldsToSearch = function () {
    return ["Id", "Name", "Description", "Goals", "DateFounded"];
};

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const CommitteeListing = () => {
    const [committeeList, setCommitteeList] = useState(null);
    const [committeeListToShow, setCommitteeListToShow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortOptionSelected, setSortOptionSelected] = useState('');
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
                        headerOptions.activePage = "committeeListing";
                        headerOptions.sitePath = "../";
                        eb_HeaderMenu.render(headerOptions).done(function () {
                            eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                            ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement); /*Apply KO bindings, fire up the control*/

                            /*Fetch call to retrieve list of committees.*/
                            fetch(eb_committeeListing.getCommitteeListService, {
                                method: 'get',
                                credentials: 'include'
                            }).then(response => {
                                if (!response.ok) {
                                    throw Error(eb_committeeListing.defaultErrorMessage);
                                }
                                return response.json();
                            }).then(data => {
                                setCommitteeList(data);
                                setCommitteeListToShow(data);
                                setIsLoading(false);
                                setError(null);
                            }).catch(err => {
                                setIsLoading(false);
                                setError(err.message);
                            });
                        }).fail(function (data, msg, jhr) {
                            console.error('Failed to render header control...');
                            eb_Config.getErrorMessageForControl(data.responseJSON, eb_committeeListing);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render footer control...');
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to getShoppingCart...');
                    eb_Config.getErrorMessageForControl(data.responseJSON, eb_committeeListing);
                });
            } else {
                window.location.assign(eb_Config.loginPageURL);
            }
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });
    }, []);

    /*Gets called everytime something is typed in the search bar.*/
    useEffect(() => {
        setSortOptionSelected('');
        if (committeeList && committeeList.length > 0) {
            const searchItems = setTimeout(() => {

                var filteredRecords = [];
                var ifFound = false;
                var item;

                for (var record = 0; record < committeeList.length; record++) {

                    for (var field = 0; field < eb_committeeListing.fieldsToSearch().length; field++) {
                        item = committeeList[record][eb_committeeListing.fieldsToSearch()[field]];

                        if (item.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            ifFound = true;
                            break;
                        }
                    }
                    if (ifFound) {
                        filteredRecords.push(committeeList[record]);
                        ifFound = false;
                    }
                }
                setCommitteeListToShow(filteredRecords);
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

    /*Returns date in valid eBusiness format, mm/dd/yyyy. However, returns null for blank dates.*/
    const validDate = dateFounded => {
        const validFormattedDate = moment(dateFounded).format(eb_Config.defaultDateFormat);
        if (validFormattedDate != eb_committeeListing.defaultDate && validFormattedDate != eb_committeeListing.defaultDateAfterDeletion) {
            return validFormattedDate;
        } else {
            return null;
        }
    };

    /*Sorting function.*/
    const sortCommitteeList = e => {
        setSortOptionSelected(e.target.value);
        if (e.target.value == 'name') {
            setCommitteeListToShow([...committeeListToShow.sort((a, b) => a.Name.localeCompare(b.Name))]);
        }
        if (e.target.value == 'date') {
            setCommitteeListToShow([...committeeListToShow.sort((a, b) => {
                return new Date(a.DateFounded) - new Date(b.DateFounded);
            })]);
        }
    };

    return React.createElement(
        "div",
        { className: "committeeListing" },
        committeeListToShow && React.createElement(
            "div",
            { id: "ebCommitteeListing", className: "ebCommitteeListing" },
            React.createElement(
                "div",
                { className: "ebusiness-all-products  ebWrapper  ebClear ebusiness-main-container offcanvas" },
                React.createElement(
                    "div",
                    { className: "productCatalogModal" },
                    React.createElement(
                        "div",
                        { className: "ebusiness-filter-control row" },
                        React.createElement(
                            "div",
                            { className: "col-sm-3" },
                            React.createElement(
                                "h3",
                                null,
                                "Committee Listing"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9 ebusiness-view-switcher" },
                            React.createElement(
                                "span",
                                null,
                                React.createElement("input", { name: "txteventsListSearch", type: "text", placeholder: "Search", className: "form-control required ebusiness-clientside-generic-search-animated", onChange: e => setSearchTerm(e.target.value) })
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-lg-2 col-md-3" },
                            React.createElement(
                                "div",
                                { className: "text-right" },
                                React.createElement(
                                    "span",
                                    { className: "d-inline d-sm-inline d-md-none", onClick: toggleFilterControl },
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
                                            "Sort By"
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
                                                    React.createElement("input", { type: "radio", name: "radioGroupSort", value: "name", checked: sortOptionSelected === 'name', onChange: sortCommitteeList }),
                                                    "Name"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "label",
                                                    { className: "cat-name" },
                                                    React.createElement("input", { type: "radio", name: "radioGroupSort", value: "date", checked: sortOptionSelected === 'date', onChange: sortCommitteeList }),
                                                    "Date Founded"
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-lg-10 col-md-9" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "d-sm-none d-xs-none d-none d-md-block" },
                                    React.createElement(
                                        "div",
                                        { className: "ebMyOrderHeader row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Name"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-3" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Description"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-5" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Goals"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Date Founded"
                                            )
                                        )
                                    )
                                ),
                                committeeListToShow.length < 1 && React.createElement(
                                    "div",
                                    { className: "NoRecords text-center" },
                                    React.createElement(
                                        "span",
                                        null,
                                        "No records found."
                                    )
                                ),
                                committeeListToShow.length > 0 && React.createElement(
                                    "div",
                                    { className: "ebusiness-my-orderlist" },
                                    committeeListToShow.map(committee => React.createElement(
                                        "div",
                                        { className: "ebusiness-my-orders-list", key: committee.Id },
                                        React.createElement(
                                            "div",
                                            { className: "row order-heading-panel" },
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 col-sm-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Name"
                                                ),
                                                committee.Name
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-3 col-sm-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Description"
                                                ),
                                                committee.Description
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-5 col-sm-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Goals"
                                                ),
                                                committee.Goals
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 col-sm-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Date Founded"
                                                ),
                                                validDate(committee.DateFounded)
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

const root = ReactDOM.createRoot(document.getElementById('committeeListing'));
root.render(React.createElement(CommitteeListing, null));