/**
 * My Committees class.
 * @class eb_myCommittees
 * */
var eb_myCommittees = eb_myCommittees || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_myCommittees.SitePath
 * @type {String}
 **/
eb_myCommittees.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_myCommittees.ServicePath
 * @type {String}
 * */
eb_myCommittees.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get committees list.
 * @property eb_myCommittees.getCommitteeListService
 * @type {String}
 * */
eb_myCommittees.getMyCommitteesService = eb_myCommittees.ServicePath + "Committees/{id}/{Term}";

/*Default error message to be displayed.*/
eb_myCommittees.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * List of my committee list properties on which search is applied.
 * @method eb_myCommittees.fieldsToSearch
 * @return {Object} Array of mycommittee list property.
 */
eb_myCommittees.fieldsToSearch = function () {
    return ["Name", "Term", "Title"];
};

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const MyCommittees = () => {
    const [allCommittees, setAllCommittees] = useState(null);
    const [pastCommittees, setPastCommittees] = useState(null);
    const [currentCommittees, setCurrentCommittees] = useState(null);
    const [futureCommittees, setFutureCommittees] = useState(null);
    const [myCommittees, setMyCommittees] = useState(null);
    const [myCommitteesToShow, setMyCommitteesToShow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOptionSelected, setSortOptionSelected] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [filterCollapse, setFilterCollapse] = useState(0);
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
                        headerOptions.activePage = "myCommittees";
                        headerOptions.sitePath = "../";
                        eb_HeaderMenu.render(headerOptions).done(function () {
                            eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                            ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement);/*Apply KO bindings, fire up the control*/

                            /*On initial page load, render data for All Committees.*/
                            allCommitteesClicked();

                        }).fail(function (data, msg, jhr) {
                            console.error('Failed to render header control...');
                            eb_Config.getErrorMessageForControl(data.responseJSON, eb_myCommittees);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render footer control...');
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to getShoppingCart...');
                    eb_Config.getErrorMessageForControl(data.responseJSON, eb_myCommittees);
                });
            } else {
                (window.location.assign(eb_Config.loginPageURL));
            }
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });

    }, []);

    /*Gets called everytime something is typed in the search bar.*/
    useEffect(() => {
        setSortOptionSelected('');
        if (myCommittees && myCommittees.length > 0) {
            const searchItems = setTimeout(() => {

                var filteredRecords = [];
                var ifFound = false;
                var item;

                for (var record = 0; record < myCommittees.length; record++) {

                    for (var field = 0; field < eb_myCommittees.fieldsToSearch().length; field++) {
                        item = myCommittees[record][eb_myCommittees.fieldsToSearch()[field]];

                        if (item.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            ifFound = true;
                            break;
                        }
                    }
                    if (ifFound) {
                        filteredRecords.push(myCommittees[record]);
                        ifFound = false;
                    }
                }
                setMyCommitteesToShow(filteredRecords);
            }, 500)

            return () => clearTimeout(searchItems)
        }
        else {
            return;
        }
    }, [searchTerm]);

    const allCommitteesClicked = () => {
        setActiveTab('All');
        setSortOptionSelected('');
        setSearchTerm('');

        if (allCommittees) {
            setMyCommitteesToShow(allCommittees);
        }
        else {
            /*Fetch call to retrieve list of committees.*/
            fetch(eb_myCommittees.getMyCommitteesService.replace("{id}", eb_UserContext.live.LinkId()).replace("{Term}", "All"), {
                method: 'get',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(eb_myCommittees.defaultErrorMessage);
                    }
                    return response.json();
                })
                .then(data => {
                    setAllCommittees(data);
                    setMyCommittees(data);
                    setMyCommitteesToShow(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
        return true;
    }

    const currentCommitteesClicked = () => {
        setActiveTab('Current');
        setSortOptionSelected('');
        setSearchTerm('');

        if (currentCommittees) {
            setMyCommitteesToShow(currentCommittees);
        }
        else {
            /*Fetch call to retrieve list of committees.*/
            fetch(eb_myCommittees.getMyCommitteesService.replace("{id}", eb_UserContext.live.LinkId()).replace("{Term}", "Current"), {
                method: 'get',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(eb_myCommittees.defaultErrorMessage);
                    }
                    return response.json();
                })
                .then(data => {
                    setCurrentCommittees(data);
                    setMyCommittees(data);
                    setMyCommitteesToShow(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
        return true;
    }

    const futureCommitteesClicked = () => {
        setActiveTab('Future');
        setSortOptionSelected('');
        setSearchTerm('');

        if (futureCommittees) {
            setMyCommitteesToShow(futureCommittees);
        }
        else {
            /*Fetch call to retrieve list of committees.*/
            fetch(eb_myCommittees.getMyCommitteesService.replace("{id}", eb_UserContext.live.LinkId()).replace("{Term}", "Future"), {
                method: 'get',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(eb_myCommittees.defaultErrorMessage);
                    }
                    return response.json();
                })
                .then(data => {
                    setFutureCommittees(data);
                    setMyCommittees(data);
                    setMyCommitteesToShow(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
        return true;
    }

    const pastCommitteesClicked = () => {
        setActiveTab('Past');
        setSortOptionSelected('');
        setSearchTerm('');

        if (pastCommittees) {
            setMyCommitteesToShow(pastCommittees);
        }
        else {
            /*Fetch call to retrieve list of committees.*/
            fetch(eb_myCommittees.getMyCommitteesService.replace("{id}", eb_UserContext.live.LinkId()).replace("{Term}", "Past"), {
                method: 'get',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(eb_myCommittees.defaultErrorMessage);
                    }
                    return response.json();
                })
                .then(data => {
                    setPastCommittees(data);
                    setMyCommittees(data);
                    setMyCommitteesToShow(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
        return true;
    }

    /*To expand/collapse filter on mobile*/
    const toggleFilterControl = () => {
        setFilterCollapse(!filterCollapse);
    }

    /*Sorting function.*/
    const sortMyCommitteesList = (e) => {
        setSortOptionSelected(e.target.value);
        if (e.target.value == 'name') {
            setMyCommitteesToShow([...myCommitteesToShow.sort((a, b) => a.Name.localeCompare(b.Name))])
        }
        if (e.target.value == 'term') {
            setMyCommitteesToShow([...myCommitteesToShow.sort((a, b) => a.Term.localeCompare(b.Term))])
        }
        if (e.target.value == 'title') {
            setMyCommitteesToShow([...myCommitteesToShow.sort((a, b) => a.Title.localeCompare(b.Title))])
        }
    }

    return (
        <div className="myCommittees">
            {myCommitteesToShow && <div id="ebCommitteeListing" className="ebMyCommittees">
                <div className="ebusiness-all-products  ebWrapper  ebClear ebusiness-main-container offcanvas">
                    <div className="productCatalogModal">
                        <div className="ebusiness-filter-control row">
                            <div className="col-sm-3"><h3>My Committees</h3></div>
                            <div className="col-sm-9 ebusiness-view-switcher">
                                <span> <input name="txteventsListSearch" type="text" placeholder="Search" className="form-control required ebusiness-clientside-generic-search-animated" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></span>
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
                                                        <input type="radio" name="radioGroupSort" value="name" checked={sortOptionSelected === 'name'} onChange={sortMyCommitteesList} />Name
                                                            </label>
                                                </li>
                                                <li>
                                                    <label className="cat-name">
                                                        <input type="radio" name="radioGroupSort" value="term" checked={sortOptionSelected === 'term'} onChange={sortMyCommitteesList} />Term
                                                            </label>
                                                </li>
                                                <li>
                                                    <label className="cat-name">
                                                        <input type="radio" name="radioGroupSort" value="title" checked={sortOptionSelected === 'title'} onChange={sortMyCommitteesList} />Title
                                                            </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*This div belongs to My Committees Listing*/}
                            <div className="col-lg-10 col-md-9">
                                <div className="eb-tabs-events">
                                    <div className="col-md-4 eb-active-tabs">
                                        <a onClick={allCommitteesClicked} className={activeTab === 'All' ? "eb-active-Links" : null }>All </a>  |
                                            <a onClick={currentCommitteesClicked} className={activeTab === 'Current' ? "eb-active-Links" : null}>Current </a>  |
                                            <a onClick={futureCommitteesClicked} className={activeTab === 'Future' ? "eb-active-Links" : null}>Future </a>  |
                                            <a onClick={pastCommitteesClicked} className={activeTab === 'Past' ? "eb-active-Links" : null}>Past </a>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-sm-none d-xs-none d-none d-md-block">
                                        <div className="ebMyOrderHeader row">
                                            <div className="col-md-4"> <span className="heading-labels-orders"> Name</span></div>
                                            <div className="col-md-4"> <span className="heading-labels-orders"> Term</span></div>
                                            <div className="col-md-4"> <span className="heading-labels-orders"> Title</span></div>
                                        </div>
                                    </div>
                                    {myCommitteesToShow.length < 1 && <div className="NoRecords text-center">
                                        <span>No records found.</span>
                                    </div>
                                    }
                                    {myCommitteesToShow.length > 0 && <div className="ebusiness-my-orderlist">
                                        {myCommitteesToShow.map((committee) => (
                                            <div className="ebusiness-my-orders-list" key={committee.CommitteeTermID}>
                                                <div className="row order-heading-panel">
                                                    <div className="col-md-4 col-sm-4 ebusiness-order-id-dwnld"><span class="label-orders"> Name</span><a href={'CommitteeTermGeneral.html?committeeId=' + committee.CommitteeTermID}>{committee.Name}</a></div>
                                                    <div className="col-md-4 col-sm-4 ebusiness-order-id-dwnld"><span class="label-orders"> Term</span>{committee.Term}</div>
                                                    <div className="col-md-4 col-sm-4 ebusiness-order-id-dwnld"><span class="label-orders"> Title</span>{committee.Title}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {/*This div belongs to Loader*/}
                        {isLoading && <div className="loaderwrapper" style={{ display: 'none' }}>
                            <div className="ebloader"></div>
                        </div>}
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('myCommittees'));
root.render(<MyCommittees />);