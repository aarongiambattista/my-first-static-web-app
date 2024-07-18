/**
* Committee Term Members class.
* @class eb_committeeTermMembers
* */
var eb_committeeTermMembers = eb_committeeTermMembers || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_committeeTermMembers.SitePath
 * @type {String}
 **/
eb_committeeTermMembers.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_committeeTermMembers.ServicePath
 * @type {String}
 * */
eb_committeeTermMembers.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get committee term information.
 * @property eb_committeeTermMembers.getCommitteeTermInformationService
 * @type {String}
 * */
eb_committeeTermMembers.getCommitteeTermInformationService = eb_committeeTermMembers.ServicePath + "Committees/General/{id}";

/**
 * Service path to get committee term members list.
 * @property eb_committeeTermMembers.getCommitteeTermMembersService
 * @type {String}
 * */
eb_committeeTermMembers.getCommitteeTermMembersService = eb_committeeTermMembers.ServicePath + "Committees/Members/{id}";

/* To Check blank date, if we didn't enter any value in date in smart client, then by default it returns "01/01/0001" */
eb_committeeTermMembers.defaultDate = "01/01/0001";

/* If date was entered and then later deleted in smart client, then by default it returns "01/01/1900" */
eb_committeeTermMembers.defaultDateAfterDeletion = "01/01/1900";

/*Default error message to be displayed.*/
eb_committeeTermMembers.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * GET product id from URL
 * @property  eb_committeeTermGeneral.committeeId
 * @type {String}
 */
