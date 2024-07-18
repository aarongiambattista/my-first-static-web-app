/**
 * Company Directory class.
 * @class eb_companyDirectory
 * */
var eb_companyDirectory = eb_companyDirectory || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_companyDirectory.SitePath
 * @type {String}
 **/
eb_companyDirectory.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_companyDirectory.ServicePath
 * @type {String}
 * */
eb_companyDirectory.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get company directory list.
 * @property eb_companyDirectory.getCompanyDirectoryService
 * @type {String}
 * */
eb_companyDirectory.getCompanyDirectoryService = eb_companyDirectory.ServicePath + "companydirectory";

/*Default error message to be displayed.*/
eb_companyDirectory.defaultErrorMessage = "There was an error encountered. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * List of company directory list properties on which search is applied.
 * @method eb_companyDirectory.fieldsToSearch
 * @return {Object} Array of company directory list property.
 */
eb_companyDirectory.fieldsToSearch = function () {
    return ["Name", "ZipCode", "City"];
};

/**
 * Page size option list for company directory.
 * @property eb_companyDirectory.pageSizeOptionsList
 * @type {Object}
 * */
eb_companyDirectory.pageSizeOptionsList = [12, 24, 48, 96];

/**
 * Current page Size.
 * @property eb_companyDirectory.currentPageSize
 * @type {Number}
 * @default 12
 * */
eb_companyDirectory.currentPageSize = 12;

/*Importing the required hooks.*/
const { useState, useEffect } = React;

