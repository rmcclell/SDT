Ext.define('SDT.view.dashboardAdmin.cards.independent.DetailsIndependent', {
    extend: 'SDT.view.dashboardAdmin.cards.Details',
    requires: [
        'SDT.view.dashboardAdmin.containers.independent.DetailsContainerIndependent'
    ],
    alias: 'widget.detailsIndependent',
    items: [{
        xtype: 'detailsContainerIndependent'
    }]
});