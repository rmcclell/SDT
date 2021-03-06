﻿Ext.define('SDT.view.DashboardsView', {
    extend: 'Ext.container.Container',
    requires: [
        'SDT.view.dashboard.DashboardCriteriaContainer',
        'SDT.view.dashboard.DashboardChartResultsContainer',
        'SDT.view.dashboard.DashboardRowResultsGrid'
    ],
    alias: 'widget.dashboardsView',
    layout: 'border',
    items: [{
        xtype: 'dashboardCriteriaContainer',
        region: 'west'
    }, {
        xtype: 'dashboardChartResultsContainer',
        scrollable: true,
        region: 'center',
        tools: [{
            xtype: 'button',
            glyph: 0xf021,
            text: 'Refresh',
            tooltip: 'Click to reload dashboard configuration and results data.',
            itemId: 'refresh'
        }]
    }, {
        flex: 1,
        xtype: 'dashboardRowResultsGrid',
        collapseMode: 'mini',
        hideCollapseTool: true,
        region: 'south',
        collapsible: true,
        animCollapse: false,
        split: true,
        minHeight: 160
    }]
});