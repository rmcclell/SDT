Ext.define('SDT.view.dashboardAdmin.grids.columns.ChartsActions', {
    extend: 'Ext.grid.column.Action',
    text: 'Actions',
    alias: 'widget.chartsActions',
    constructor: function (config) {
        var me = this;

        config.items = me.buildItems();
        me.callParent(arguments);
        return me;
    },
    buildItems: function () {
        var me = this;
        return [{
            glyph: 'xf14b@FontAwesome',
			tooltip: 'Edit Chart',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('editItem', me, rec, 'editItem', item, grid);
            }
        }, {
            glyph: 'xf056@FontAwesome',
			tooltip: 'Delete Chart',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('deleteItem', me, rec, 'deleteItem', item, grid, rowIndex);
            }
        }];
    }
});