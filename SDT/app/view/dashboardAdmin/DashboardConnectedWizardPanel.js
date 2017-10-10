Ext.define('SDT.view.dashboardAdmin.DashboardConnectedWizardPanel', {
    extend: 'SDT.view.dashboardAdmin.DashboardWizardPanel',
    requires: [
        'SDT.view.dashboardAdmin.cards.Details',
        'SDT.view.dashboardAdmin.cards.Filters',
        'SDT.view.dashboardAdmin.cards.Charts',
        'SDT.view.dashboardAdmin.cards.UserCriteria',
        'SDT.view.dashboardAdmin.cards.Save'
    ],
    alias: 'widget.dashboardConnectedWizardPanel',
    dashboardType: 'Connected',
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