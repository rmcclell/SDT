Ext.define('SDT.controller.settingManager.ProfilesController', {
    extend: 'Ext.app.Controller',
    views: [
        'settingManager.forms.AddEditProfilesForm'
    ],
    models: [
        'settingManager.ProfilesModel'
    ],
    stores: [
        'settingManager.ProfilesStore'
    ],
    refs: [{
        ref: 'settingManagerDialogView',
        selector: 'settingManagerDialogView'
    }],
    init: function () {
        var me = this;
        me.control({
            'profilesGrid > toolbar > button#removeAll': {
                click: me.onProfileGridDeleteAllButtonClick
            },
            'profilesGrid profilesActions': {
                editItem: me.onProfileGridEditItem
            },
            'profilesGrid profilesActions, solrIndexesGrid solrIndexesActions': {
                deleteItem: me.onDeletItem
            },
            'profilesGrid > toolbar > button#add': {
                click: me.onProfileGridAddButtonClick
            },
            'addEditProfilesForm button#applyBtn': {
                click: me.onApplyButtonClick
            },
            'profilesGrid': {
                activate: me.onProfilesGridShow
            }
        });
    },

    onApplyButtonClick: function (btn) {
        var me = this,
            formPanel = btn.up('form'),
            form = formPanel.getForm(),
            foundRecord,
            formValues,
            window = btn.up('window'),
            store = window.store;

        if (form.isValid()) {
            formValues = form.getValues();
            me.removePreviousActive(store);
            formValues.active = (formValues.active === 'on') ? true : false;
            if (window.type === 'Add') {
                store.add(formValues);
            } else {
                foundRecord = form.getRecord();
                foundRecord.beginEdit();
                foundRecord.set(formValues); //Replace old values with new
                foundRecord.endEdit();
                foundRecord.commit();
            }
            window.close();
        } else {
            Ext.Msg.alert('', 'Please ensure all required fields are populated.');
        }
    },

    removePreviousActive: function (store) {
        var foundRecord = store.findRecord('active', true, 0, false, false, true);
        if (foundRecord) {
            foundRecord.beginEdit();
            foundRecord.set('active', false); //Replace old values with new
            foundRecord.endEdit();
            foundRecord.commit();
        }
    },

    onProfileGridAddButtonClick: function (button) {
        var store = button.up('grid').getStore();
        Ext.widget('addEditProfilesForm', { type: 'Add', store: store }).show();
    },

    onProfileGridEditItem: function (view, colIndex, rowIndex, item, e, record, row) {
        var store = record.store;
        var window = Ext.widget('addEditProfilesForm', { type: 'Edit', store: store }).show();
        var activeCheckBox = window.down('form').getForm().findField('active');
        window.down('form').getForm().loadRecord(record);

        if (record.get('active')) {
            activeCheckBox.setDisabled(true);
        } else {
            activeCheckBox.setDisabled(false);
        }

    },

    onDeletItem: function (view, colIndex, rowIndex, item, e, record, row) {
        record.store.removeAt(rowIndex);
    },

    onProfilesGridShow: function (grid) {
        var store = grid.getStore();
        store.loadRawData(Ext.state.Manager.get('profiles'));
    },

    onProfileGridDeleteAllButtonClick: function (button) {
        var provider = Ext.state.Manager.getProvider();
        var preferences = provider.state;

        for (var propertyName in preferences) {
            if (preferences.hasOwnProperty(propertyName) && propertyName === 'profiles') {
                Ext.state.Manager.clear(propertyName);
            }
        }

        button.up('grid').getStore().removeAll();
    }
});