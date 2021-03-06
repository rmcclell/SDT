﻿Ext.define('SDT.view.dashboardAdmin.grids.ChartsGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.ChartsActions'
    ],
    alias: 'widget.chartsGrid',
    store: 'dashboardAdmin.ChartStore',
    viewConfig: {
        emptyText: '<b align="center">No Charts Defined</b>',
        deferEmptyText: true,
        loadMask: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'
        }
    },
    title: 'Charts',
    singleSelect: true,
    tools: [{
        xtype: 'button',
        text: 'Add Chart',
        itemId: 'addChart',
        tooltip: 'Add pie or bar charts to the dashboard of data in a select field',
        glyph: 0xf14b
    }],
    columns: [{
        xtype: 'chartsActions',
        width: 50
    }, {
        text: 'Type',
        dataIndex: 'type',
        width: 110,
        renderer: function (val) {
            var tpl = Ext.create('Ext.Template', '<i class="fa {iconCls}" data-qtip="{chartType}"></i><span style="padding-left:15px;">{chartType}</span>', { compiled: true, disableFormats: true });

            if (val === 'pieChart') {
                return tpl.apply({ iconCls: 'fa-pie-chart', chartType: 'Pie Chart' });
            } else if (val === 'columnChart') {
                return tpl.apply({ iconCls: 'fa-column-chart', chartType: 'Column Chart' });
            } else {
                return tpl.apply({ iconCls: 'fa-bar-chart', chartType: 'Bar Chart' });
            }
        }
    }, {
        text: 'Data Source',
        dataIndex: 'dataSource',
        width: 80,
        align: 'center',
        renderer: function (val) {
            if (val === 'FacetQuery') {
                return 'Query';
            } else {
                return 'Field';
            }
        }
    }, {
        text: 'Title',
        dataIndex: 'title',
        flex: 1
    }, {
        text: 'Field Label',
        dataIndex: 'fieldLabel',
        flex: 1
    }, {
        text: 'Field Name',
        dataIndex: 'fieldName',
        flex: 1
    }, {
        text: 'Facet Query',
        dataIndex: 'facetQuery',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        flex: 1
    }, {
        text: 'Facet Field',
        dataIndex: 'facetField',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        flex: 1
    }, {
        text: 'Chart Id',
        dataIndex: 'chartid',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        flex: 1
    }, {
        text: 'Series Data',
        dataIndex: 'seriesData',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        flex: 1,
        renderer: function (val) {
            return Ext.isEmpty(val) ? '' : Ext.encode(val);
        }
    }]
});