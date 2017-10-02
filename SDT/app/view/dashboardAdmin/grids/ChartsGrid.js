Ext.define('SDT.view.dashboardAdmin.grids.ChartsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.chartsGrid',
    store: 'dashboardAdmin.ChartStore',
    viewConfig: {
        emptyText: '<b align="center">No Charts Defined</b>',
        deferEmptyText: true,
        loadMask: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'
        }
    },
    title: 'Charts',
    singleSelect: true,
    tools: [{
        xtype: 'button',
        text: 'Add Chart',
        tooltip: 'Add pie or bar charts to the dashboard of data in a select field',
        glyph: 'xf14b@FontAwesome'
    }],
    columns: [] //Columns defined in inherited components
});