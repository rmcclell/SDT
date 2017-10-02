Ext.define('SDT.util.GLOBALS', {
    singleton: true,
    //DEBUG_DASHBOARD_WIZARD: (Ext.urlDecode(location.search.substring(1)).debugdashboardwizard) ? false : true, //Enable dashboad debugging
    DEBUG_DASHBOARD_WIZARD: false,
    APPTITLE: 'Om',
    //call these upon first use which will store user preference. These get updated by stateManager changes
    DISPLAY_FORMATS: {
        number: '0,000.00',
        date: 'm-d-Y'
    }
});