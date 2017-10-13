Ext.define('SDT.view.dashboardAdmin.grids.columns.DashboardActions', {
    extend: 'Ext.grid.column.Action',
    width: 50,
    text: 'Actions',
    alias: 'widget.dashboardActions',
    constructor: function (config) {
        var me = this,
            items = this.buildItems();

        config.items = items;
        config.sortable = false;
        me.callParent([config]);
        return me;
    },
    buildItems: function () {
        var me = this;
        return [{
            glyph: 0xf14b,
			tooltip: 'Edit Dashboard',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('editDashboard', this, rec, 'editDashboard', item, grid, rowIndex);
            }
        }, {
            glyph: 0xf056,
            tooltip: 'Delete Dashoard',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('deleteItem', this, rec, 'deleteItem', item, grid, rowIndex);
            }
        }, {
            glyph: 0xf0c5,
			tooltip: 'Clone Dashboard',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('cloneDashboard', this, rec, 'cloneDashboard', item);
            }
        }];
    }
});