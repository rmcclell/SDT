Ext.define('SDT.view.dashboardAdmin.containers.independent.ChartsContainerIndependent', {
    extend: 'SDT.view.dashboardAdmin.containers.ChartsContainer',
    requires: [
        'SDT.view.dashboardAdmin.grids.ChartsIndependentGrid',
        'SDT.view.dashboardAdmin.grids.FiltersPreviewGrid'
    ],
    alias: 'widget.chartsContainerIndependent',
    layout: 'vbox',
    scrollable: true,
    defaults: {
        width: '100%',
        margin: 5,
        validateOnBlur: false,
        validateOnChange: false
    },
    items: [{
        flex: 1,
        minHeight: 180,
        xtype: 'chartsIndependentGrid'
    }, {
        xtype: 'panel',
        hidden: true,
        layout: 'fit',
        itemId: 'chartPreview'
    }, {
        xtype: 'chartUserCriteriaGrid',
        hidden: true
    }, {
        xtype: 'filtersPreviewGrid',
        hidden: true
    }, {
        xtype: 'textarea',
        fieldLabel: 'Facet Query',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facet'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Charts',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'charts'
    }]
});