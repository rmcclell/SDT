Ext.define('SDT.model.dashboard.DashboardListsModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'title',
        { name: 'defaultDashboard', defaultValue: false }
    ]
});