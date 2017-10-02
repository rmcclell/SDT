Ext.define('SDT.view.dashboardAdmin.cards.connected.UserCriteriaConnected', {
    extend: 'SDT.view.dashboardAdmin.cards.UserCriteria',
    alias: 'widget.userCriteriaConnected',
    requires: [
        'SDT.view.dashboardAdmin.containers.UserCriteriaContainer'
    ],
    items: [{
        xtype: 'userCriteriaContainer'
    }]
});