Ext.define('SDT.view.DashboardAdminView', {
    extend: 'Ext.container.Container',
    requires: [
        'SDT.view.dashboardAdmin.DashboardsGrid'
    ],
    alias: 'widget.dashboardAdminView',
    layout: {
        type: 'card',
        deferRender: true
    },
    activeItem: 0,
    items: [{
        title: 'Dashboard Admin Tool',
        xtype: 'dashboardsGrid'
    }]
});