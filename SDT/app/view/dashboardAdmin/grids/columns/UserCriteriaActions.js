﻿Ext.define('SDT.view.dashboardAdmin.grids.columns.UserCriteriaActions', {
    extend: 'Ext.grid.column.Action',
    text: 'Actions',
    alias: 'widget.userCriteriaActions',
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
			tooltip: 'Edit Criteria',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                me.fireEvent('editItem', me, rec, 'editItem', item, grid);
            }
        }, {
            glyph: 0xf056,
			tooltip: 'Delete Criteria',
            handler: function (grid, rowIndex, colIndex, item, e, rec, meta) {
                //Will eventually be moved to controller
                //Need to fire a custom event for controller
                me.fireEvent('deleteItem', me, rec, 'deleteItem', item, grid, rowIndex);
            }
        }];
    }
});