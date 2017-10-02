Ext.define('SDT.view.dashboardAdmin.containers.DetailsContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.detailsContainer',
    layout: 'anchor',
    scrollable: true,
    defaults: {
        labelWidth: 120,
        anchor: '100%',
        margin: '20 5 20 5',
        validateOnBlur: false,
        validateOnChange: false
    }
});