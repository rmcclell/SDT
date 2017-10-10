Ext.define('SDT.view.dashboardAdmin.cards.Charts', {
    extend: 'Ext.ux.panel.Card',
    requires: [
        'SDT.view.dashboardAdmin.grids.ChartsConnectedGrid'
    ],
    alias: 'widget.charts',
    description: 'Add Charts to visualize your filter Results.',
    title: 'Charts',
    trackResetOnLoad: true,
    itemId: 'chartsCard', //Needed for getWizardData Call
    showTitle: true,
    layout: 'vbox',
    scrollable: true,
    defaults: {
        width: '100%',
        margin: 5,
        validateOnBlur: false,
        validateOnChange: false
    },
    items: [{
        flex: 1,
        minHeight: 180,
        xtype: 'chartsConnectedGrid'
    }, {
        xtype: 'panel',
        hidden: true,
        width: 400,
        height: 400,
        layout: 'fit',
        itemId: 'chartPreview'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Facet Query',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facet'

    }, {
        xtype: 'textarea',
        fieldLabel: 'Charts',
        value: '[]',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'charts'
    }]
});