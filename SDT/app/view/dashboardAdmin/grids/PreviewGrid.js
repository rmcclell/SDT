Ext.define('SDT.view.dashboardAdmin.grids.PreviewGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.column.RowNumberer'
    ],
    alias: 'widget.previewGrid',
    store: 'dashboard.DashboardResultStore',
    loadMask: true,
    singleSelect: true,
    columns: []
});