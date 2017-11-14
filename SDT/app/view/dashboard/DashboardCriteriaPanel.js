Ext.define('SDT.view.dashboard.DashboardCriteriaPanel', {
    extend: 'Ext.form.Panel',
    requires: [
        'SDT.component.combo.OperatorCombo'
    ],
    alias: 'widget.dashboardCriteriaPanel',
    context: 'dashboard',
    trackResetOnLoad: true,
    stateful: true,
    layout: {
        type: 'vbox',
        reserveScrollbar: true // There will be a gap even when there's no scrollbar
    },
    flex: 2,
    scrollable: true,
    collapsible: false,
    title: 'User Criteria',
    defaults: { layout: 'hbox', vertical: false },
    tools: [{
        type: 'save',
        disabled: true,
        tooltip: 'Click to save the criteria for current selected saved user filter.'
    }],
    defaultType: 'container',
    initCriteriaPanel: function (dashboardId, userCriteriaFields, chartid) {
        var me = this;

        Ext.suspendLayouts();

        me.stateId = Ext.String.format('dashboardCriteriaDashboardId-{0}{1}', dashboardId, (Ext.isEmpty(chartid)) ? '' : Ext.String.format('-{0}', chartid));

        me.removeAll();
        me.add(
            me.buildFieldContainers(
                userCriteriaFields,
                me.buildChartFilters(),
                me.stateId
            )
        ); //Add criteria fields from config data
        Ext.resumeLayouts();
    },
    buildSavedCriteria: function (stateId) {
        return {
            defaults: { layout: { vertical: false, type: 'hbox', align: 'stretchmax' } },
            items: [{
                margin: '0 5 0 5',
                labelAlign: 'top',
                flex: 2,
                xtype: 'combo',
                stateful: true,
                stateId: stateId,
                stateEvents: ['change'],
                applyState: function (state) {
                    this.setValue(state.value, true);
                },
                getState: function (state) {
                    return {
                        value: this.value
                    };
                },
                listeners: {
                    beforestaterestore: {
                        fn: function (field, state) {

                            //Workarround to extjs bug with beforestaterestore not being seen in controller
                            var formPanel = this,
                                store = field.getStore(),
                                savedFilters = [];

                            state = Ext.state.Manager.get(formPanel.stateId, {});

                            store.removeAll();

                            Ext.Object.each(state, function (key, value) {
                                savedFilters.push({ display: key, value: key });
                            });

                            store.loadData(savedFilters);

                            return state;
                        },
                        scope: this
                    }
                },
                name: 'dashboardSavedUserCriteriaFilters',
                fieldLabel: 'Saved User Filters',
                displayField: 'display',
                valueField: 'value',
                submitValue: false,
                store: Ext.create('SDT.store.dashboard.DashboardSavedUserCriteriaStore'),
                typeAhead: true,
                editable: true,
                forceSelection: true,
                queryMode: 'local',
                emptyText: 'No Saved Filters'
            }, {
                xtype: 'button',
                glyph: 0xf0fe,
                name: 'addUserCriteriaFilter',
                margin: '22 5 0 0',
                tooltip: 'Click to add current user criteria as a new Saved User Filter.'
            }, {
                xtype: 'button',
                glyph: 0xf14b,
                name: 'editUserCriteriaFilter',
                margin: '22 5 0 0',
                tooltip: 'Click to edit the current selected criteria filter name.'
            }, {
                xtype: 'button',
                glyph: 0xf056,
                name: 'deleteUserCriteriaFilter',
                margin: '22 5 0 0',
                tooltip: 'Click to delete the current selected criteria.'
            }]
        };
    },
    buildFieldContainers: function (records, chartFilter, stateId) {
        var me = this,
            item,
            fieldContainers = [],
            fieldContainer = {};

        fieldContainers.push(me.buildSavedCriteria(stateId + '-dashboardSavedUserCriteriaFilters'));

        Ext.Array.each(records, function (record) {
            item = record.getData();
            fieldContainer = {
                defaults: { layout: 'hbox', labelAlign: 'top', margin: 6 },
                items: [{
                    xtype: 'tagfield',
                    width: 165,
                    stacked: true,
                    fieldLabel: item.fieldLabel,
                    name: item.name,
                    itemId: 'dashboard' + item.name + 'Filters',
                    valueField: 'fieldName',
                    forceSelection: false,
                    displayField: 'fieldName',
                    listConfig: {
                        loadingText: 'Searching...',
                        emptyText: 'No Data found.',

                        // Custom rendering template for each item
                        getInnerTpl: function () {
                            return '{fieldName}';
                        }
                    },
                    store: Ext.create('SDT.store.dashboard.DashboardCriteriaFilterStore'),
                    queryMode: 'local',
                    emptyText: ''
                }, {
                    xtype: 'operatorCombo',
                    name: item.name + 'Operator'
                }]
            };
            fieldContainers.push(fieldContainer);
        });

        fieldContainers.push(chartFilter);

        return fieldContainers;
    },
    buildChartFilters: function () {
        return {
            labelAlign: 'top',
            margin: 6,
            xtype: 'tagfield',
            fieldLabel: 'Chart Drill-in',
            name: 'dashboardSelectedChartFilters',
            itemId: 'dashboardSelectedChartFilters',
            valueField: 'filter',
            displayField: 'display',
            allowAddNewData: true,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No Data found.',

                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '{display}';
                }
            },
            store: Ext.create('SDT.store.dashboard.DashboardSelectedFilterStore'),
            selectOnFocus: false,
            editable: false,
            queryMode: 'local'
            //emptyText: 'No chart drill-in applied'
        };
    },
    saveState: function () { } //Needed to override deffault save behavoir
});