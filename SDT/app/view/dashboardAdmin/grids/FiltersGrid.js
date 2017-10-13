Ext.define('SDT.view.dashboardAdmin.grids.FiltersGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.FiltersActions'
    ],
    alias: 'widget.filtersGrid',
    store: 'dashboardAdmin.FiltersStore',
    initComponent: function () {
        var me = this;
        //Need to create a unique instance of the store because this grid is instantiated muliple times.
        me.store = Ext.create('SDT.store.dashboardAdmin.FiltersStore');
        me.callParent(arguments);
    },
    viewConfig: {
        emptyText: '<b align="center">No Filters Defined</b>',
        deferEmptyText: true,
        loadMask: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'
        }
    },
    title: 'Filters',
    height: 200,
    singleSelect: true,
    tools: [{
        xtype: 'button',
        text: 'Add Filter',
        itemId: 'addFilter',
        tooltip: 'Apply filters to reduce your results returned',
        glyph: 0xf055
    }],
    columns: [{
        xtype: 'filtersActions',
        width: 50
    }, {
        text: 'Condition',
        dataIndex: 'condition',
        align: 'center',
        width: 60
    }, {
        text: 'Operator',
        dataIndex: 'operator',
        align: 'center',
        width: 60
    }, {
        text: 'Field Label',
        dataIndex: 'fieldLabel',
        flex: 1
    }, {
        text: 'Field Name',
        dataIndex: 'fieldName',
        flex: 1
    }, {
        text: 'Criteria',
        dataIndex: 'criteria',
        flex: 1,
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        renderer: function (val) {
            return decodeURIComponent(val);
        }
    }, {
        text: 'Filter Type',
        dataIndex: 'type',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        flex: 1
    }, {
        text: 'From',
        dataIndex: 'from',
        flex: 1,
        renderer: function (val) {
            //Not always a solr date 
            return decodeURIComponent(val);
        }
    }, {
        text: 'To',
        dataIndex: 'to',
        flex: 1,
        renderer: function (val) {
            //Not always a solr date
            return decodeURIComponent(val);
        }
    }, {
        text: 'Value',
        dataIndex: 'value',
        flex: 1,
        renderer: function (val, metaData, record) {

            var value = (Ext.isArray(val)) ? Ext.Array.clone(val) : val; //Clone the array to avoid altering orignal

            value = (Ext.isString(value) && !Ext.isEmpty(value)) ? value.split(',') : value;

            if (Ext.isArray(value)) {
                if (record.data.type === 'Boolean') {
                    Ext.Array.each(value, function (item, index, allItems) {
                        allItems[index] = Ext.String.capitalize(item); //Capitalize True, False for display
                    });
                } else if (record.data.type === 'Text') {
                    Ext.Array.each(value, function (item, index, allItems) {
                        allItems[index] = item.replace(/"/, '').replace(/\"/, ''); //Remove Extra Quotes 
                    });
                }
                value = value.join(', ');
            }

            return value;
        }
    }]
});