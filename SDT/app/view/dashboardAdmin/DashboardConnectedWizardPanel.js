Ext.define('SDT.view.dashboardAdmin.DashboardConnectedWizardPanel', {
    extend: 'SDT.view.dashboardAdmin.DashboardWizardPanel',
    requires: [
        'SDT.view.dashboardAdmin.cards.connected.DetailsConnected',
        'SDT.view.dashboardAdmin.cards.connected.FiltersConnected',
        'SDT.view.dashboardAdmin.cards.connected.ChartsConnected',
        'SDT.view.dashboardAdmin.cards.connected.UserCriteriaConnected',
        'SDT.view.dashboardAdmin.cards.connected.SaveConnected'
    ],
    alias: 'widget.dashboardConnectedWizardPanel',
    dashboardType: 'Connected',
    buildCards: function () {

        var cards = [];

        // first card "Details"
        cards.push(Ext.widget('detailsConnected'));

        // second card "Filters"
        cards.push(Ext.widget('filtersConnected'));

        // third card "Charts"
        cards.push(Ext.widget('chartsConnected'));

        // fourth card "Criteria Selection"
        cards.push(Ext.widget('userCriteriaConnected'));

        //fifth card "Save"
        cards.push(Ext.widget('saveConnected'));

        return cards;
    }
});