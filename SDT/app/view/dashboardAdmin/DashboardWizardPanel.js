Ext.define('SDT.view.dashboardAdmin.DashboardWizardPanel', {
    extend: 'Ext.ux.panel.Wizard',
    requires: [
        'SDT.view.dashboardAdmin.cards.Details',
        'SDT.view.dashboardAdmin.cards.Filters',
        'SDT.view.dashboardAdmin.cards.Charts',
        'SDT.view.dashboardAdmin.cards.UserCriteria',
        'SDT.view.dashboardAdmin.cards.Save'
    ],
    alias: 'widget.dashboardWizardPanel',
    dashboardType: 'Connected',
    includeHeaderPanel: true,
    includeSidePanel: false,
    closeOnFinish: false,
    initComponent: function () {
        var me = this;

        me.cards = me.buildCards();
        me.cardPanelConfig = me.buildCardPanelConfig();

        me.initialConfig.headConfig = me.buildHeadConfig();
        me.headConfig = me.initialConfig.headConfig;

        me.initialConfig.sideConfig = me.buildSideConfig();
        me.sideConfig = me.initialConfig.sideConfig;

        me.callParent(arguments);
    },
    buildHeadConfig: function () {
        var me = this,
            mode = me.type === 'Edit' ? 'Update' : 'Create';
        return {
            title: 'Dashboarding Design Wizard: ' + mode + ' ' + me.dashboardType + " Dashboard",
            height: 10,
            headerPosition: 'top',
            position: 'top',
            stepText: 'Step {0} of {1}: {2}'
        };
    },
    buildSideConfig: function () {
        // no sideConfig suplied no header will be shown.
        return null;
    },
    buildCardPanelConfig: function () {
        return {
            defaults: {
                bodyStyle: 'background-color:transparent;',
                border: false
            },
            layout: 'card'
        };
    },
    buildCards: function () {

        var cards = [
            Ext.widget('details'), // first card "Details"
            Ext.widget('filters'), // second card "Filters"
            Ext.widget('charts'), // third card "Charts"
            Ext.widget('userCriteria'), // fourth card "Criteria Selection"
            Ext.widget('save') //fifth card "Save"
        ];

        return cards;
    }
});