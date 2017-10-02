Ext.define('SDT.view.dashboardAdmin.cards.connected.ChartsConnected', {
    extend: 'SDT.view.dashboardAdmin.cards.Charts',
    requires: [
        'SDT.view.dashboardAdmin.containers.connected.ChartsContainerConnected'
    ],
    alias: 'widget.chartsConnected',
    items: [{
        xtype: 'chartsContainerConnected'
    }]
});