﻿Ext.define('SDT.controller.dashboardAdmin.DashboardUserCriteriaController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.cards.UserCriteria',
        'dashboardAdmin.forms.AddEditUserCriteriaForm'
    ],
    models: [
        'dashboardAdmin.UserCriteriaModel'
    ],
    stores: [
        'dashboardAdmin.UserCriteriaStore',
        'dashboardAdmin.FieldStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'dashboardWizardPanel[type="Edit"] userCriteria': {
                show: me.loadUserCriteriaConnectedGrid
            },
            'userCriteria field[name="userCriteriaFields"]': {
                afterrender: me.bindCriteriaDataChangedEvent
            },
            'addEditUserCriteriaForm field[name="name"]': {
                select: me.updateLabelField
            },
            'userCriteriaGrid button#addCriteria': {
                click: me.showCreateCriteriaForm
            },
            'userCriteriaActions': {
                editItem: me.criteriaEditItem
            },
            'addEditUserCriteriaForm button#applyBtn': {
                click: me.applyCriteriaItem
            }
        });
    },
    refs: [{
        ref: 'charts',
        selector: 'charts'
    }],

    updateLabelField: function (field) {
        var labelField = field.up('form').getForm().findField('fieldLabel');

        labelField.setValue(field.getRawValue());
        labelField.focus(true, 10);
    },

    criteriaEditItem: function (column, record, eventName, actionItem, grid) {
        var view = Ext.widget('addEditUserCriteriaForm', { type: 'Edit' }),
            form = view.down('form').getForm();

        view.on('beforerender', function () {
            form.loadRecord(record);
        }, this, { single: true });

        view.show();

    },

    bindCriteriaDataChangedEvent: function (field) {
        var me = this,
            facet,
            facetValue,
            facetParts,
            facetFieldsArray,
            data,
            userCriteriaGrid = field.up('form').down('userCriteriaGrid'),
            store = userCriteriaGrid.getStore(),
            criteriaArray;

        store.on('datachanged', function () {
            criteriaArray = [];
            facetFieldsArray = [];
            facetValue = me.getCharts().getForm().findField('facet').getValue();
            facet = me.getCharts().getForm().findField('facet');

            store.each(function (record, index, len) {
                data = record.getData();
                //Push object on to criteria exlcude id property that is generated by extjs data model
                Ext.Array.include(criteriaArray, {
                    name: data.name,
                    fieldLabel: data.fieldLabel,
                    operatorType: data.operatorType
                });
            });

            //Merge facet field into one list of fields

            facetValue = facetValue.slice(1, facetValue.length);
            facetParts = facetValue.split('&');
            field.setValue(JSON.stringify(criteriaArray, null, 4));
            //userCriteriaGrid.validate();
        });
    },

    applyCriteriaItem: function (btn) {
        var formPanel = btn.up('form'),
            store = formPanel.store,
            form = formPanel.getForm(),
            formValues,
            criteria;

        if (form.isValid()) {
            formValues = form.getValues();

            formValues.fieldLabel = Ext.String.trim(formValues.fieldLabel); //Trim criteria label for trailing and leading whitespace

            criteria = Ext.create('SDT.model.dashboardAdmin.UserCriteriaModel', formValues);

            if (formPanel.type === 'Add') {
                if (store.findRecord('name', criteria.getData().name) === null) {
                    store.add(criteria);
                    form.reset();
                    formPanel.down('field[hidden="false"]').focus(true, 10); //Reset field focus to first visible field in form
                } else {
                    //Can only validate duplicate name on add
                    Ext.Msg.alert('Duplicate field name', 'The field name "' + criteria.getData().name + '" already exists in your criteria selection. Please edit the existing entry');
                }
            } else {
                foundRecord = form.getRecord();
                foundRecord = store.getById(foundRecord.id);
                foundRecord.beginEdit();
                foundRecord.set(criteria.getData()); //Replace old values with new
                foundRecord.endEdit();
                foundRecord.commit();
                store.sync(); //Sync is technically suppose to fire the datachange event on store but appears to be broken in framework
                store.fireEvent('datachanged', store);
                formPanel.close();
            }
        } else {
            Ext.Msg.alert('', 'Please ensure all required fields are populated.');
        }
    },

    loadUserCriteriaConnectedGrid: function (formPanel) {
        var me = this,
            field = formPanel.getForm().findField('userCriteriaFields'),
            store = formPanel.down('userCriteriaGrid').getStore();

        me.loadUserCriteriaGridFromField(field.getValue(), store);

    },

    loadUserCriteriaGridFromField: function (newValue, store) {
        var data = Ext.decode(newValue);
        store.loadData(data);
    },

    showCreateCriteriaForm: function (btn) {
        Ext.widget('addEditUserCriteriaForm', { store: btn.up('grid').getStore() }).show();
    }

});