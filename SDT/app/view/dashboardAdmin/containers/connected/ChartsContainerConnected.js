Ext.define('SDT.view.dashboardAdmin.containers.connected.ChartsContainerConnected', {
    extend: 'SDT.view.dashboardAdmin.containers.ChartsContainer',
    requires: [
        'SDT.view.dashboardAdmin.grids.ChartsConnectedGrid'
    ],
    alias: 'widget.chartsContainerConnected',
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