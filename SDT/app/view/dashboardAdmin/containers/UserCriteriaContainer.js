Ext.define('SDT.view.dashboardAdmin.containers.UserCriteriaContainer', {
    extend: 'Ext.container.Container',
    requires: [
        'SDT.view.dashboardAdmin.grids.UserCriteriaGrid'
    ],
    alias: 'widget.userCriteriaContainer',
    layout: 'vbox',
    scrollable: true,
    defaults: {
        width: '100%',
        margin: '20 5 20 5'
    },
    items: [{
        xtype: 'userCriteriaGrid',
        flex: 1,
        minHeight: 180
    }, {
        xtype: 'textarea',
        fieldLabel: 'User Criteria Fields',
        minHeight: 90,
        height: 90,
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'userCriteriaFields',
        value:'[]'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Facet Fields',
        minHeight: 90,
        height: 90,
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facetFields'
    }]
});