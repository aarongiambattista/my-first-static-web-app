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
                        ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement);/*Apply KO bindings, fire up the control*/

                        /*Fetch call to retrieve list of committees.*/
                        fetch(eb_committeeTermMembers.getCommitteeTermMembersService.replace("{id}", eb_committeeTermMembers.committeeId), {
                            method: 'get',
                            credentials: 'include'
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw Error(eb_committeeTermMembers.defaultErrorMessage);
                                }
                                return response.json();
                            })
                            .then(data => {
                                setCommitteeTermMembers(data);
                                setIsLoading(false);
                                setError(null);
                            })
                            .catch(err => {
                                setIsLoading(false);
                                setError(err.message);
                            })

                        fetch(eb_committeeTermMembers.getCommitteeTermInformationService.replace("{id}", eb_committeeTermMembers.committeeId), {
                            method: 'get',
                            credentials: 'include'
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw Error(eb_committeeTermMembers.defaultErrorMessage);
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
    const validDate = (date) => {
        const validFormattedDate = moment(date).format(eb_Config.defaultDateFormat);
        if (validFormattedDate != eb_committeeTermMembers.defaultDate && validFormattedDate != eb_committeeTermMembers.defaultDateAfterDeletion) {
            return validFormattedDate;
        }
        else {
            return null;
        }
    }
    return (
        <div className="committeeTermMembers">
            {committeeTermMembers && committeeTermInfo && < div id="ebCommitteeTerm" className="ebCommitteeTerm">
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
                            {/*This div belongs to various Committee Term Menu Options*/}
                            <div className="col-lg-2 col-md-3">
                                <div className="ebCommitteeTermList">
                                    <ul>
                                        <li className="ebusiness-user-profile-orders-icon ebusiness-profile-tab-style"><a href={'CommitteeTermGeneral.html?committeeId=' + eb_committeeTermMembers.committeeId} title="General"><img src="../images/icons/icon_circle-info-solid.svg" /> <span className="eb-menu-label">General</span></a></li>
                                        <li className="ebusiness-user-profile-profile-icon ebusiness-profile-tab-style active-maintab"><a href="#" title="Members"><img src="../images/icons/icon_profile-32px.svg" /><span className="eb-menu-label"> Members</span></a> </li>
                                        {/*<li className="ebusiness-user-profile-download-icon ebusiness-profile-tab-style"><a href="forum.html" title="Topics of Interest"> <img src="../images/icons/icon_topic-of-interest-32px.png" /> <span className="eb-menu-label">Forum</span></a></li>
                                        <li className="ebusiness-user-profile-payment-icon ebusiness-profile-tab-style"><a href="documents.html" title="Saved Payments"> <img src="../images/icons/icon_saved_cards_32px.png" /><span className="eb-menu-label"> Documents</span></a></li>*/}
                                    </ul>
                                </div>
                            </div>

                            {/*This div belongs to Committe Term Members List*/}
                            <div className="col-lg-10 col-md-9">
                                <div>
                                    <div className="ebCommitteeTermHeading">
                                        <h4>Member List</h4>
                                    </div>
                                    <div className="d-sm-none d-xs-none d-none d-md-block">
                                        <div className="ebMyOrderHeader row">
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Member</span></div>
                                            <div className="col-md-2"> <span className="heading-labels-orders"> Title</span></div>
                                            <div className="col-md-2"> <span className="heading-labels-orders"> Start</span></div>
                                            <div className="col-md-2"> <span className="heading-labels-orders"> End</span></div>
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Email</span></div>
                                        </div>
                                    </div>
                                    {committeeTermMembers.length < 1 && <div className="NoRecords text-center">
                                        <span>No records found.</span>
                                    </div>
                                    }
                                    {committeeTermMembers.length > 0 && <div className="ebusiness-my-orderlist">
                                        {committeeTermMembers.map((member) => (
                                            <div className="ebusiness-my-orders-list" key={ member.Id}>
                                                <div className="row order-heading-panel">
                                                    <div className="col-md-3 col-sm-3 ebusiness-order-id-dwnld"><span class="label-orders"> Member</span>{member.FirstLast}</div>
                                                    <div className="col-md-2 col-sm-2 ebusiness-order-id-dwnld"><span class="label-orders"> Title</span>{member.Title}</div>
                                                    <div className="col-md-2 col-sm-2 ebusiness-order-id-dwnld"><span class="label-orders"> Start</span>{validDate(member.StartDate)}</div>
                                                    <div className="col-md-2 col-sm-2 ebusiness-order-id-dwnld"><span class="label-orders"> End</span>{validDate(member.EndDate)}</div>
                                                    <div className="col-md-3 col-sm-3 ebusiness-order-id-dwnld a-members-email"><span class="label-orders"> Email</span>{member.Email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    }
                                </div>
                            </div>

                            {/*This div belongs to Loader*/}
                            {isLoading && <div className="loaderwrapper" style={{ display: 'none' }}>
                                <div className="ebloader"></div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('committeeTermMembers'));
root.render(<CommitteeTermMembers />);