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
    }
    ],
    alias: 'widget.dashboardRowResultsGrid',
    store: 'dashboard.DashboardResultStore',
    stateful: true,
    stateId: 'dashboardRowResultsGrid',
    prefix: '',
    //Columns Definitions come from omc2 storage lookup column family
    columns: [{
        sealed: true,
        text: '',
        itemId: 'startingColumn',
        menuDisabled: true,
        draggable: false,
        stateful: false,
        hideable: false,
        cls: 'x-grouped-column-header',
        columns: [{
            xtype: 'rownumberer',
            height: 60,
            stateful: false,
            draggable: false,
            width: 60
        }]
    }]
});