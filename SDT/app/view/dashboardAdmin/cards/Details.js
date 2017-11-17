Ext.define('SDT.view.dashboardAdmin.cards.Details', {
    extend: 'Ext.ux.panel.Card',
    alias: 'widget.details',
    title: 'Details',
    trackResetOnLoad: true,
    description: 'Name your dashboard and provide a brief description that will help you easily idenitify it. For example, &quot;My Orders by Status&quot; You can make any dashboard your default view.',
    itemId: 'detailsCard',
    layout: 'vbox',
    scrollable: true,
    defaults: {
        width: '100%',
        margin: 5,
        validateOnBlur: false,
        validateOnChange: false
    },
    showTitle: true,
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Title',
        name: 'title',
        allowBlank: false
    }, {
        xtype: 'textarea',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: false,
        validator: function (text) {
            var me = this;
            me.setActiveErrors(Ext.Array.unique(me.getActiveErrors()));
            return (me.allowBlank === false && Ext.util.Format.trim(text).length === 0) ? me.blankText : true; //Validate textfield with just white space as false
        }
    }, {
        xtype: 'combo',
        fieldLabel: 'Data Source',
        itemId: 'dataIndex',
        name: 'solrIndexId',
        forceSelection: true,
        typeAhead: true,
        queryMode: 'local',
        store: 'SolrIndexesStore',
        displayField: 'name',
        valueField: 'id',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Id',
        name: 'id',
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
        inputValue: true,
        checked: true
    }, {
        xtype: 'checkbox',
        fieldLabel: 'Default',
        name: 'defaultDashboard',
        disabled: true,
        inputValue: true
    }]
});