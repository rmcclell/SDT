Ext.define('SDT.view.settingManager.grids.SolrFieldsGridView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.solrFieldsGrid',
    store: Ext.create('Ext.data.Store', {
        model: 'SDT.model.settingManager.FieldsModel',
        data: [],
        fields: [
            { name: 'key' },
            { name: 'value' },
            { name: 'type' },
            { name: 'showInGrid', defaultValue: true, type: 'boolean' }
        ],
        proxy: {
            type: 'memory',
            reader: { type: 'json' }
        },
        autoLoad: false
    }),
    header: false,
    scrollable: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            itemId: 'getSolrFields',
            glyph: 0xf0fe, //'x-icon icon-application_put',
            text: 'Get Fields'
        }, {
            xtype: 'button',
            glyph: 0xf0fe, //'x-icon icon-add',
            text: 'Add Field'
        }, {
            xtype: 'button',
            glyph: 0xf0fe, //'x-icon icon-delete',
            text: 'Remove All'
        }]
    }],
    columns: [{
        xtype: 'actioncolumn',
        width: 60,
        text: 'Actions',
        sortable: false,
        items: [{
            glyph: 'xf056@FontAwesome',
            tooltip: 'Delete Field'
        }, {
            glyph: 'xf14b@FontAwesome',
            tooltip: 'Edit Field'
        }]
    }, {
        text: 'Show In Grid',
        dataIndex: 'showInGrid',
        xtype: 'booleancolumn',
        trueText: 'Yes',
        falseText: 'No',
        width: 50
    }, {
        text: 'Key',
        dataIndex: 'key',
        flex: 1
    }, {
        text: 'Value',
        dataIndex: 'value',
        flex: 1
    }, {
        text: 'Type',
        dataIndex: 'type',
        flex: 1
    }]
});