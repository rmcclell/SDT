Ext.define('SDT.view.dashboardAdmin.grids.UserCriteriaGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.UserCriteriaActions',
        'SDT.store.dashboardAdmin.UserCriteriaStore'
    ],
    alias: 'widget.userCriteriaGrid',
    initComponent: function () {
        var me = this;
        //Need to create a unique instance of the store because this grid is instantiated muliple times.
        me.store = Ext.create('SDT.store.dashboardAdmin.UserCriteriaStore');
        me.callParent(arguments);
    },
    viewConfig: {
        emptyText: '<b align="center">No User Criteria Defined</b>',
        deferEmptyText: true,
        loadMask: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'
        }
    },
    title: 'User Criteria',
    singleSelect: true,
    tools: [{
        xtype: 'button',
        text: 'Add Criteria',
        glyph: 0xf0fe
    }],
    columns: [{
        xtype: 'userCriteriaActions',
        width: 50
    }, {
        text: 'Field Label',
        dataIndex: 'fieldLabel',
        flex: 1
    }, {
        text: 'Field Name',
        dataIndex: 'name',
        flex: 1
    }, {
        text: 'Operator',
        hidden: true,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        dataIndex: 'operatorType',
        flex: 1
    }]
});