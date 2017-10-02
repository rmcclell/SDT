Ext.define('SDT.view.dashboardAdmin.grids.ChartsIndependentGrid', {
    extend: 'SDT.view.dashboardAdmin.grids.ChartsGrid',
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.ChartsActions'
    ],
    alias: 'widget.chartsIndependentGrid',
    columns: [{
        xtype: 'chartsActions',
        width: 50
    }, {
        text: 'Chart Type',
        dataIndex: 'type',
        width: 110,
        renderer: function (val) {
            var tpl = Ext.create('Ext.Template', '<img class="x-grid-cell-icon {iconCls}" data-qtip="{chartType}" src="{spacer}"><span style="padding-left:15px;">{chartType}</span>', { compiled: true, disableFormats: true });

            if (val === 'pieChart') {
                return tpl.apply({ iconCls: 'icon-chart_pie', chartType: 'Pie Chart', spacer: Ext.BLANK_IMAGE_URL });
            } else if (val === 'columnChart') {
                return tpl.apply({ iconCls: 'icon-chart_column', chartType: 'Column Chart', spacer: Ext.BLANK_IMAGE_URL });
            } else {
                return tpl.apply({ iconCls: 'icon-chart_bar', chartType: 'Bar Chart', spacer: Ext.BLANK_IMAGE_URL });
            }
        }
    }, {
    text: 'Chart Title',
    dataIndex: 'title',
    flex: 1
}, {
    text: 'Data Source',
    dataIndex: 'dataIndex',
    flex: 1,
    renderer: function (val) { return val; }
}, {
    text: 'Facet Query',
    dataIndex: 'facetQuery',
    hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
    flex: 1
}, {
    text: 'Facet Field',
    dataIndex: 'facetField',
    hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
    flex: 1
}, {
    text: 'Chart Id',
    dataIndex: 'chartid',
    hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
    flex: 1
}, {
    text: 'Series Data',
    dataIndex: 'seriesData',
    hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
    flex: 1,
    renderer: function (val) {
        return Ext.isEmpty(val) ? '' : Ext.encode(val);
    }
}, {
    text: 'Query',
    dataIndex: 'query',
    hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
    hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
    flex: 1,
    renderer: function (val) {
        return Ext.isEmpty(val) ? '' : Ext.encode(val);
    }
}]
});