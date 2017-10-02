Ext.define('SDT.view.dashboardAdmin.cards.Details', {
    extend: 'Ext.ux.panel.Card',
    alias: 'widget.details',
    title: 'Edit Dashboard Details',
    trackResetOnLoad: true,
    description: 'Name your dashboard and provide a brief description that will help you easily idenitify it. For example, &quot;My Orders by Status&quot; You can make any dashboard your default view.',
    layout: 'fit',
    itemId: 'detailsCard',
    showTitle: true
});