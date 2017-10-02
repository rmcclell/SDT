Ext.define('SDT.view.dashboardAdmin.DashboardWizardPanel', {
    extend: 'Ext.ux.panel.Wizard',
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
            height: 40,
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
                baseCls: 'x-small-editor',
                border: false
            },
            layout: 'card'
        };
    },
    buildCards: function () {
        return [];
    }
});