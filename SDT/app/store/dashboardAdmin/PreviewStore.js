Ext.define('SDT.store.dashboardAdmin.PreviewStore', {
    //Eventually this store will be phased out entire replaced by DashboardResultStore temp to not have to change all the references
    extend: 'SDT.store.dashboard.DashboardResultStore',
    autoLoad: false,
    storeId: 'previewStore'
});