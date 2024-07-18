/**
 * Committee Term Generalclass.
 * @class eb_committeeTermGeneral
 * */
var eb_committeeTermGeneral = eb_committeeTermGeneral || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_committeeTermGeneral.SitePath
 * @type {String}
 **/
eb_committeeTermGeneral.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_committeeTermGeneral.ServicePath
 * @type {String}
 * */
eb_committeeTermGeneral.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get committees list.
 * @property eb_committeeTermGeneral.getCommitteeTermInformationService
 * @type {String}
 * */
eb_committeeTermGeneral.getCommitteeTermInformationService = eb_committeeTermGeneral.ServicePath + "Committees/General/{id}";

/**
 * GET product id from URL
 * @property  eb_committeeTermGeneral.committeeId
 * @type {String}
 */
eb_committeeTermGeneral.committeeId = eb_Config.getUrlParameter("committeeId");

/* To Check blank date, if we didn't enter any value in date in smart client, then by default it returns "01/01/0001" */
eb_committeeTermGeneral.defaultDate = "01/01/0001";

/* If date was entered and then later deleted in smart client, then by default it returns "01/01/1900" */
eb_committeeTermGeneral.defaultDateAfterDeletion = "01/01/1900";

/*Default error message to be displayed.*/
eb_committeeTermGeneral.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const CommitteeTermGeneral = () => {
    const [committeeTermInfo, setCommitteeTermInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
                        headerOptions.activePage = "committeeTermGeneral";
                        headerOptions.sitePath = "../";
                        eb_HeaderMenu.render(headerOptions).done(function () {
                            eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                            ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement);/*Apply KO bindings, fire up the control*/

                            /*Fetch call to retrieve list of committees.*/
                            fetch(eb_committeeTermGeneral.getCommitteeTermInformationService.replace("{id}", eb_committeeTermGeneral.committeeId), {
                                method: 'get',
                                credentials: 'include'
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw Error(eb_committeeTermGeneral.defaultErrorMessage);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    setCommitteeTermInfo(data);
                                    setIsLoading(false);
                                    setError(null);
                                })
                                .catch(err => {
                                    setIsLoading(false);
                                    setError(err.message);
                                })

                        }).fail(function (data, msg, jhr) {
                            console.error('Failed to render header control...');
                            eb_Config.getErrorMessageForControl(data.responseJSON, eb_committeeTermGeneral);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render footer control...');
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to getShoppingCart...');
                    eb_Config.getErrorMessageForControl(data.responseJSON, eb_committeeTermGeneral);
                });
            } else {
                (window.location.assign(eb_Config.loginPageURL));
            }
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });

    }, []);

    /*Returns date in valid eBusiness format, mm/dd/yyyy. However, returns null for blank dates.*/
    const validDate = (date) => {
        const validFormattedDate = moment(date).format(eb_Config.defaultDateFormat);
        if (validFormattedDate != eb_committeeTermGeneral.defaultDate && validFormattedDate != eb_committeeTermGeneral.defaultDateAfterDeletion) {
            return validFormattedDate;
        }
        else {
            return null;
        }
    }

    return (
        <div className="committeeTermGeneral">
            {committeeTermInfo && <div id="ebCommitteeTerm" className="ebCommitteeTerm">
                <div className="ebusiness-all-products  ebWrapper  ebClear ebusiness-main-container offcanvas">
                    <div className="productCatalogModal">
                        <div className="ebusiness-filter-control row">
                            <div className="col-sm-12"><h3>Committee Term</h3></div>
                        </div>
                    </div>
                    <div className="ebCommitteeInformation">
                        <h4>{committeeTermInfo.Name}</h4>
                        <span>{committeeTermInfo.CommitteeName}</span>
                        <hr />
                    </div>
                    <div>
                        <div className="row">
                            {/*This div contains various Committee Term Menu Options*/}
                            <div className="col-lg-2 col-md-3">
                                <div className="ebCommitteeTermList">
                                    <ul>
                                        <li className="ebusiness-user-profile-orders-icon ebusiness-profile-tab-style active-maintab"><a href="#" title="General"><img src="../images/icons/icon_circle-info-solid.svg" /> <span className="eb-menu-label">General</span></a></li>
                                        <li className="ebusiness-user-profile-profile-icon ebusiness-profile-tab-style"><a href={'CommitteeTermMembers.html?committeeId=' + eb_committeeTermGeneral.committeeId} title="Members"><img src="../images/icons/icon_profile-32px.svg" /><span className="eb-menu-label"> Members</span></a></li>
                                        {/*<li className="ebusiness-user-profile-download-icon ebusiness-profile-tab-style"><a href="forum.html" title="Topics of Interest"> <img src="../images/icons/icon_topic-of-interest-32px.png" /> <span className="eb-menu-label">Forum</span></a></li>
                                            <li className="ebusiness-user-profile-payment-icon ebusiness-profile-tab-style"><a href="documents.html" title="Saved Payments"> <img src="../images/icons/icon_saved_cards_32px.png" /><span className="eb-menu-label"> Documents</span></a></li>*/}
                                    </ul>
                                </div>
                            </div>
                            {/*This div belongs to Committee Term General Information*/}
                            <div className="col-lg-10 col-md-9">
                                <div>
                                    <div className="ebCommitteeTermHeading">
                                        <h4>General Information</h4>
                                    </div>
                                    <div className="ebCommitteeGeneralBox">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6"><strong>Director</strong></div>
                                                <div className="col-md-6 col-sm-6">{committeeTermInfo.Director}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6"><strong>Start Date</strong></div>
                                                <div className="col-md-6 col-sm-6">{validDate(committeeTermInfo.StartDate)}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6"><strong>End Date</strong></div>
                                                <div className="col-md-6 col-sm-6">{validDate(committeeTermInfo.EndDate)}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6"><strong>Goals</strong></div>
                                                <div className="col-md-6 col-sm-6">{committeeTermInfo.Goals}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*This div belongs to Loader*/}
                    {isLoading && <div className="loaderwrapper" style={{ display: 'none' }}>
                        <div className="ebloader"></div>
                    </div>}
                </div>
            </div>
            }
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('committeeTermGeneral'));
root.render(<CommitteeTermGeneral />);