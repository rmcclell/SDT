Ext.define('SDT.view.settingManager.grids.columns.ProfilesActions', {
    extend: 'Ext.grid.column.Action',
    text: 'Actions',
    alias: 'widget.profilesActions',
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
            tooltip: 'Edit Profile',
            handler: function () { me.fireEventArgs('editItem', arguments); }
        }, {
            glyph: 0xf056,
            tooltip: 'Delete Profile',
            handler: function () { me.fireEventArgs('deleteItem', arguments); }
        }];
    }
});