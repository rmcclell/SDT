Ext.define('SDT.controller.settingManager.PreferencesController', {
    extend: 'Ext.app.Controller',
    refs: [{
        ref: 'settingManagerDialogView',
        selector: 'settingManagerDialogView'
    }],
    init: function () {
        var me = this;
        me.control({
            'preferencesGrid > toolbar > button#removeAll': {
                click: me.onUserPreferenceDeleteAllButtonClick
            },
            'preferencesGrid': {
                activate: me.onUserPreferencesGridShow
            }
        });
    },

    onDeletItem: function (view, colIndex, rowIndex, item, e, record, row) {
        record.store.removeAt(rowIndex);
    },

    onUserPreferencesGridShow: function (grid) {
        var store = grid.getStore();
        store.removeAll();
        var provider = Ext.state.Manager.getProvider();
        var preferences = provider.state;

        for (var propertyName in preferences) {
            store.add({
                key: propertyName,
                value: Ext.encode(preferences[propertyName])
            });
        }

        grid.columns[0].handler = function (grid, rowIndex, colIndex) {
            var rec = grid.getStore().getAt(rowIndex);
            var key = rec.get('key');

            grid.getStore().removeAt(rowIndex);
            provider.clear(key);
            alert('User preferences (' + key + ') has been deleted.');
        };
    },

    onUserPreferenceDeleteAllButtonClick: function (button) {
        var provider = Ext.state.Manager.getProvider();
        var preferences = provider.state;

        for (var propertyName in preferences) {
            if (preferences.hasOwnProperty(propertyName)) {
                Ext.state.Manager.clear(propertyName);
            }
        }

        button.up('grid').getStore().removeAll();
    }

});