const CompanyDirectory = () => {
    const [companyDirectory, setCompanyDirectory] = useState(null);
    const [filteredCompanyDirectory, setFilteredCompanyDirectory] = useState(null);
    const [companyDirectoryList, setCompanyDirectoryList] = useState(null);
    const [companyDirectoryToShow, setCompanyDirectoryToShow] = useState(null);
    const [categoryCollection, setCategoryCollection] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortOptionSelected, setSortOptionSelected] = useState('');
    const [filterOptionSelected, setFilterOptionSelected] = useState('');
    const [filterCollapse, setFilterCollapse] = useState(0);
    const [error, setError] = useState(null);

    {/*Pagination related states*/ }
    const [currentPageIndex, setCurrentPageIndex] = useState();
    const [recordCount, setRecordCount] = useState();
    const [maxPageIndex, setMaxPageIndex] = useState();
    const [currentPageSize, setCurrentPageSize] = useState(eb_companyDirectory.currentPageSize);


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
                        headerOptions.activePage = "companyDirectory";
                        headerOptions.sitePath = "../";
                        eb_HeaderMenu.render(headerOptions).done(function () {
                            eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
                            ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement);/*Apply KO bindings, fire up the control*/

                            /*Fetch call to retrieve list of committees.*/
                            fetch(eb_companyDirectory.getCompanyDirectoryService, {
                                method: 'get',
                                credentials: 'include'
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw Error(eb_companyDirectory.defaultErrorMessage);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    setCompanyDirectory(extractModels(data));
                                    filterData(data, 'All');
                                    setIsLoading(false);
                                    setError(null);
                                })
                                .catch(err => {
                                    setIsLoading(false);
                                    setError(err.message);
                                })

                        }).fail(function (data, msg, jhr) {
                            console.error('Failed to render header control...');
                            eb_Config.getErrorMessageForControl(data.responseJSON, eb_companyDirectory);
                        });
                    }).fail(function (data, msg, jhr) {
                        console.error('Failed to render footer control...');
                    });
                }).fail(function (data, msg, jhr) {
                    console.error('Failed to getShoppingCart...');
                    eb_Config.getErrorMessageForControl(data.responseJSON, eb_companyDirectory);
                });
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });

    }, []);

    {/*Responsible to bifurcate the companies into categories based on Topic codes.*/}
    const extractModels = (data) => {
        var models = [];
        var categoryList = categoryCollection;
        
        if (data === null) {
            return models;
        }

        for (var index = 0; index < data.length; index++) {
            var row = data[index];
            models.push(row);

            if (row.TopicCode != null) {
                var categories = [];
                categories = row.TopicCode.split(",");

                if (categories.length > 0) {
                    for (i = 0; i < categories.length; i++) {
                        if (categoryList.length > 0) {
                            var categoryRecord = categoryList.find(record => record.name === categories[i]);

                            if (categoryRecord) {
                                categoryRecord.records.push(row);
                            }
                            else {
                                var newCategory = {
                                    name: '',
                                    records: []
                                };

                                newCategory.name = categories[i];
                                newCategory.records.push(row);
                                categoryList.push(newCategory);
                            }
                        }
                        else {
                            var newCategory = {
                                name: '',
                                records: []
                            };

                            newCategory.name = categories[i];
                            newCategory.records.push(row);
                            categoryList.push(newCategory);
                        }
                    }
                }
            }
            
            
        }
        setCategoryCollection(categoryList);
        return models;
    };

    /*Gets called everytime something is typed in the search bar.*/
    useEffect(() => {
        setSortOptionSelected('');
        setCurrentPageIndex('');
        if (filteredCompanyDirectory && filteredCompanyDirectory.length > 0) {
            const searchItems = setTimeout(() => {

                var filteredRecords = [];
                var ifFound = false;
                var item;

                for (var record = 0; record < filteredCompanyDirectory.length; record++) {

                    for (var field = 0; field < eb_companyDirectory.fieldsToSearch().length; field++) {
                        item = filteredCompanyDirectory[record][eb_companyDirectory.fieldsToSearch()[field]];
                        if (item != null) {
                            if (item.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                ifFound = true;
                                break;
                            }
                        }
                        
                    }
                    if (ifFound) {
                        filteredRecords.push(filteredCompanyDirectory[record]);
                        ifFound = false;
                    }
                }
                setCompanyDirectoryList(filteredRecords);
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

    /*Filter data according to filter set.*/
    const filterData = (data, filter) => {
        setSortOptionSelected('');
        setSearchTerm('');
        setCurrentPageIndex('');
        setFilterOptionSelected(filter);

        var filteredData = [];

        if (filter == "All") {
            filteredData = data;
            setFilteredCompanyDirectory(filteredData);
            setCompanyDirectoryList(filteredData);
        }
        else {
            filteredData = data.filter(category => category.name.includes(filter));
            setFilteredCompanyDirectory(filteredData[0].records);
            setCompanyDirectoryList(filteredData[0].records);
        }
        
    }

    /*Sorting function.*/
    const sortCompanyDirectory = (e) => {
        setSortOptionSelected(e.target.value);
        if (e.target.value == 'NameAscending') {
            setCompanyDirectoryToShow([...companyDirectoryToShow.sort((a, b) => a.Name.localeCompare(b.Name))]);
        }
        if (e.target.value == 'NameDescending') {
            setCompanyDirectoryToShow([...companyDirectoryToShow.sort((a, b) => b.Name.localeCompare(a.Name))]);
        }
    }

    const getClickableLink = (link) => {
        return link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
    };

    const getFormattedPhone = (areaCode, number) => {
        return (areaCode != null && areaCode != "" ? ("(" + areaCode + ") " + number) : number);
    }

    /*Gets triggered to set the states for pagination.*/
    useEffect(() => {
        var records = companyDirectoryList;
        var sizeOfcurrentPage = currentPageSize;
        
        if (records) {
            var currentPageIndex = records.length > 0 ? 0 : -1;
            var recordCount = records.length;
            var maxPageIndex = Math.ceil(records.length / sizeOfcurrentPage) - 1;

            setCurrentPageIndex(currentPageIndex);
            setRecordCount(recordCount);
            setMaxPageIndex(maxPageIndex);
        }
          
    }, [companyDirectoryList, currentPageSize]);

    /*Gets triggered everytime the current page index for pagination is changed.*/
    useEffect(() => {
        if (currentPageIndex!=null && currentPageIndex !== '') {
            var records = companyDirectoryList;
            if (records) {
                var newPageIndex = -1;
                var pageIndex = currentPageIndex;
                var maxPageIndex = maxPageIndex;
                var sizeOfcurrentPage = parseInt(currentPageSize);
                if (pageIndex > maxPageIndex) {
                    newPageIndex = maxPageIndex;
                }
                else if (pageIndex === -1) {
                    if (maxPageIndex > -1) {
                        newPageIndex = 0;
                    }
                    else {
                        newPageIndex = -2;
                    }
                }
                else {
                    newPageIndex = pageIndex;
                }

                if (newPageIndex !== pageIndex) {
                    if (newPageIndex >= -1) {
                        setCurrentPageIndex(newPageIndex);
                    }

                    setCompanyDirectoryToShow(records);
                }

                var pageSize = sizeOfcurrentPage;
                var startIndex = pageIndex * pageSize;
                var endIndex = startIndex + pageSize;

                setCompanyDirectoryToShow(records.slice(startIndex, endIndex));
            }
        }
        
    }, [currentPageIndex]);

    
    /*Move to first page.*/
    const moveFirst = () => {
        changePageIndex(0);
    };

    /*Move to Previous page.*/
    const movePrevious = () => {
        changePageIndex(currentPageIndex - 1);
    };

    /*Move to Next page*/
    const moveNext = () => {
        changePageIndex(currentPageIndex + 1);
    };

    /*Move to last page.*/
    const moveLast = () => {
        changePageIndex(maxPageIndex);
    };

    /*Page index change event.*/
    const changePageIndex = (newIndex) => {
        if (newIndex < 0
            || newIndex === currentPageIndex
            || newIndex > maxPageIndex) {
            return;
        }
        setCurrentPageIndex(newIndex);
    };

    /* Page size change event.*/
    const onPageSizeChange = (pageSize) => {
        setCurrentPageSize(pageSize);
        setCurrentPageIndex('');
    };

    return (
        <div className="companyDirectory">
            {companyDirectoryToShow && <div id="ebCompanyDirectory">
                <div className="ebusiness-all-products  ebWrapper  ebClear ebusiness-main-container offcanvas">
                    <div className="ebusiness-filter-control">
                        <div className="row">
                            <div className="col-md-3">
                                <h3>Company Directory</h3>
                            </div>
                            <div className="col-md-9 eb-align-right">
                                <span>
                                    <label>Search  </label> <input type="text" placeholder="Find Members By Name, City, Zip" className="form-control required ebusiness-clientside-generic-search-animated" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                                </span>
                                <span className="d-inline d-sm-inline d-md-none" onClick={toggleFilterControl}><a className="fa-icon" title="Sort/Filter"><img src="../images/icons/fontawesome/filter.svg" /></a></span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/*This div belongs to Sorting options*/}
                        <div className="col-lg-2 col-md-3">
                            <div id="filterSort" className={filterCollapse ? "isFilterOpen" : "isFilterClosed"}>
                                <div className="ebusiness-filter-details-panel">
                                    <div className="ebusiness-sorting">
                                        <div className="ebusiness-filter-section-title ebusiness-filter-options">Sort By</div>
                                        <ul role="menu">
                                            <li>
                                                <label>
                                                    <input type="radio" name="radioGroupSort" value="NameAscending" checked={sortOptionSelected === 'NameAscending'} onChange={sortCompanyDirectory}></input>
                                                        Name (A-Z)
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="radio" name="radioGroupSort" value="NameDescending" checked={sortOptionSelected === 'NameDescending'} onChange={sortCompanyDirectory}></input>
                                                        Name (Z-A)
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="ebusiness-filter">
                                        <div className="ebusiness-filter-section-title">Filter By Topic Code</div>
                                        <div className="ebusiness-filter-options">
                                            <ul role="menu">
                                                <li>
                                                    <label>
                                                        <input type="radio" value="All" checked={filterOptionSelected === 'All'} onChange={(e) => filterData(companyDirectory, e.target.value)} ></input> {/*checked={filterOptionSelected === 'All'} onChange={filterData(categoryCollection, 'All')}*/}
                                                        <span className="cat-name">
                                                            <span>All</span>
                                                        </span>
                                                    </label>
                                                </li>
                                                {categoryCollection.map((category) => (
                                                    <li>
                                                        <label>
                                                            <input type="radio" value={category.name} checked={filterOptionSelected === category.name} onChange={(e) => filterData(categoryCollection, e.target.value)}></input>  {/*checked={filterOptionSelected === category.name} onChange={filterData(categoryCollection, category.name)}*/}
                                                            <span className="cat-name">
                                                                <span>{category.name}</span>
                                                            </span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*This div belongs to Company Directory*/}
                        <div className="col-lg-10 col-md-9">
                            <div id="companyDirectory">
                                <div className="membersAvailable">
                                    <div className="d-sm-none d-xs-none d-none d-md-block">
                                        <div className="ebMyOrderHeader row">
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Name</span></div>
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Address</span></div>
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Phone</span></div>
                                            <div className="col-md-3"> <span className="heading-labels-orders"> Website</span></div>
                                        </div>
                                    </div>
                                    {companyDirectoryToShow.length < 1 && <div className="NoRecords text-center">
                                        <span>No records found.</span>
                                    </div>
                                    }
                                    {companyDirectoryToShow.length > 0 && <div>
                                        {companyDirectoryToShow.map((company) => (
                                            <div className="eb-comp-directory row" key={company.Id}>
                                                <div className="col-sm-3">
                                                    <span className="label-orders orders-order-id"> Name </span> <span className="value-orders">
                                                        <span className="eb-cmp-name"><a href={'CompanyInfo.html?companyId=' + company.Id}>{company.Name}</a></span>
                                                    </span>
                                                </div>
                                                <div className="col-sm-3">
                                                    <span className="label-orders"> Address</span>
                                                    <span className="value-orders eb-comp-user-email">{company.StreetAddress}</span>
                                                </div>
                                                <div className="col-sm-3">
                                                    <span className="label-orders"> Phone</span>
                                                    <span className="value-orders orders-order-status">{getFormattedPhone(company.PhoneAreaCode, company.MainPhone)}</span>
                                                </div>
                                                <div className="col-sm-3">
                                                    <span className="label-orders"> Website</span>
                                                    <span className="eb-website-link"><a href={company.WebSite != null ? getClickableLink(company.WebSite) : company.WebSite} target="_blank">{company.WebSite}</a></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                                {/*Pagination*/}
                                <div className="text-center">
                                    <div className="ebusiness-productCatalog-pagination">

                                        <div className="Pager productCatlogPager pl-0 border-top-0">
                                            <ul>
                                                <li className={'goToFirst btn btn-default ' + (currentPageIndex <= 0 ? 'disabledPagination' : '')} title="First">
                                                    <a href="#" onClick={() => currentPageIndex > 0 && moveFirst()} >
                                                        <span className={'fa-icon ' + (currentPageIndex <= 0 ? 'disabledPaginationArrow' : '')}><img src="../images/icons/fontawesome/angle-double-left.svg" /></span>
                                                    </a>
                                                </li>
                                                <li className={'goPrevious  btn btn-default ' + (currentPageIndex <= 0 ? 'disabledPagination' : '')} title="Previous">
                                                    <a href="#" onClick={() => currentPageIndex > 0 && movePrevious()}>
                                                        <span className={'fa-icon ' + (currentPageIndex <= 0 ? 'disabledPaginationArrow' : '')}><img src="../images/icons/fontawesome/angle-left.svg" /></span>

                                                    </a>
                                                </li>
                                                <li className={'goTonext btn btn-default ' + (currentPageIndex >= maxPageIndex ? 'disabledPagination' : '')} title="Next">
                                                    <a href="#" onClick={()=> currentPageIndex < maxPageIndex && moveNext()}>
                                                        <span className={'fa-icon ' + (currentPageIndex >= maxPageIndex ? 'disabledPaginationArrow' : '')}><img src="../images/icons/fontawesome/angle-right.svg" /></span>
                                                    </a>
                                                </li>
                                                <li className={'goToLast  btn btn-default ' + (currentPageIndex >= maxPageIndex ? 'disabledPagination' : '')} title="Last">
                                                    <a href="#" onClick={()=> currentPageIndex < maxPageIndex && moveLast()}>
                                                        <span className={'fa-icon ' + (currentPageIndex >= maxPageIndex ? 'disabledPaginationArrow' : '')}><img src="../images/icons/fontawesome/angle-double-right.svg" /></span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li className="pageCount">
                                                    Page <span >
                                                        {currentPageIndex + 1}
                                                    </span> of <span >{maxPageIndex + 1}</span>
                                                </li>
                                                <li className="recordCount">
                                                    [<span >{recordCount}</span> Record(s)]
                                                </li>
                                                <li className="pageSize">
                                                    <select className="form-control" onChange={(e) => onPageSizeChange(e.target.value)} >
                                                        {eb_companyDirectory.pageSizeOptionsList.map((option) => (
                                                            <option value={option} >{option}</option>
                                                        ))}
                                                    </select>
                                                </li>
                                            </ul>
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
            </div>}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('companyDirectory'));
root.render(<CompanyDirectory />);