Ext.define('SDT.view.dashboard.DashboardAddEditSavedUserCriteriaFilter', {
    extend: 'Ext.form.Panel',
    alias: 'widget.dashboardAddEditSavedUserCriteriaFilter',
    autoShow: true,
    modal: true,
    frame: true,
    floating: true,
    closable: true,
    mode: undefined, //Must be set on creation
    config: {
        savedUserFilterCombo: undefined
    },
    width: 400,
    height: 100,
    bodyPadding: 5,
    trackResetOnLoad: true,
    layout: 'anchor',
    initComponent: function () {
        var me = this;
        me.setSavedUserFilterCombo(me.config.savedUserFilterCombo);
        me.title = (me.mode === 'add') ? 'Add Criteria Filter' : 'Edit Criteria Filter';
        me.callParent(arguments);
    },
    items: [{
        anchor: '100%',
        name: 'dashboardSavedUserCriteriaFilters',
        xtype: 'textfield',
        selectOnFocus: true,
        vtype: 'alphanumspace',
        allowBlank: false,
        fieldLabel: 'Filter Name'
    }],
    buttons: [{
        text: 'Apply',
        formBind: true,
        name: 'apply'
    }, {
        text: 'Cancel',
        name: 'cancel'
    }]
});