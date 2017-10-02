Ext.define('SDT.controller.dashboardAdmin.DashboardSaveController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.panels.SaveConnectedPanel',
        'dashboardAdmin.panels.SaveIndependentPanel'
    ],
    models: [],
    stores: [],
    init: function () {
        var me = this;
        me.control({
            'dashboardConnectedWizardPanel save': {
                show: me.loadConnectedSaveData
            },
            'dashboardIndependentWizardPanel save': {
                show: me.loadIndependentSaveData
            }
        });
    },
    refs: [{
        ref: 'dashboardsGrid',
        selector: 'dashboardsGrid'
    }],

    loadConnectedSaveData: function (panel) {
        var wizardData = panel.up('wizard').getWizardData(),
            data = {
                title: wizardData.detailsCard.title,
                description: wizardData.detailsCard.description,
                active: wizardData.detailsCard.active,
                dataIndex: wizardData.detailsCard.dataIndex,
                charts: (!Ext.isEmpty(wizardData.chartsCard.charts)) ? Ext.decode(wizardData.chartsCard.charts) : [],
                criteria: (!Ext.isEmpty(wizardData.criteriaSelectionCard.userCriteriaFields)) ? Ext.decode(wizardData.criteriaSelectionCard.userCriteriaFields) : [],
                filters: (!Ext.isEmpty(wizardData.filterCard.baseCriteria)) ? Ext.decode(wizardData.filterCard.baseCriteria) : []
            };

        panel.down('dataview').store.loadRawData(data);
    },

    loadIndependentSaveData: function (panel) {
        var wizardData = panel.up('wizard').getWizardData(),
            data = {
                title: wizardData.detailsCard.title,
                description: wizardData.detailsCard.description,
                active: wizardData.detailsCard.active,
                charts: (!Ext.isEmpty(wizardData.chartsCard.charts)) ? Ext.decode(wizardData.chartsCard.charts) : []
            };

        panel.down('dataview').store.loadRawData(data);
    }
});