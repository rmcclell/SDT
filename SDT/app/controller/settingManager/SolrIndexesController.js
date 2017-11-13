Ext.define('SDT.controller.settingManager.SolrIndexesController', {
    extend: 'Ext.app.Controller',
    views: [
        'settingManager.forms.AddEditSolrIndexesForm'
    ],
    models: [
        'settingManager.SolrIndexesModel',
        'settingManager.SolrIndexFieldsModel'
    ],
    stores: [
        'settingManager.SolrIndexFieldsStore'
    ],
    refs: [{
        ref: 'settingManagerDialogView',
        selector: 'settingManagerDialogView'
    }],
    init: function () {
        var me = this;
        me.control({
            'solrIndexesGrid > toolbar > button#add': {
                click: me.onSolrIndexesAddButtonClick
            },
            'solrIndexesGrid solrIndexesActions': {
                editItem: me.onSolrIndexesEditItem
            },
            'addEditSolrIndexesForm[type="Edit"] > addEditSolrIndexesForm button#applyBtn': {
                beforerender: function (button) {
                    button.setText('Edit');
                }
            },
            'addEditSolrIndexesForm grid > toolbar > button#removeAll': {
                click: me.onFieldDeleteAllButtonClick
            },
            'addEditSolrIndexesForm grid > toolbar > button#getSolrFields': {
                click: me.getSolrFields
            },
            'addEditSolrIndexesWForm button#applyBtn': {
                click: me.onApplyButtonClick
            }
        });
    },

    onApplyButtonClick: function (btn) {
        var formPanel = btn.up('form'),
            form = formPanel.getForm(),
            solrFieldsStore,
            data = [],
            foundRecord,
            formValues,
            window = btn.up('window'),
            store = window.store;

        if (form.isValid()) {
            formValues = form.getValues();
            solrFieldsStore = formPanel.down('grid').getStore();
            formPanel.down('grid').getStore().each(function (item, index, count) {
                data.push(item.getData());
            });

            formValues.fields = data;

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

    onSolrIndexesEditItem: function (view, colIndex, rowIndex, item, e, record, row) {
        var formPanel = Ext.widget('addEditSolrIndexesForm', { type: 'Edit', store: view.getStore() }).show();
        formPanel.getForm().loadRecord(record);
        formPanel.down('grid').getStore().loadData(record.get('solrFields'));
    },

    getSolrFields: function (button) {


        //<field name="weight" type="float" indexed="true" stored="true"/>

        /*
        Ext.define('Field', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'name', mapping: '@name' },
                { name: 'type', mapping: '@type' },
                { name: 'indexed', mapping: '@indexed', type:'boolean' },
                { name: 'stored', mapping: '@stored', type:'boolean' },
                { name: 'stored', mapping: '@stored', type:'boolean' },
                { name: 'required', mapping: '@required', type:'boolean' },
                { name: 'multiValued', mapping: '@multiValued', type:'boolean' }
            ]
        });
        */

        var store = button.up('grid').getStore();

        var myStore = Ext.create('SDT.store.settingManager.SolrIndexFieldsStore');

        myStore.load(function () {
            store.removeAll();
            store.loadRecords(myStore.getRange());
        });

    },

    onSolrIndexesAddButtonClick: function (button) {
        Ext.widget('addEditSolrIndexesForm').show();
    },

    onFieldDeleteAllButtonClick: function (button) {
        button.up('grid').getStore().removeAll();
    },

    onDeletItem: function (view, colIndex, rowIndex, item, e, record, row) {
        record.store.removeAt(rowIndex);
    },

    onSolrIndexesGridDeleteAllButtonClick: function (button) {
        var provider = Ext.state.Manager.getProvider();
        var preferences = provider.state;

        for (var propertyName in preferences) {
            if (preferences.hasOwnProperty(propertyName) && propertyName === 'solrIndexes') {
                Ext.state.Manager.clear(propertyName);
            }
        }

        button.up('grid').getStore().removeAll();
    }
});