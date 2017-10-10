Ext.define('SDT.view.settingManager.ProfilesGridView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.profilesGrid',
    requires: [
        'SDT.view.settingManager.grids.columns.ProfilesActions'
    ],
    store: 'settingManager.ProfilesStore',
    header: false,
    scrollable: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            glyph: 0xf0fe,
            text: 'Add',
            itemId: 'add'
        }, {
            xtype: 'button',
            glyph: 0xf056,
            text: 'Remove All',
            itemId: 'removeAll'
        }]
    }],
    columns: [{
        xtype: 'profilesActions'
    }, {
        text: 'Active',
        dataIndex: 'active',
        xtype: 'booleancolumn',
        trueText: 'Yes',
        falseText: 'No',
        width: 50
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 1
    }, {
        text: 'Create Date',
        dataIndex: 'createDate',
        flex: 1
    }, {
        text: 'Modified Date',
        dataIndex: 'modifiedDate',
        flex: 1
    }]
});