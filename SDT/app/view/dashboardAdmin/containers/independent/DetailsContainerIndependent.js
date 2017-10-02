Ext.define('SDT.view.dashboardAdmin.containers.independent.DetailsContainerIndependent', {
    extend: 'SDT.view.dashboardAdmin.containers.DetailsContainer',
    alias: 'widget.detailsContainerIndependent',
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Title',
        name: 'title',
        allowBlank: false,
        hasFocus: true,
        helpText: 'Please provide a name for your new dashboard.'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: false,
        validator: function (text) {
            var me = this;
            me.setActiveErrors(Ext.Array.unique(me.getActiveErrors()));
            return (me.allowBlank === false && Ext.util.Format.trim(text).length === 0) ? me.blankText : true; //Validate textfield with just white space as false
        },
        helpText: 'Please provide a description for your new dashboard.'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Dashboard Type',
        name: 'type',
        value: 'Independent',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'textfield',
        fieldLabel: 'Created By',
        name: 'createdBy',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'textfield',
        fieldLabel: 'Modified By',
        name: 'modifiedBy',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'textfield',
        fieldLabel: 'Id',
        name: 'id',
        value: 'NEW',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'textfield',
        fieldLabel: 'Create Date',
        name: 'createDate',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'textfield',
        fieldLabel: 'Modified Date',
        name: 'modifiedDate',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'checkbox',
        fieldLabel: 'Active',
        name: 'active',
        helpText: 'Please provide whether your dashboard is active and available for use or not.',
        inputValue: true,
        checked: true
    }, {
        xtype: 'checkbox',
        fieldLabel: 'Default',
        name: 'defaultDashboard',
        disabled: true,
        helpText: 'Indicates whether the dashboard is set as the system default.',
        inputValue: true
    }]
});