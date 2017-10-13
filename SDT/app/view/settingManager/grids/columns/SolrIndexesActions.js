Ext.define('SDT.view.settingManager.grids.columns.SolrIndexesActions', {
    extend: 'Ext.grid.column.Action',
    text: 'Actions',
    alias: 'widget.solrIndexesActions',
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
            tooltip: 'Edit Solr Index',
            handler: function () { me.fireEventArgs('editItem', arguments); }
        }, {
            glyph: 0xf056,
            tooltip: 'Delete Solr Index',
            handler: function () { me.fireEventArgs('deleteItem', arguments); }
        }];
    }
});