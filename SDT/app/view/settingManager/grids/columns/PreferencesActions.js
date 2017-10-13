Ext.define('SDT.view.settingManager.grids.columns.PreferencesActions', {
    extend: 'Ext.grid.column.Action',
    width: 50,
    text: 'Actions',
    alias: 'widget.preferencesActions',
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
            tooltip: 'Edit Preference',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('editDashboard', this, rec, 'editDashboard', item, grid, rowIndex);
            }
        }, {
            glyph: 0xf056,
            tooltip: 'Delete Preference',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('deleteItem', this, rec, 'deleteItem', item, grid, rowIndex);
            }
        }];
    }
});