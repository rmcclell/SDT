Ext.define('SDT.view.dashboardAdmin.grids.SeriesGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.SeriesActions'
    ],
    mixins: [
        'Ext.form.field.Field' //Added to allow use of standard form validation
    ], 
    alias: 'widget.seriesGrid',
    store: 'dashboardAdmin.SeriesStore',
    viewConfig: {
        emptyText: '<b align="center">No Seriess Defined</b>',
        deferEmptyText: true,
        loadMask: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'
        }
    },
    singleSelect: true,
    tools: [{
        xtype: 'button',
        text: 'Add Series',
        itemId: 'addSeries',
		glyph: 0xf0fe
    }],
    title: 'Series',
    columns: [{
        xtype: 'seriesActions',
        width: 50
    }, {
        text: 'Label',
        dataIndex: 'label',
        width: 60
    }, {
        text: 'Group',
        dataIndex: 'group',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        width: 60
    }, {
        text: 'Color',
        dataIndex: 'color',
        sortable: false,
        width: 40,
        renderer: function (val) {
            return !val || val === 'false' ? 'AUTO' : Ext.String.format('<div style="width:auto;height:15px;background-color:{0}"><!----></div>', val);
        }
    }, {
        text: 'Criteria',
        dataIndex: 'criteria',
        flex: 1,
        renderer: function (val) {
            return decodeURIComponent(val);
        }
    }, {
        text: 'FilterGrouping Type',
        dataIndex: 'filterGroupingType',
        flex: 1
    },
        {
        text: 'Criteria Grouping',
        dataIndex: 'criteriaGrouping',
        flex: 1
    }, {
        text: 'Facet Query',
        dataIndex: 'facetQuery',
        flex: 1,
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        renderer: function (val) {
            return decodeURIComponent(val);
        }
    }, {
        text: 'Series Criteria',
        dataIndex: 'seriesCriteria',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: !SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        flex: 1,
        renderer: function (val) {
            return Ext.encode(val);
        }
    }]
});