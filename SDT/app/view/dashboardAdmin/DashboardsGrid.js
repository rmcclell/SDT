Ext.define('SDT.view.dashboardAdmin.DashboardsGrid', {
    extend: 'Ext.grid.Panel',
    uses: [
        'SDT.util.DateUtils'
    ],
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.DashboardActions'
    ],
    alias: 'widget.dashboardsGrid',
    store: 'DashboardConfigStore',
    loadMask: true,
    singleSelect: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
            text: 'Create Dashboard',
			glyph: 0xf0fe,
            menu: {
                items: [{
                    text: 'Connected',
                    itemId: 'createConnectedDashboardBtn'
                }, {
                    text: 'Independent',
                    itemId: 'createIndependentDashboardBtn'
                }]
            }
        }, {
            xtype: 'tbseparator',
            margin: '0 8 0 8'
        }, {
            text: 'Refresh',
            glyph: 0xf021
        }, {
            xtype: 'tbseparator',
            margin: '0 8 0 8'
        }, {
            xtype: 'textfield',
            itemId: 'searchDashboardListsField',
            name: 'search',
            emptyText: 'Search...',
            enableKeyEvents: true
        }]
    }],
    columns: [{
        xtype: 'dashboardActions',
        width: 70
    }, {
        text: 'Active',
        dataIndex: 'active',
        xtype: 'booleancolumn',
        trueText: 'Yes',
        falseText: 'No',
        width: 50
    }, {
        text: 'Default',
        dataIndex: 'defaultDashboard',
        xtype: 'booleancolumn',
        trueText: 'Yes',
        falseText: 'No',
        width: 50
    }, {
        text: 'Type',
        dataIndex: 'type',
        width: 80
    }, {
        text: 'Title',
        dataIndex: 'title',
        flex: 1
    }, {
        text: 'Description',
        dataIndex: 'description',
        flex: 3
    }, {
        text: 'Create Date',
        dataIndex: 'createDate',
        width: 130,
        renderer: function (value, e, record) {
            return SDT.util.DateUtils.convertGridDate(value);
        }
    }, {
        text: 'Modified Date',
        dataIndex: 'modifiedDate',
        width: 130,
        renderer: function (value, e, record) {
            return SDT.util.DateUtils.convertGridDate(value);
        }
    }]
});