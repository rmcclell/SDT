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
        xtype: 'container',
        itemId: 'chartContainer',
        layout: 'column',
        defaults: {
            columnWidth: 1.0,
            padding: '0 10 0 0',
            margin: '5 0 5 0',
            layout: 'fit',
            minWidth: 400
        },
        items: [{
            xtype: 'panel',
            hidden: true,
            width: 400,
            height: 300,
            itemId: 'chartPreview'
        }]
    }, {
        xtype: 'textarea',
        fieldLabel: 'Facet Query',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facet'

    }, {
        xtype: 'textarea',
        fieldLabel: 'Charts',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'charts'
    }]
});