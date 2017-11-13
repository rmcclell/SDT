Ext.define('SDT.controller.dashboard.DashboardController', {
    extend: 'Ext.app.Controller',
    uses: [
        'SDT.util.DateUtils'
    ],
    views: [
        'dashboard.DashboardCriteriaContainer',
        'dashboard.DashboardCriteriaPanel',
        'dashboard.DashboardCurrentCriteriaPanel',
        'dashboard.DashboardRowResultsGrid',
        'dashboard.DashboardChartResultsContainer',
        'dashboard.chart.pieChart',
        'dashboard.chart.columnChart',
        'dashboard.chart.barChart'
    ],
    models: [
        'dashboard.DashboardQueryConfigModel',
        'dashboard.DashboardFieldValueModel',
        'dashboard.DashboardFieldValuesModel',
        'dashboard.DashboardChartConfigModel',
        'dashboard.DashboardUserCriteriaFieldConfigModel',
        'dashboard.DashboardBaseCriteriaConfigModel',
        'dashboard.DashboardConfigModel',
        'dashboard.DashboardResultModel',
        'dashboard.DashboardResponseModel'
    ],
    stores: [
        'dashboard.DashboardCriteriaFilterStore',
        'dashboard.DashboardListsStore',
        'dashboard.DashboardChartsStore',
        'dashboard.DashboardCriteriaCombosStore',
        'dashboard.DashboardResultStore',
        'dashboard.DashboardSelectedFilterStore'
    ],
    currentDashboardId: undefined,
    init: function () {
        var me = this;
        me.control({
            'button#dashboardsListBtn menuitem': {
                click: me.onDashboardMenuClick
            },
            'dashboardCriteriaPanel combo': {
                expand: me.onFilterExpand,
                collapse: me.onFilterCollapse,
                applyFilterChange: me.onApplyFilterChange,
                removeitem: me.applyFilterChange
            },
            'dashboardCriteriaPanel operatorCombo': {
                applyFilterChange: me.onApplyFilterChange,
                select: me.applyFilterChange
            },
            'dashboardCriteriaContainer': {
                collapse: me.collapseDashboardCriteriaContainer,
                expand: me.expandDashboardCriteriaContainer
            },
            //'dashboardRowResultsGrid': {
            //beforerender: me.setupGridColumns
            //},
            'pieChart, barChart, columnChart': {
                dashboardSeriesClick: me.onChartFilterChange
            },
            //Use afterrender only when dashboardsView is set as the activeItem in the ViewPort to do the initial load of the Dashboard.
            //If DashboardsView is not the activeItem, remove this.
            'dashboardsView': {
                afterrender: me.onDashboardChange
            },
            'dashboardsView button[name="refresh"]': {
                click: me.refreshDashboard
            },
            'viewport': {
                afterrender: me.initDashboardStores
            }
        });
    },
    refs: [{
        ref: 'dashboardsView',
        selector: 'dashboardsView'
    }, {
        ref: 'dashboardCurrentCriteriaPanel',
        selector: 'dashboardCurrentCriteriaPanel'
    }, {
        ref: 'dashboardCriteriaPanel',
        selector: 'dashboardCriteriaPanel'
    }, {
        ref: 'dashboardFilters',
        selector: '#dashboardSelectedChartFilters'
    }],

    applyFilterChange: function (field) {
        field.fireEvent('applyFilterChange', field);
    },

    reloadActiveChartData: function () {

        var me = this,
            dashboardConfigStore = Ext.getStore('DashboardConfigStore'),
            criteriaPanel = me.getDashboardCriteriaPanel();

        //me.loadDashboardConfigComps(criteriaPanel, dashboardConfigStore);

    },

    onFilterExpand: function (field) {
        field.valueOnExpand = field.getValue(); //field.lastValue is changed immediately upon selection so a seperate var was need to check for change after collapse. combo boxes cant update till user collapses field to all multiply values to be selected
    },

    onFilterCollapse: function (field) {
        if (Ext.isArray(field.getValue()) && field.getValue().length > 0 && !field.isEqual(field.valueOnExpand, field.getValue())) {
            this.applyFilterChange(field);
        }
    },

    initDashboardStores: function () {
        var me = this,
            store = Ext.getStore('DashboardConfigStore');

        me.initMenuStore(store);
    },

    initMenuStore: function (store) {
        var me = this,
            btnMenu;

        btnMenu = Ext.ComponentQuery.query('#dashboardsListBtn')[0].menu; //Dashboard menu button could reuse for other menu buttons in future
        me.buildDashboardMenu(store, btnMenu);
        me.bindMenuChanged(store, btnMenu);
        
    },

    setupGridColumns: function (grid) {
        var me = this,
            columns = grid.defaultColumns,
            fixedIntialConfigColumns = [],
            fields = [],
            intialConfigColumns = [];

        grid.stateful = false; //Avoid reconfigure from triggering state change

        //Apply state after grid loads columns
        grid.on('reconfigure', function () {
            state = Ext.state.Manager.get(grid.stateId);

            if (state) {
                grid.applyState(state);
            }

            grid.stateful = true;

        }, me, { single: true });

        //Get column config information from grid

        Ext.Array.each(grid.columns, function (record, index, len) {
            //Dont push the checkbox config on to new list of columns otherwise it doubles
            if (Ext.isEmpty(record.dataIndex)) {
                fixedIntialConfigColumns.push(record.initialConfig); //Push rownumberer column and action columns
            } else {
                intialConfigColumns.push(record.initialConfig);
            }
        });

        //Merge config data from grid view with columns return from service call

        Ext.Array.each(columns, function (column) {

            Ext.Array.each(intialConfigColumns, function (intialConfigColumn) {
                if (intialConfigColumn.dataIndex === column.dataIndex) {
                    if (column.type === 'tdate') {
                        intialConfigColumn.renderer = function (v, record) {
                            return SDT.util.DateUtils.convertGridDate(v, record);
                        };
                    }
                    Ext.apply(column, intialConfigColumn);
                }
            });

            //Construct fields object for dynamic store

            var fieldData;

            if (column.type === 'tdate') {

                fieldData = {
                    name: column.dataIndex,
                    type: 'date',
                    dateFormat: 'c'
                };

            } else {
                fieldData = column.dataIndex;
            }

            fields.push(fieldData);
        });

        columns = Ext.Array.merge(fixedIntialConfigColumns, columns);

        //Create model from scratch to avoid sorter not getting reset
        var store = Ext.create('SDT.store.dashboard.DashboardResultStore');
        store.setFields(fields);

        grid.reconfigure(store, columns);

        if (Ext.isGecko) {
            if (grid.xtype === 'dashboardRowResultsGrid') {
                grid.down('#sortingOrderLabel').setDisabled(false);
            }
        }
    },

    bindMenuChanged: function (store, btnMenu) {
        var me = this;

        store.on('datachanged', function () {
            me.buildDashboardMenu(store, btnMenu);
        });
    },

    buildGridColumns: function (records, grid) {
        var me = this, columns = [];

        Ext.Array.each(records, function (record) {
            var obj = {};
            //record = record.getData();

            if (record.type === 'boolean') {
                obj.xtype = 'booleancolumn';
                obj.trueText = 'Yes';
                obj.falseText = 'No';
            }

            //Apply column renderers
            if (record.type === 'tdate') {
                if ((record.key === 'orderLastUpdatedTime')) {
                    obj.renderer = function (value) { return SDT.util.DateUtils.convertGridDate(value); };
                } else {
                    obj.renderer = function (value) { return SDT.util.DateUtils.removeTimestamp(value); };
                }
            }

            //Additional override config can be provided in view

            obj.dataIndex = record.key;
            obj.hidden = (record.showInGrid) ? false : true;
            obj.type = record.type;
            obj.text = record.value;
            obj.flex = 1;

            columns.push(obj);

        });

        grid.defaultColumns = columns;
        me.setupGridColumns(grid);
    },

    getDefaultColumns: function (currentDashboardRecord) {

        var me = this,
            records,
            store = Ext.getStore('SolrIndexesStore'),
            foundRecord,
            grid = Ext.ComponentQuery.query('dashboardRowResultsGrid')[0];

        
        foundRecord = store.getById(currentDashboardRecord.get('solrIndexId')),
            records = foundRecord.get('solrFields');
        me.buildGridColumns(records, grid);
        
    },

    refreshDashboard: function () {
        var me = this,
            callbackFn,
            criteriaPanel = me.getDashboardCriteriaPanel(),
            dashboardConfigStore = Ext.getStore('DashboardConfigStore');

        //callbackFn = function (records, operation, success) {
        //    if (success && records.length > 0) {
        //        me.loadDashboardConfigComps(criteriaPanel, dashboardConfigStore);
        //    }
        //};

        //dashboardConfigStore.load({ callback: callbackFn });
    },

    initDashboardConfigStore: function (store, filterParams) {
        var me = this,
            foundRecord,
            criteriaPanel = me.getDashboardCriteriaPanel();

        store.on('datachanged', function (store) {
            if (store.getCount() > 0) {
                me.loadDashboardConfigComps(criteriaPanel, store);
            } else {
                Ext.Msg.show({
                    title: 'Dashboard Error',
                    msg: 'We could not find your default dashboard. Would you like us to reset to system default. Click no to chose another dashboard from menu',
                    buttons: Ext.Msg.YESNO,
                    fn: function (btn) {
                        if (btn === 'yes') {
                            //Restore dashboard to system default and load
                            Ext.state.Manager.set('lastDashboardId', null);
                            /*
                            foundRecord = dashboardDefaultStore.first();

                            if (foundRecord) {
                                me.currentDashboardId = foundRecord.getData().id; //Set the default as current dashboard
                            }
                            
                            dashboardConfigStore.getProxy().extraParams = { dashboardId: me.currentDashboardId, chartid: me.getLastActiveChartId() };
                            dashboardConfigStore.load({ callback: callbackFn });
                            */
                        }
                        //Allow user to pick another dashboard to load
                    },
                    icon: Ext.Msg.QUESTION
                });
            }
        }, { single: true });

        store.loadRawData(Ext.state.Manager.get('dashboards'));
    },

    onDashboardChange: function () {
        var me = this,
            dashboardConfigStore = Ext.getStore('DashboardConfigStore');

        me.currentDashboardId = (!Ext.isEmpty(Ext.state.Manager.get('lastDashboardId'))) ?
            Ext.state.Manager.get('lastDashboardId') : Ext.state.Manager.get('defaultDashboardId'); //Set the default dashboard as current dashboard

        me.initDashboardConfigStore(dashboardConfigStore, { dashboardId: me.currentDashboardId, chartid: me.getLastActiveChartId() });

    },
    buildDashboardMenu: function (store, btnMenu) {
        var menu = [],
            records = store.getRange(),
            currentMenu = btnMenu;

        Ext.suspendLayouts();

        btnMenu.removeAll();

        for (var r = 0; r < records.length; r++) {
            menu.push({
                text: records[r].get('title'),
                tooltip: records[r].get('description'),
                glyph: 0xf1ea
            });
        }
        currentMenu.add(menu)
        Ext.resumeLayouts();
    },

    loadDashboard: function (queries, dashboardConfig) {
        var me = this,
            dashboardConfigStore = Ext.getStore('DashboardConfigStore'),
            resultsPanelConfig = { type: '', titlePrefix: 'Results', exportable: true, namespace: 'DashboardRowResultsGrid' },
            chartInfo = me.getChartInfo(dashboardConfig.getData()),
            chartConfig = dashboardConfig.charts(),
            dataIndex = dashboardConfig.get('dataIndex'),
            proxy = dashboardConfigStore.getProxy(),
            dashboardsView = me.getDashboardsView(),
            dashboardChartResultsContainer = dashboardsView.down('dashboardChartResultsContainer'),
            callbackFn,
            title;

        //Set dashboard view active before loading tab

        //dashboardsView.getEl().mask('Loading...', 'loadingMask');

        title = Ext.String.format('Dashboards: <span style="cursor:pointer;" data-qtip="{0}">{1}</span>', Ext.String.htmlEncode(me.buildDashboardInfoTpl(chartInfo)), chartInfo.title);

        dashboardChartResultsContainer.setTitle(title);

        //callbackFn = function (records, operation, success) {
        //if (success) {

        var userCriteriaData = (dashboardConfig.type === 'Connected') ? dashboardConfig.userCriteriaData : me.getActiveChart(dashboardConfigStore.first()).get('userCriteriaData');

        me.loadCriteriaCombosData(chartConfig, chartInfo, dashboardConfig);
        me.loadChartData(chartConfig, chartInfo, dashboardConfig);
        me.loadResultsPanel(resultsPanelConfig, dashboardConfig);
        //}
        //dashboardsView.getEl().unmask();
        //};

        //Set sent params both connected charts wrap params as array

        //proxy.url = '/data/mock/dashboard/' + Ext.state.Manager.get('defaultDashboardId') + '/DashboardConnectedCharts.json';
        //proxy.url = chartInfo.dataIndex + 'select';
        //proxy.extraParams = {
        //q: '*:*',
        //facet: true,
        //'facet.field': 'coat',
        //rows: 0
        //};
        //proxy.extraParams = { chartParms: queries };

        //dashboardStore.load({
        //    scope: me,
        //    callback: callbackFn
        //});

    },
    loadCriteriaCombosData: function (chartConfig, chartInfo, dashboardConfig) {
        var me = this,
            store = Ext.getStore('DashboardCriteriaCombosStore'),
            proxy = store.getProxy(),
            fieldNames = Ext.Array.pluck(Ext.Array.pluck(dashboardConfig._userCriteriaFields.getRange(), 'data'), 'name');

        proxy.url = chartInfo.dataIndex + 'select';

        /*
        proxy.extraParams = {
            q: '*:*',
            facet: true,
            'json.nl': 'arrarr',
            'facet.missing': true,
            'facet.field': fieldNames,
            rows: 0
        };
        */

        proxy.url += '?q=*:*&facet=true&json.nl=arrarr&facet.missing=true&rows=0&facet.field=' + fieldNames.join('&facet.field=')


        var callbackFn = function (records) {
            if (records.length) {
                me.loadCriteriaCombos(chartInfo, dashboardConfig, records[0].get('facet_fields'));
            }
        };

        store.load({ callback: callbackFn });

    },
    loadChartData: function (chartConfig, chartInfo, dashboardConfig) {
        var me = this,
            store = Ext.getStore('DashboardChartsStore'),
            proxy = store.getProxy(),
            fieldNames = Ext.Array.unique(Ext.Array.pluck(Ext.Array.pluck(chartConfig.getRange(), 'data'), 'fieldName')).join(',');

        proxy.url = chartInfo.dataIndex + 'select';
        
        proxy.extraParams = {
            q: '*:*',
            facet: true,
            'json.nl': 'arrarr',
            'facet.missing': true,
            'facet.field': fieldNames,
            rows: 0
        };
        var callbackFn = function () {
            me.loadPanelConfig(chartConfig, store, dashboardConfig, chartInfo);
        };

        store.load({ callback: callbackFn });

        //dashboardsView.getEl().unmask();
    },

    loadResultsPanel: function (resultsPanelConfig, dashboardConfig) {
        var me = this,
            query = {},
            dashboardsView = me.getDashboardsView(),
            dashboardChartResultsContainer = dashboardsView.down('dashboardChartResultsContainer'),
            currentContainer = dashboardChartResultsContainer.down('container'),
            grid = dashboardsView.down('dashboardRowResultsGrid'),
            activepanel = (dashboardConfig.type === 'Connected') ? null : Ext.ComponentQuery.query('#' + this.getLastActiveChartId() + '-panel', currentContainer)[0],
            activeChartTitle = (activepanel) ? activepanel.title + ': ' : '',
            fields,
            store,
            proxy;

        grid.hide(); //hide to avoid autoLoad from triggering

        store = grid.getStore();
        proxy = store.getProxy();

        fields = Ext.Array.pluck(grid.defaultColumns, 'dataIndex');

        if (fields.length > 0) {
            query.fieldsList = fields.join(',');
        }
        //proxy.url = '/data/mock/dashboard/' + Ext.state.Manager.get('defaultDashboardId') + '/Dashboard.json';
        proxy.url = 'http://localhost:8983/solr/cats/select';
        proxy.extraParams = { q: '*:*' };
        //proxy.extraParams = query;

        store.on('beforeload', function () {
            grid.show(); //Used to supress autoLoad bug issue
        });

        store.load({
            scope: me,
            callback: function (records, operation, success) {
                grid.setTitle(activeChartTitle + ' Results - ' + store.getTotalCount());
                //grid.setTitle(activeChartTitle + resultsPanelConfig.titlePrefix + ' - ' + store.getTotalCount());
            }
        });

    },
    loadPanelConfig: function (chartConfig, chartDataStore, dashboardConfig, chartInfo) {
        var me = this,
            records,
            i,
            defaultContentObj = {},
            lastActiveChartId,
            dashboardsView = me.getDashboardsView(),
            panel = dashboardsView.down('dashboardChartResultsContainer'),
            val;

        Ext.suspendLayouts();

        //Remove previous charts

        records = chartConfig.getRange();

        if (!Ext.isEmpty(records)) {
            //Find last active chartid
            lastActiveChartId = (!Ext.isEmpty(me.getLastActiveChartId())) ? me.getLastActiveChartId() : records[0].getData().chartid;
        }

        var dashboardConfigObj = {
            reference: 'dashboard',
            maxColumns: 3,
            columnWidths: [0.33, 0.33, 0.33],
            parts: {},
            defaultContent: []
        };

        
        Ext.Array.each(records, function (record, index, allRecords) {
            var currentChartConifg = record.getData(),
                //data = (chartDataStore.getById(currentChartConifg.chartid)) ? chartDataStore.getById(currentChartConifg.chartid).getData() : { "facet_counts": { "facet_queries": {}, "facet_fields": {}, "facet_dates": {}, "facet_ranges": {} } },
                data = chartDataStore.first().getData(),
                panel,
                store = (currentChartConifg.dataSource === 'FacetQuery')
                    ? me.buildFacetQueryStore(data.facet_queries, currentChartConifg.chartid, currentChartConifg.seriesData)
                    : me.buildFacetFieldStore(data.facet_fields[currentChartConifg.fieldName], currentChartConifg.fieldName),
                chart;

            //currentChartConifg.controller = 'SDT.controller.dashboard.DashboardController';

            chart = me.buildChart(currentChartConifg, store);

            //chart.title = currentChartConifg.title;

            dashboardConfigObj.parts['portlet' + (index + 1)] = me.createPortlet(chart, dashboardConfig.type, currentChartConifg.title, lastActiveChartId);
            defaultContentObj = me.createDefaultContent(index);

            dashboardConfigObj.defaultContent.push(defaultContentObj);
        });
        
        var dashboard = Ext.create('Ext.dashboard.Dashboard', dashboardConfigObj);
        //var dashboardContainer = Ext.ComponentQuery.query('#dashboardContainer')[0];

        panel.removeAll();

        panel.add(dashboard);

        Ext.resumeLayouts(false);
    },
    createDefaultContent: function (index) {

        var numberOfColumns = 3, val = 0, height = 300;

        //Calculate correct column position wrapping arround when it exceeds number or columns

        if (index < 0) { val = index + numberOfColumns; }
        else if (index >= numberOfColumns) { val = index % numberOfColumns; }
        else { val = index; }

        return {
            type: 'portlet' + (index + 1),
            columnIndex: val,
            height: height
        };
    },

    loadCriteriaCombos: function (chartInfo, dashboardConfig, userCriteriaData) {

        var me = this,
            dashboardConfigStore = Ext.getStore('DashboardConfigStore'),
            dashboardCriteriaPanel = me.getDashboardCriteriaPanel(),
            dashboardCriteriaForm = dashboardCriteriaPanel.getForm();

        dashboardCriteriaForm.getFields().each(function (field) {
            if (field.name !== 'dashboardSelectedChartFilters' && field.name !== 'dashboardSavedUserCriteriaFilters') {
                Ext.Object.each(userCriteriaData, function (fieldName, fieldData) {
                    if (field.name === fieldName) {
                        if (fieldData && fieldData.length > 0) {
                            if (fieldData[fieldData.length - 1] && fieldData[fieldData.length - 1][0] === null) {
                                fieldData[fieldData.length - 1][0] = 'Not Set';
                            }
                            field.store.loadData(fieldData);
                        }
                    }
                });
            }
        });
    },
    buildDashboardInfoTpl: function (data) {
        var tpl = Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<p>',
            '<b>Title:</b> {title}<br>',
            '<b>Description:</b> {description}<br>',
            '<b>Type:</b> {type}<br>',
            '<b>Created Date:</b> {createDate}<br>',
            '<b>Modified Date:</b> {modifiedDate}<br>',
            '</p>',
            '</tpl>'
        );
        return tpl.apply(data);
    },

    getCurrentDashboardRecord: function (store) {
        return store.getById(this.currentDashboardId);
    },

    loadDashboardConfigComps: function (criteriaPanel, store) {
        var me = this,
            dataIndex,
            firstConfigRecord;

        firstConfigRecord = me.getCurrentDashboardRecord(store);

        if (firstConfigRecord.get('type') === 'Connected') {
            dataIndex = firstConfigRecord.get('dataIndex');
            me.getDefaultColumns(firstConfigRecord);
            criteriaPanel.initCriteriaPanel(firstConfigRecord.getData().id, firstConfigRecord.userCriteriaFields().getRange());
            me.loadBaseCriteriaPanel(firstConfigRecord.baseCriteria());
        }
    },

    getLastActiveChartId: function () {
        return Ext.state.Manager.get(Ext.String.format('activeChart-{0}', this.currentDashboardId));
    },

    getActiveChart: function (dashboardConfig) {
        //State code to retrieve state from user prefs will go here

        //Get last active chart
        var lastActiveChartId = this.getLastActiveChartId();

        return (!Ext.isEmpty(lastActiveChartId)) ? dashboardConfig.charts().getById(lastActiveChartId) : dashboardConfig.charts().getAt(0); //For now first chart is active by default;
    },

    onDashboardMenuClick: function (menu) {
        var me = this,
            viewportPanel = menu.up('viewport').down('panel'),
            dashboardsView = me.getDashboardsView(),
            criteriaPanel = me.getDashboardCriteriaPanel(),
            dashboardConfigStore = Ext.getStore('DashboardConfigStore');

        dashboardsView.on('titlechange', function () {
            //viewportPanel.getEl().unmask();
        }, me, { single: true });

        //viewportPanel.getEl().mask('Loading...', 'loadingMask');
        viewportPanel.getLayout().setActiveItem(dashboardsView); //Set parent view active

        if (menu.dashboardId && menu.dashboardId !== me.currentDashboardId) {
            me.currentDashboardId = menu.dashboardId;

            //Only save preference entry if user click on dashboard the is not the system default
            if (!menu.defaultDashboard) {
                Ext.state.Manager.set('lastDashboardId', menu.dashboardId); //Save the dashboard id of the last loaded
            } else {
                Ext.state.Manager.set('lastDashboardId', null);
            }

            me.initDashboardConfigStore(dashboardConfigStore, { dashboardId: menu.dashboardId, chartid: me.getLastActiveChartId() });

        } else {
            //viewportPanel.getEl().unmask();
        }
    },
    loadBaseCriteriaPanel: function (store) {

        var me = this,
            dashboardBaseCriteriaPanel,
            tpl;

        if (store.getCount() > 0) {
            tpl = Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<p>',
                '<b>Label:</b> {fieldLabel}<br>',
                '<b>Name:</b> {name}<br>',
                '<b>Operator:</b> {operator}<br>',
                '<b>Value:</b> {value}<br>',
                '</p>',
                '</tpl>'
            );
        } else {
            tpl = Ext.create('Ext.Template', '<p><b>No Base Criteria Defined</b><br>Administrators may add base criteria through the dashboard admin tool located under the admin menu.</p>');
        }

        dashboardBaseCriteriaPanel = me.getDashboardCurrentCriteriaPanel();

        Ext.suspendLayouts();

        dashboardBaseCriteriaPanel.removeAll(); //Remove previous criteria data before add
        dashboardBaseCriteriaPanel.add(Ext.create('Ext.view.View', {
            store: store,
            tpl: tpl,
            itemSelector: 'div.basecriteria-wrap',
            emptyText: 'No base criteria'
        }));

        Ext.resumeLayouts(true);
    },
    //Fires change event which triggers onApplyFilterChange
    onChartFilterChange: function (obj) {
        var me = this,
            range = obj.storeItem.get('range'),
            //Not using name to populate newDisplay be cause saving a chart drill in the folling reload the information is lost Ex 7-14 Days Old would go to [NOW-14DAYS TO NOW-7DAYS]
            //We would need to change more code to name to work before and after save also it is likely labels could change by admins and this would probably make it a bad idea to store this a stale
            //Plus dynamic finding may present problems when two chart with same field exists in same dashboard which is possible
            rangeParts,
            rangeField,
            rangeValue,
            rangeValueParts,
            fromRangeValue,
            toRangeValue,
            containsSpace,
            encodedRange,
            filter,
            dashboardFilters = me.getDashboardFilters();

        //Parse range data to check for spaces on string values wrap to and from values that have spaces with double qoutes

        rangeParts = range.split(':');
        rangeField = rangeParts[0];
        rangeValue = rangeParts[1];
        rangeValue = rangeValue.slice(rangeValue.indexOf('[') + 1, rangeValue.length - 1);
        rangeValueParts = rangeValue.split(' TO ');
        fromRangeValue = rangeValueParts[0];
        toRangeValue = rangeValueParts[1];
        containsSpace = (fromRangeValue.search(/\s/) !== -1) ? true : false;
        range = (containsSpace) ? Ext.String.format('{0}:["{1}" TO "{2}"]', rangeField, fromRangeValue, toRangeValue) : Ext.String.format('{0}:[{1} TO {2}]', rangeField, fromRangeValue, toRangeValue);
        encodedRange = encodeURIComponent(range);

        filter = Ext.create('SDT.model.dashboard.DashboardSelectedFilterModel', {
            filter: encodedRange,
            display: range
        });

        dashboardFilters.store.on('datachanged', function () {
            dashboardFilters.addValue(encodedRange);
            dashboardFilters.setValue(encodedRange, true);
            me.onApplyFilterChange(dashboardFilters);
        }, me, { single: true });

        dashboardFilters.store.insert(0, filter);
    },

    onApplyFilterChange: function (obj) {
        var me = this,
            queries = [],
            callback,
            parent = obj.up('container'),
            operatorCombo = parent.down('operatorCombo'),
            criteriaCombo = parent.down('combo'),
            dashboardConfigStore = Ext.getStore('DashboardConfigStore'),
            criteriaFilters = me.getCriteriaFilters(),
            firstConfigRecord,
            criteriaPanel = me.getDashboardCriteriaPanel();

        callback = function () {

            firstConfigRecord = me.getCurrentDashboardRecord(dashboardConfigStore);

            if (firstConfigRecord.get('type') === 'Connected') {
                queries.push(firstConfigRecord.getQuery().getData());
                queries[0].filters = criteriaFilters;
                me.loadDashboard(queries, firstConfigRecord);
            }

        };

        if (criteriaPanel && obj.getValue()) {
            callback();

            if (operatorCombo && criteriaCombo.getValue() && criteriaCombo.getValue().length === 0) {
                operatorCombo.reset();
            }
        }
    },

    getChartInfo: function (data) {
        return {
            id: data.id,
            title: data.title,
            type: data.type,
            description: data.description,
            createDate: data.createDate,
            modifiedDate: data.modifiedDate,
            dataIndex: data.dataIndex
        };
    },

    getCriteriaFilters: function () {
        var criteriaFilters = '',
            criteriaPanel = this.getDashboardCriteriaPanel(),
            searchParams,
            fqAllArray = [],
            fqArray,
            operator,
            field,
            operatorValue,
            seperator,
            s;

        if (criteriaPanel) {
            searchParams = criteriaPanel.getValues();
            Ext.Object.each(searchParams, function (param) {
                searchParams[param] = (Ext.isString(searchParams[param])) ? Ext.String.trim(searchParams[param]) : searchParams[param];
                if (Ext.isEmpty(searchParams[param])) {
                    searchParams[param] = null;
                    delete searchParams[param];
                } else {
                    field = criteriaPanel.getForm().findField(param);
                    fqArray = [];
                    operator = null;

                    if (field.up('container').down('operatorCombo')) {
                        operator = field.up('container').down('operatorCombo');
                    }

                    operatorValue = (operator !== null) ? operator.getValue() : '=';
                    operatorValue = (operatorValue === '=') ? '' : '-';

                    if (field.getXType() !== 'operatorCombo' && field.name !== 'dashboardSelectedChartFilters' && field.name !== 'dashboardSavedUserCriteriaFilters') {
                        fqArray.push(operatorValue);
                        fqArray.push(field.name);
                        fqArray.push(':('); //OR conditions must be wrapped with parentheses
                    }

                    Ext.Array.each(field.getValue(), function (fieldItem, index, fieldItems) {
                        if (field.getXType() !== 'operatorCombo') {
                            seperator = encodeURIComponent(' OR ');
                            seperator = (fieldItems[index + 1]) ? seperator : '';

                            if (field.name !== 'dashboardSelectedChartFilters' && field.name !== 'dashboardSavedUserCriteriaFilters') {

                                if (fieldItem === 'Not Set') {
                                    s = Ext.String.format('{0}{1}', encodeURIComponent('((*:* NOT [* TO *]) OR (*:* ["" TO ""]))'), seperator); //Exclude blank and null values
                                } else {
                                    s = Ext.String.format('"{0}"{1}', encodeURIComponent(fieldItem), seperator);
                                }

                            } else if (field.name !== 'dashboardSavedUserCriteriaFilters') {
                                s = fieldItem;
                            }
                            fqArray.push(s);
                        }
                    });

                    if (field.getXType() !== 'operatorCombo' && field.name !== 'dashboardSelectedChartFilters' && field.name !== 'dashboardSavedUserCriteriaFilters') {
                        fqArray.push(')'); //OR conditions must be wrapped with parentheses
                    }

                    if (fqArray.join('') !== '') {
                        fqAllArray.push(fqArray.join(''));
                    }
                }
            });

            criteriaFilters = fqAllArray.join('');
            criteriaFilters = criteriaFilters.replace(/\\/g, ''); //Remove escaped forward slashes for double quotes getting escaped twice
            criteriaFilters = '&fq=' + criteriaFilters;
        }

        return criteriaFilters;
    },
    /**
    * color mapping object to map colors to pre-known pie chart data.
    * Also contains an array of earth tone colors for any chart to use during ChartBuild proccess
    */
    colorMapping: {
        genericFillColors: ['#94AE0A', '#115fA6', '#543930', '#FF8809', '#FFd13e', '#A61187', '#24AD9A', '#7C7474', '#A66111', '#00FFFF', '#000000', '#0000FF', '#FF00FF', '#808080', '#008000', '#00FF00', '#800000', '#000080', '#808000', '#FFA500', '#800080', '#FF0000', '#C0C0C0', '#008080', '#FFFFFF', '#FFFF00', '#F0F8FF', '#FAEBD7', '#7FFFD4', '#F0FFFF', '#F5F5DC', '#FFE4C4', '#FFEBCD', '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0', '#7FFF00', '#D2691E', '#FF7F50', '#6495ED', '#FFF8DC', '#DC143C', '#00FFFF', '#00008B', '#008B8B', '#B8860B', '#A9A9A9', '#006400', '#BDB76B', '#8B008B', '#556B2F', '#FF8C00', '#9932CC', '#8B0000', '#E9967A', '#8FBC8F', '#483D8B', '#2F4F4F', '#00CED1', '#9400D3', '#FF1493', '#00BFFF', '#696969', '#1E90FF', '#B22222', '#FFFAF0', '#228B22', '#DCDCDC', '#F8F8FF', '#FFD700', '#DAA520', '#ADFF2F', '#F0FFF0', '#FF69B4', '#CD5C5C', '#4B0082', '#FFFFF0', '#F0E68C', '#E6E6FA', '#FFF0F5', '#7CFC00', '#FFFACD', '#ADD8E6', '#F08080', '#E0FFFF', '#FAFAD2', '#D3D3D3', '#90EE90', '#FFB6C1', '#FFA07A', '#20B2AA', '#87CEFA', '#778899', '#B0C4DE', '#FFFFE0', '#32CD32', '#FAF0E6', '#FF00FF', '#66CDAA', '#0000CD', '#BA55D3', '#9370DB', '#3CB371', '#7B68EE', '#00FA9A', '#48D1CC', '#C71585', '#191970', '#F5FFFA', '#FFE4E1', '#FFE4B5', '#FFDEAD', '#FDF5E6', '#6B8E23', '#FF4500', '#DA70D6', '#EEE8AA', '#98FB98', '#AFEEEE', '#DB7093', '#FFEFD5', '#FFDAB9', '#CD853F', '#FFC0CB', '#DDA0DD', '#B0E0E6', '#BC8F8F', '#4169E1', '#8B4513', '#FA8072', '#F4A460', '#2E8B57', '#FFF5EE', '#A0522D', '#87CEEB', '#6A5ACD', '#708090', '#FFFAFA', '#00FF7F', '#4682B4', '#D2B48C', '#D8BFD8', '#FF6347', '#40E0D0', '#EE82EE', '#F5DEB3', '#F5F5F5', '#9ACD32']
    },
    buildChart: function (chartConfig, store) {
        //Becuase of extjs differences on how array and json stores keep track of totals both have to be checked

        if (store.data.length > 0) {
            var me = this;

            return {
                xtype: chartConfig.type,
                width: '100%',
                height: 300,
                store: store
            };
        } else {
            //TODO: move this inline create to sperate file under the dashboard charts view
            return {
                xtype: 'container',
                border: false,
                itemId: chartConfig.chartid,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [{
                    border: false,
                    html: '<b>No data available</b>'
                }]
            };
        }
    },
    createPortlet: function (chart, type, title, lastActiveChartId) {
        var tools = (type !== 'Connected')
            ? [ { type: 'pin', hidden: chart.itemId === lastActiveChartId ? false : true, tooltip: 'Currently Active' }, { type: 'unpin', hidden: true, tooltip: 'Currently Inactive, click to make this dashboard active' } ]
            : [ ];

        var c = {
            viewTemplate: {
                title: title,
                layout: 'fit',
                items: [chart],
                closable: false
            }
        };

        return c;
    },

    buildFacetFieldStore: function (data, field) {
        var recs = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i][1] > 0) {
                recs.push({
                    label: data[i][0],
                    count: data[i][1],
                    color: data[i][1],
                    legend: Ext.String.format('{0}:{1}', data[i][1], data[i][0]),
                    range: Ext.String.format('[{0} TO {0}]', data[i][0])
                });
            }
        }

        return {
            type: 'json',
            fields: ['label', 'count', 'legend', 'range', 'color'],
            data: recs
        };
    },
    buildFacetQueryStore: function (data, chartId, seriesData) {
        // OUCH!  This is some ugly code and needs to be refactored at first opportunity.
        // the facet_query coming back from solr is in non-standard format, not an array, not an object.
        // example:
        //      facet_queries: {
        //            {!group=CRD label="Past Due"}CRD:[2012-04-01T00:00:00Z TO 2012-04-19T23:59:00Z]: 417,
        //            {!group=CRD label="Today"}CRD:[2012-04-20T00:00:00Z TO 2012-04-20T23:59:00Z]: 7,
        //            {!group=CRD label="Today plus 1"}CRD:[2012-04-21T00:00:00Z TO 2012-04-21T23:59:00Z]: 0,
        //            {!group=CRD label="Today plus 2"}CRD:[2012-04-22T00:00:00Z TO 2012-04-23T23:59:00Z]: 44,
        //            {!group=CRD label="And Beyond"}CRD:[2012-04-24T00:00:00Z TO 2012-04-30T23:59:00Z]: 90
        //      }

        var recs = [],
            chartid = chartId;

        var countValues = Ext.Object.getValues(data);

        Ext.Array.each(seriesData, function (item, index, allItems) {

            var value = countValues[index];

            if (value > 0) {
                //if (chartid === item.group) {

                recs.push({
                    label: item.label,
                    count: value,
                    color: item.color,
                    legend: Ext.String.format('{0}:{1}', item.label, value),
                    range: decodeURIComponent(item.criteria)
                });
                //}
            }


        });

        Ext.define('store.' + chartId, {
            extend: 'Ext.data.JsonStore',
            fields: ['label', 'count', 'legend', 'range', 'color'],
            alias: 'store.' + chartId,
            data: (recs) ? recs : [] //Insure undefined doesnt get passed to store
        });

        return Ext.create('store.' + chartId);
    },

    collapseDashboardCriteriaContainer: function (comp) {
        comp.setTitle('Advanced Search');
    },
    expandDashboardCriteriaContainer: function (comp) {
        comp.setTitle('');
    }
});