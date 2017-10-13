Ext.define('SDT.view.dashboardAdmin.grids.columns.SeriesActions', {
    extend: 'Ext.grid.column.Action',
    text: 'Actions',
    alias: 'widget.seriesActions',
    constructor: function (config) {
        var me = this;

        config.items = me.buildItems();
        me.callParent(arguments);
        return me;
    },
    buildItems: function () {
        var me = this;
        return [{
            glyph: 0xf14b,
			tooltip: 'Edit Series',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('editItem', me, rec, 'editItem', item, grid);
            }
        }, {
            glyph: 0xf056,
			tooltip: 'Delete Series',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('deleteItem', me, rec, 'deleteItem', item, grid, rowIndex);
            }
        }];
    }
});