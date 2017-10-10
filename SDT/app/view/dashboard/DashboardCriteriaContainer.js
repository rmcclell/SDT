Ext.define('SDT.view.dashboard.DashboardCriteriaContainer', {
    extend: 'Ext.panel.Panel',
    requires: [
        'SDT.view.dashboard.DashboardCriteriaPanel',
        'SDT.view.dashboard.DashboardCurrentCriteriaPanel'
    ],
    header: false,
    width: 260,
    minWidth: 260,
    animCollapse: false,
    split: true,
    collapsible: true,
    layout: 'vbox',
    defaults: { width: '100%' },
    alias: 'widget.dashboardCriteriaContainer',
    items: [{
        xtype: 'dashboardCurrentCriteriaPanel'
    }, {
        xtype: 'dashboardCriteriaPanel'
    }],
    getDashboardCriteriaPanel: function () {
        return this.down('dashboardCriteriaPanel');
    },
    getSavedDashboardPanel: function () {
        return this.down('savedDashboardPanelBase');
    }
});