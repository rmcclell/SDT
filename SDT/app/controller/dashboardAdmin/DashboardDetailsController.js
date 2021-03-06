﻿Ext.define('SDT.controller.dashboardAdmin.DashboardDetailsController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.cards.Details'
    ],
    stores: [
        'dashboardAdmin.FieldStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'details field[name="dataIndex"]': {
                beforerender: me.setDefaultValue
            },
            'details field[name="title"]': {
                beforerender: me.bindTitleFieldValidator
            }
        });
    },
    refs: [],
    bindTitleFieldValidator: function (field) {
        var store = Ext.getStore('DashboardConfigStore');

        //Create custom validator to check if title is already taken bound at runtime to allow access to dashboard store
        field.validator = function (text) {
            var me = this,
                trimText = Ext.util.Format.trim(text),
                foundRecord = Ext.isEmpty(me.originalValue) || me.originalValue !== trimText ? store.findRecord('title', trimText, 0, false, false, true) : null;

            me.setActiveErrors(Ext.Array.unique(me.getActiveErrors()));

            if (me.allowBlank === false && trimText.length === 0) {
                return me.blankText; //Validate textfield with just white space as false
            } else if (foundRecord) {
                return Ext.String.format('"{0}" already exists title must be one that is unique.', trimText); //Validate if title is already in use
            } else {
                return true;
            }
        };
    },

    setDefaultValue: function (combo) {
        combo.getStore().loadData(Ext.state.Manager.get('solrIndexes'));
    },
    loadFieldStore: function (dataIndex) {
        var me = this,
            store = me.getDashboardAdminFieldStoreStore();

        store.getProxy().extraParams = {
            dataIndex: dataIndex
        };

        store.load();
    }

});