Ext.define('SDT.view.dashboardAdmin.cards.independent.SaveIndependent', {
    extend: 'SDT.view.dashboardAdmin.cards.Save',
    requires: [
        'SDT.view.dashboardAdmin.panels.SaveIndependentPanel'
    ],
    alias: 'widget.saveIndependent',
    description: 'Your chart has been created. Be sure to add it to a menu using the Dashboard Menu Admin Tool',
    items: [{
        xtype: 'saveIndependentPanel'
    }]
});