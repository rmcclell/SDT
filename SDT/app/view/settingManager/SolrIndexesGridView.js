Ext.define('SDT.view.settingManager.SolrIndexesGridView', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.settingManager.grids.columns.SolrIndexesActions'
    ],
    alias: 'widget.solrIndexesGrid',
    store: 'SolrIndexesStore',
    header: false,
    scrollable: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            glyph: 0xf056,
            text: 'Add',
            itemId: 'add'
        }, {
            xtype: 'button',
            glyph: 0xf0fe,
            text: 'Remove All',
            itemId: 'removeAll'
        }]
    }],
    columns: [{
        xtype: 'solrIndexesActions'
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 1
    }, {
        text: 'Base Url',
        dataIndex: 'baseUrl',
        flex: 1
    }, {
        text: 'Admin Url',
        dataIndex: 'adminUrl',
        flex: 1
    }, {
        text: 'Fields',
        dataIndex: 'solrFields',
        renderer: function (val, meta, record) {
            return Ext.encode(val);
        },
        flex: 1
    }]
});