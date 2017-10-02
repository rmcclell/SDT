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
            glyph: 'xf14b@FontAwesome',
            tooltip: 'Edit Solr Index',
            handler: function () { me.fireEventArgs('editItem', arguments); }
        }, {
            glyph: 'xf056@FontAwesome',
            tooltip: 'Delete Solr Index',
            handler: function () { me.fireEventArgs('deleteItem', arguments); }
        }];
    }
});