Ext.define('SDT.view.dashboardAdmin.cards.Charts', {
    extend: 'Ext.ux.panel.Card',
    alias: 'widget.charts',
    description: 'Add Charts to visualize your filter Results.',
    title: 'Charts',
    trackResetOnLoad: true,
    itemId: 'chartsCard', //Needed for getWizardData Call
    showTitle: true,
    layout: 'fit'
});