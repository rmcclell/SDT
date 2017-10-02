Ext.define('SDT.view.dashboardAdmin.cards.connected.SaveConnected', {
    extend: 'SDT.view.dashboardAdmin.cards.Save',
    requires: [
        'SDT.view.dashboardAdmin.panels.SaveConnectedPanel'
    ],
    alias: 'widget.saveConnected',
    items: [{
        xtype: 'saveConnectedPanel'
    }]
});