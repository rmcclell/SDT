Ext.define('SDT.view.dashboardAdmin.cards.UserCriteria', {
    extend: 'Ext.ux.panel.Card',
    requires: [
        'SDT.view.dashboardAdmin.grids.UserCriteriaGrid'
    ],
    alias: 'widget.userCriteria',
    title: 'Select User Criteria Options',
    trackResetOnLoad: true,
    description: 'Select additional filtering options to appear on your dashboard. This will allow you to further refine you dashboard view.',
    itemId: 'criteriaSelectionCard',
    layout: 'fit',
    showTitle: true,
    layout: 'vbox',
    scrollable: true,
    defaults: {
        width: '100%',
        margin: 5
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
        value: '[]'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Facet Fields',
        minHeight: 90,
        height: 90,
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facetFields'
    }]
});