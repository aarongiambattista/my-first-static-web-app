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
    return ["Id", "Name", "Description", "Goals","DateFounded"];
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
                            ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement);/*Apply KO bindings, fire up the control*/

                            /*Fetch call to retrieve list of committees.*/
                            fetch(eb_committeeListing.getCommitteeListService, {
                                method: 'get',
                                credentials: 'include'
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw Error(eb_committeeListing.defaultErrorMessage);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    setCommitteeList(data);
                                    setCommitteeListToShow(data);
                                    setIsLoading(false);
                                    setError(null);
                                })
                                .catch(err => {
                                    setIsLoading(false);
                                    setError(err.message);
                                })

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
            }else {
                (window.location.assign(eb_Config.loginPageURL));
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
            }, 500)

            return () => clearTimeout(searchItems)
        }
        else {
            return;
        }
    }, [searchTerm]);

    /*To expand/collapse filter on mobile*/
    const toggleFilterControl = () => {
        setFilterCollapse(!filterCollapse);
    }

    /*Returns date in valid eBusiness format, mm/dd/yyyy. However, returns null for blank dates.*/
    const validDate = (dateFounded) => {
        const validFormattedDate = moment(dateFounded).format(eb_Config.defaultDateFormat);
        if (validFormattedDate != eb_committeeListing.defaultDate && validFormattedDate != eb_committeeListing.defaultDateAfterDeletion) {
            return validFormattedDate;
        }
        else {
            return null;
        }
    }

    /*Sorting function.*/
    const sortCommitteeList = (e) => {
        setSortOptionSelected(e.target.value);
        if (e.target.value == 'name') {
            setCommitteeListToShow([...committeeListToShow.sort((a, b) => a.Name.localeCompare(b.Name))]);
        }
        if (e.target.value == 'date') {
            setCommitteeListToShow([...committeeListToShow.sort((a, b) => { return new Date(a.DateFounded) - new Date(b.DateFounded) })]);
        }
    }

    return (
        <div className="committeeListing">
            {committeeListToShow && <div id="ebCommitteeListing" className="ebCommitteeListing">
                <div className="ebusiness-all-products  ebWrapper  ebClear ebusiness-main-container offcanvas">
                    <div className="productCatalogModal">
                        <div className="ebusiness-filter-control row">
                            <div className="col-sm-3"><h3>Committee Listing</h3></div>
                            <div className="col-sm-9 ebusiness-view-switcher">
                                <span><input name="txteventsListSearch" type="text" placeholder="Search" className="form-control required ebusiness-clientside-generic-search-animated" onChange={(e) => setSearchTerm(e.target.value)} /></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            {/*This div belongs to Sorting*/}
                            <div className="col-lg-2 col-md-3">
                                <div className="text-right"><span className="d-inline d-sm-inline d-md-none" onClick={toggleFilterControl}><a className="fa-icon" title="Sort/Filter"><img src="../images/icons/fontawesome/filter.svg" /></a></span></div>
                                <div id="filterSort" className={filterCollapse ? "isFilterOpen" : "isFilterClosed"}>
                                    <div className="ebusiness-filter-details-panel">
                                        <div className="ebusiness-sorting">
                                            <div className="ebusiness-filter-section-title ebusiness-filter-options">Sort By</div>
                                            <ul role="menu">
                                                <li>
                                                    <label className="cat-name">
                                                        <input type="radio" name="radioGroupSort" value="name" checked={sortOptionSelected === 'name'} onChange={sortCommitteeList} />Name
                                                        </label>
                                                </li>
                                                <li>
                                                    <label className="cat-name">
                                                        <input type="radio" name="radioGroupSort" value="date" checked={sortOptionSelected === 'date'} onChange={sortCommitteeList} />Date Founded
                                                        </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*This div belongs to Committee List*/}
                            <div className="col-lg-10 col-md-9">
                                <div>
                                    <div className="d-sm-none d-xs-none d-none d-md-block">
                                        <div className="ebMyOrderHeader row">
                                            <div className="col-md-2"> <span className="heading-labels-orders"> Name</span></div>
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Description</span></div>
                                            <div className="col-md-5"> <span className="heading-labels-orders"> Goals</span></div>
                                            <div className="col-md-2"> <span className="heading-labels-orders"> Date Founded</span></div>
                                        </div>
                                    </div>
                                    {committeeListToShow.length < 1 && <div className="NoRecords text-center">
                                        <span>No records found.</span>
                                    </div>
                                    }
                                    {committeeListToShow.length > 0 && <div className="ebusiness-my-orderlist">
                                        {committeeListToShow.map((committee) => (
                                            <div className="ebusiness-my-orders-list" key={committee.Id}>
                                                <div className="row order-heading-panel">
                                                    <div className="col-md-2 col-sm-3 ebusiness-order-id-dwnld"><span class="label-orders"> Name</span>{committee.Name}</div>
                                                    <div className="col-md-3 col-sm-3 ebusiness-order-id-dwnld"><span class="label-orders"> Description</span>{committee.Description}</div>
                                                    <div className="col-md-5 col-sm-3 ebusiness-order-id-dwnld"><span class="label-orders"> Goals</span>{committee.Goals}</div>
                                                    <div className="col-md-2 col-sm-3 ebusiness-order-id-dwnld"><span class="label-orders"> Date Founded</span>{validDate(committee.DateFounded)}</div>
                                                </div>                                               
                                            </div>
                                        ))}
                                    </div>
                                    }
                                </div>
                            </div>                         
                        </div>
                    </div>
                </div>
            </div>
            }
            {/*This div belongs to Loader*/}
            {isLoading && <div className="loaderwrapper" style={{ display: 'none' }}>
                <div className="ebloader"></div>
            </div>}
        </div>
        );
}

const root = ReactDOM.createRoot(document.getElementById('committeeListing'));
root.render(<CommitteeListing />);