Ext.define('SDT.view.dashboardAdmin.cards.Filters', {
    extend: 'Ext.ux.panel.Card',
    alias: 'widget.filters',
    description: 'Add filtering criteria to customize your dashboard. This will allow you to show only the order you want by the information you want to see first.',
    title: 'Create Dashboard Base Query',
    trackResetOnLoad: true,
    itemId: 'filterCard', //Needed for getWizardData Call
    layout: 'fit',
    showTitle: true
});