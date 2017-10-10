Ext.define('SDT.controller.dashboardAdmin.DashboardSaveController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.cards.Save'
    ],
    models: [],
    stores: [],
    init: function () {
        var me = this;
        me.control({
            'dashboardWizardPanel save': {
                show: me.loadConnectedSaveData
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
    }
});