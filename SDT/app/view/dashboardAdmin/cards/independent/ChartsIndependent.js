Ext.define('SDT.view.dashboardAdmin.cards.independent.ChartsIndependent', {
    extend: 'SDT.view.dashboardAdmin.cards.Charts',
    requires: [
        'SDT.view.dashboardAdmin.containers.independent.ChartsContainerIndependent'
    ],
    alias: 'widget.chartsIndependent',
    description: 'Each chart is separate from the other charts. There is nothing shared including base criteria and user criteria.',
    title: 'Configure Charts',
    items: [{
        xtype: 'chartsContainerIndependent'
    }]
});