eb_committeeTermMembers.committeeId = eb_Config.getUrlParameter("committeeId");

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const CommitteeTermMembers = () => {
    const [committeeTermMembers, setCommitteeTermMembers] = useState(null);
    const [committeeTermInfo, setCommitteeTermInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /*Responsible for the initial set up of the page dependencies.*/
    useEffect(() => {
        eb_UserContext.getContextData(true).done(function (userData) {
            eb_UserContext.live = new eb_UserContext.model(userData);

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
                    headerOptions.activePage = "committeeTermMembers";
                    headerOptions.sitePath = "../";
                    eb_HeaderMenu.render(headerOptions).done(function () {
                        eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                        ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement); /*Apply KO bindings, fire up the control*/

                        /*Fetch call to retrieve list of committees.*/
                        fetch(eb_committeeTermMembers.getCommitteeTermMembersService.replace("{id}", eb_committeeTermMembers.committeeId), {
                            method: 'get',
                            credentials: 'include'
                        }).then(response => {
                            if (!response.ok) {
                                throw Error(eb_committeeTermMembers.defaultErrorMessage);
                            }
                            return response.json();
                        }).then(data => {
                            setCommitteeTermMembers(data);
                            setIsLoading(false);
                            setError(null);
                        }).catch(err => {
                            setIsLoading(false);
                            setError(err.message);
                        });

                        fetch(eb_committeeTermMembers.getCommitteeTermInformationService.replace("{id}", eb_committeeTermMembers.committeeId), {
                            method: 'get',
                            credentials: 'include'
                        }).then(response => {
                            if (!response.ok) {
                                throw Error(eb_committeeTermMembers.defaultErrorMessage);
                            }
                            return response.json();
                        }).then(data => {
                            setCommitteeTermInfo(data);
                            setIsLoading(false);
                            setError(null);
                        }).catch(err => {
                            setIsLoading(false);
                            setError(err.message);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render header control...');
                        eb_Config.getErrorMessageForControl(data.responseJSON, eb_committeeTermMembers);
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to render footer control...');
                });
            }).fail(function (data, msg, jhr) {
                console.error('Failed to getShoppingCart...');
                eb_Config.getErrorMessageForControl(data.responseJSON, eb_committeeTermMembers);
            });
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });
    }, []);

    /*Returns date in valid eBusiness format, mm/dd/yyyy. However, returns null for blank dates.*/
    const validDate = date => {
        const validFormattedDate = moment(date).format(eb_Config.defaultDateFormat);
        if (validFormattedDate != eb_committeeTermMembers.defaultDate && validFormattedDate != eb_committeeTermMembers.defaultDateAfterDeletion) {
            return validFormattedDate;
        } else {
            return null;
        }
    };
    return React.createElement(
        "div",
        { className: "committeeTermMembers" },
        committeeTermMembers && committeeTermInfo && React.createElement(
            "div",
            { id: "ebCommitteeTerm", className: "ebCommitteeTerm" },
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
                            { className: "col-sm-12" },
                            React.createElement(
                                "h3",
                                null,
                                "Committee Term"
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "ebCommitteeInformation" },
                    React.createElement(
                        "h4",
                        null,
                        committeeTermInfo.Name
                    ),
                    React.createElement(
                        "span",
                        null,
                        committeeTermInfo.CommitteeName
                    ),
                    React.createElement("hr", null)
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
                                { className: "ebCommitteeTermList" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        { className: "ebusiness-user-profile-orders-icon ebusiness-profile-tab-style" },
                                        React.createElement(
                                            "a",
                                            { href: 'CommitteeTermGeneral.html?committeeId=' + eb_committeeTermMembers.committeeId, title: "General" },
                                            React.createElement("img", { src: "../images/icons/icon_circle-info-solid.svg" }),
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "eb-menu-label" },
                                                "General"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        { className: "ebusiness-user-profile-profile-icon ebusiness-profile-tab-style active-maintab" },
                                        React.createElement(
                                            "a",
                                            { href: "#", title: "Members" },
                                            React.createElement("img", { src: "../images/icons/icon_profile-32px.svg" }),
                                            React.createElement(
                                                "span",
                                                { className: "eb-menu-label" },
                                                " Members"
                                            )
                                        ),
                                        " "
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
                                    { className: "ebCommitteeTermHeading" },
                                    React.createElement(
                                        "h4",
                                        null,
                                        "Member List"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "d-sm-none d-xs-none d-none d-md-block" },
                                    React.createElement(
                                        "div",
                                        { className: "ebMyOrderHeader row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-md-3" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Member"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Title"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Start"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-2" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " End"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-3" },
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "heading-labels-orders" },
                                                " Email"
                                            )
                                        )
                                    )
                                ),
                                committeeTermMembers.length < 1 && React.createElement(
                                    "div",
                                    { className: "NoRecords text-center" },
                                    React.createElement(
                                        "span",
                                        null,
                                        "No records found."
                                    )
                                ),
                                committeeTermMembers.length > 0 && React.createElement(
                                    "div",
                                    { className: "ebusiness-my-orderlist" },
                                    committeeTermMembers.map(member => React.createElement(
                                        "div",
                                        { className: "ebusiness-my-orders-list", key: member.Id },
                                        React.createElement(
                                            "div",
                                            { className: "row order-heading-panel" },
                                            React.createElement(
                                                "div",
                                                { className: "col-md-3 col-sm-3 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Member"
                                                ),
                                                member.FirstLast
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 col-sm-2 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Title"
                                                ),
                                                member.Title
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 col-sm-2 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Start"
                                                ),
                                                validDate(member.StartDate)
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-2 col-sm-2 ebusiness-order-id-dwnld" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " End"
                                                ),
                                                validDate(member.EndDate)
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-md-3 col-sm-3 ebusiness-order-id-dwnld a-members-email" },
                                                React.createElement(
                                                    "span",
                                                    { "class": "label-orders" },
                                                    " Email"
                                                ),
                                                member.Email
                                            )
                                        )
                                    ))
                                )
                            )
                        ),
                        isLoading && React.createElement(
                            "div",
                            { className: "loaderwrapper", style: { display: 'none' } },
                            React.createElement("div", { className: "ebloader" })
                        )
                    )
                )
            )
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('committeeTermMembers'));
root.render(React.createElement(CommitteeTermMembers, null));