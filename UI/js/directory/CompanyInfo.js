/**
* Company Info class.
* @class eb_companyInfo
* */
var eb_companyInfo = eb_companyInfo || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_companyInfo.SitePath
 * @type {String}
 **/
eb_companyInfo.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_companyInfo.ServicePath
 * @type {String}
 * */
eb_companyInfo.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get company info.
 * @property eb_companyInfo.getCompanyInfoService
 * @type {String}
 * */
eb_companyInfo.getCompanyInfoService = eb_companyInfo.ServicePath + "getCompanyInfo/{Id}";

/**
 * GET company id from URL
 * @property  eb_companyInfo.companyId
 * @type {String}
 */
eb_companyInfo.companyId = eb_Config.getUrlParameter("companyId");

/* To Check blank date, if we didn't enter any value in date in smart client, then by default it returns "01/01/0001" */
eb_companyInfo.defaultDate = "01/01/0001";

/* If date was entered and then later deleted in smart client, then by default it returns "01/01/1900" */
eb_companyInfo.defaultDateAfterDeletion = "01/01/1900";

/*Default error message to be displayed.*/
eb_companyInfo.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * Default company image URL.
 * If company image is not available, default image will be shown.
 * @property eb_companyInfo.defaultImage
 * @type {String}
 * */
eb_companyInfo.defaultImage = eb_Config.companyImageURL + "coming-soon.png";

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const CompanyInfo = () => {
    const [companyInfo, setCompanyInfo] = useState(null);
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
                    headerOptions.activePage = "companyInfo";
                    headerOptions.sitePath = "../";
                    eb_HeaderMenu.render(headerOptions).done(function () {
                        eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                        ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement); /*Apply KO bindings, fire up the control*/

                        /*Fetch call to retrieve list of committees.*/
                        fetch(eb_companyInfo.getCompanyInfoService.replace("{Id}", eb_companyInfo.companyId), {
                            method: 'get',
                            credentials: 'include'
                        }).then(response => {
                            if (!response.ok) {
                                throw Error(eb_companyInfo.defaultErrorMessage);
                            }
                            return response.json();
                        }).then(data => {
                            setCompanyInfo(data);
                            setIsLoading(false);
                            setError(null);
                        }).catch(err => {
                            setIsLoading(false);
                            setError(err.message);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render header control...');
                        eb_Config.getErrorMessageForControl(data.responseJSON, eb_companyInfo);
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to render footer control...');
                });
            }).fail(function (data, msg, jhr) {
                console.error('Failed to getShoppingCart...');
                eb_Config.getErrorMessageForControl(data.responseJSON, eb_companyInfo);
            });
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });
    }, []);

    /*Returns date in valid eBusiness format, mm/dd/yyyy. However, returns null for blank dates.*/
    const validDate = date => {
        const validFormattedDate = date != null ? moment(date).format(eb_Config.defaultDateFormat) : date;
        if (validFormattedDate != eb_companyInfo.defaultDate && validFormattedDate != eb_companyInfo.defaultDateAfterDeletion) {
            return validFormattedDate;
        } else {
            return null;
        }
    };

    const companyImage = companyId => {
        if (eb_Config.loadDefaultImage) {
            return eb_companyInfo.defaultImage;
        } else {
            return eb_Config.companyImageURL + companyId + eb_Config.imageExtension;
        }
    };

    const getClickableLink = link => {
        return link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
    };

    const getFormattedDescription = data => {
        return eBusinessJQObject("<html>" + data + "</html>").text();
    };

    const getFormattedPhoneAndFax = (areaCode, number) => {
        return areaCode != null && areaCode != "" ? "(" + areaCode + ") " + number : number;
    };

    return React.createElement(
        "div",
        { className: "companyInfo" },
        companyInfo && React.createElement(
            "div",
            { id: "companyInformation", "class": "eb-company-details-page" },
            React.createElement(
                "div",
                { "class": "ebWrapper ebClear ebusiness-main-container offcanvas" },
                React.createElement(
                    "div",
                    { "class": "ebusiness-filter-control" },
                    React.createElement(
                        "div",
                        { "class": "row" },
                        React.createElement(
                            "div",
                            { "class": "col-6" },
                            React.createElement(
                                "h3",
                                null,
                                "Company Details"
                            )
                        ),
                        React.createElement(
                            "div",
                            { "class": "col-6 ebusiness-view-switcher" },
                            React.createElement(
                                "div",
                                { "class": "dropdown" },
                                React.createElement(
                                    "a",
                                    { href: "CompanyDirectory.html", "class": "eb-back-link" },
                                    "Back to Directory"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { "class": "eb-comp-description" },
                    React.createElement(
                        "div",
                        { "class": "eb-comp-logo" },
                        React.createElement("img", { src: companyImage(companyInfo.Id), onError: e => {
                                e.target.src = eb_companyInfo.defaultImage;
                            }, alt: "Company_logo" })
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "h3",
                            null,
                            companyInfo.Name
                        ),
                        React.createElement(
                            "a",
                            { href: companyInfo.WebSite != null ? getClickableLink(companyInfo.WebSite) : companyInfo.WebSite, target: "_blank" },
                            companyInfo.WebSite
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { "class": "eb-add-card" },
                    React.createElement(
                        "h3",
                        null,
                        "Company Address "
                    ),
                    React.createElement(
                        "div",
                        { "class": "new-card-details" },
                        React.createElement(
                            "span",
                            { "class": "eb-grey-txt" },
                            companyInfo.StreetAddress
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { "class": "eb-add-card" },
                    React.createElement(
                        "h3",
                        null,
                        "Phone No"
                    ),
                    React.createElement(
                        "div",
                        { "class": "new-card-details" },
                        React.createElement(
                            "span",
                            { "class": "eb-value-label" },
                            "(Area Code) Phone"
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "span",
                                { "class": "eb-grey-txt" },
                                getFormattedPhoneAndFax(companyInfo.PhoneAreaCode, companyInfo.MainPhone)
                            ),
                            React.createElement(
                                "span",
                                { "class": "eb-value-label" },
                                "(Area Code) Fax"
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "span",
                                    { "class": "eb-grey-txt" },
                                    getFormattedPhoneAndFax(companyInfo.FaxAreaCode, companyInfo.MainFaxNumber)
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { "class": "eb-add-card" },
                    React.createElement(
                        "h3",
                        null,
                        "Company Type"
                    ),
                    React.createElement(
                        "div",
                        { "class": "new-card-details" },
                        React.createElement(
                            "span",
                            { "class": "eb-grey-txt" },
                            companyInfo.CompanyType
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { "class": "eb-add-card" },
                    React.createElement(
                        "h3",
                        null,
                        "Member Since"
                    ),
                    React.createElement(
                        "div",
                        { "class": "new-card-details" },
                        React.createElement(
                            "span",
                            { "class": "eb-grey-txt" },
                            validDate(companyInfo.MemberSince)
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { "class": "eb-add-card" },
                    React.createElement(
                        "h3",
                        null,
                        "Directory Description"
                    ),
                    React.createElement(
                        "div",
                        { "class": "new-card-details" },
                        React.createElement(
                            "span",
                            { "class": "eb-grey-txt" },
                            companyInfo.Description != null ? getFormattedDescription(companyInfo.Description) : companyInfo.Description
                        )
                    )
                )
            )
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('companyInfo'));
root.render(React.createElement(CompanyInfo, null));