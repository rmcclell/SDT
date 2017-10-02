Ext.define('SDT.view.dashboardAdmin.cards.connected.DetailsConnected', {
    extend: 'SDT.view.dashboardAdmin.cards.Details',
    requires: [
        'SDT.view.dashboardAdmin.containers.connected.DetailsContainerConnected'
    ],
    alias: 'widget.detailsConnected',
    items: [{
        xtype: 'detailsContainerConnected'
    }]
});