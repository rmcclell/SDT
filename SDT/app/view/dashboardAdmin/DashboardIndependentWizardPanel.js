Ext.define('SDT.view.dashboardAdmin.DashboardIndependentWizardPanel', {
    extend: 'SDT.view.dashboardAdmin.DashboardWizardPanel',
    requires: [
        'SDT.view.dashboardAdmin.cards.independent.DetailsIndependent',
        'SDT.view.dashboardAdmin.cards.independent.ChartsIndependent',
        'SDT.view.dashboardAdmin.cards.independent.SaveIndependent'
    ],
    alias: 'widget.dashboardIndependentWizardPanel',
    dashboardType: 'Independent',
    buildCards: function () {

        var cards = [];

        // first card "Details"
        cards.push(Ext.widget('detailsIndependent'));

        // second card "Charts"
        cards.push(Ext.widget('chartsIndependent'));

        //fifth card "Save"
        cards.push(Ext.widget('saveIndependent'));

        return cards;
    }
});