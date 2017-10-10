Ext.define('SDT.view.settingManager.PreferencesGridView', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.settingManager.grids.columns.PreferencesActions'
    ],
    alias: 'widget.preferencesGrid',
    store: Ext.create('Ext.data.Store', {
        fields: ['key', 'value'],
        proxy: 'memory'
    }),
    header: false,
    scrollable: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            glyph: 0xf056,
            text: 'Remove All',
            itemId: 'removeAll'
        }]
    }],
    columns: [{
        xtype: 'preferencesActions'
    }, {
        text: 'Key',
        dataIndex: 'key',
        flex: 1
    }, {
        text: 'Value',
        dataIndex: 'value',
        flex: 1
    }]
});