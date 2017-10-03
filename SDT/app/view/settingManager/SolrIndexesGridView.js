Ext.define('SDT.view.settingManager.SolrIndexesGridView', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.settingManager.grids.columns.SolrIndexesActions'
    ],
    alias: 'widget.solrIndexesGrid',
    store: 'settingManager.SolrIndexesStore',
    header: false,
    scrollable: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            glyph: 0xf056,
            text: 'Add'
        }, {
            xtype: 'button',
            glyph: 0xf0fe,
            text: 'Remove All'
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
            return Ext.encode(record.solrFields());
        },
        flex: 1
    }]
});