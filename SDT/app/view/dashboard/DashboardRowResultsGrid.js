Ext.define('SDT.view.dashboard.DashboardRowResultsGrid', {
    extend: 'Ext.grid.Panel',
    uses: [
        'SDT.util.UtilFunctions'
    ],
    requires: [
        'SDT.component.button.ExportButton'
    ],
    tools: [{
        xtype: 'exportButton'
    }],
    alias: 'widget.dashboardRowResultsGrid',
    store: 'dashboard.DashboardResultStore',
    stateful: true,
    stateId: 'dashboardRowResultsGrid',
    prefix: '',
    //Columns Definitions come from omc2 storage lookup column family
    columns: []
});