Ext.define('SDT.view.dashboard.DashboardCriteriaContainer', {
    extend: 'Ext.panel.Panel',
    requires: [
        'SDT.view.dashboard.DashboardCriteriaPanel',
        'SDT.view.dashboard.DashboardCurrentCriteriaPanel'
    ],
    header: false,
    width: 250,
    minWidth: 225,
    animCollapse: false,
    split: true,
    collapsible: true,
    layout: 'border',
    alias: 'widget.dashboardCriteriaContainer',
    items: [{
        xtype: 'dashboardCurrentCriteriaPanel',
        region: 'north'
    }, {
        xtype: 'dashboardCriteriaPanel',
        region: 'center'
    }],
    getDashboardCriteriaPanel: function () {
        return this.down('dashboardCriteriaPanel');
    },
    getSavedDashboardPanel: function () {
        return this.down('savedDashboardPanelBase');
    }
});