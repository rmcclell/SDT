Ext.define('SDT.controller.dashboard.DashboardController', {
    extend: 'Ext.app.Controller',
    uses: [
        'SDT.util.DateUtils'
    ],
    requires: [
        'Ext.chart',
        'Ext.chart.PolarChart',
        'Ext.chart.theme.Muted'
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
        'menuManagement.MenuTreeNodeModel',
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
        'menuManagement.MenuTreeStore',
        'dashboard.DashboardConfigStore',
        'dashboard.DashboardCriteriaFilterStore',
        'dashboard.DashboardListsStore',
        'dashboard.DashboardDefaultStore',
        'dashboard.DashboardChartsStore',
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
            },
            'panel[type="Independent"] tool[type="unpin"]': {
                click: me.activateChart
            },
            'panel[type="Independent"]': {
                activate: me.toogleActiveChart
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

    activateChart: function (tool) {
        var panel = tool.up('panel'),
            disableComps,
            contentComp = panel.down('chart, panel');

        panel.fireEvent('activate', panel);
    },

    toogleActiveChart: function (panel) {

        var me = this,
            chartid = panel.itemId.slice(0, panel.itemId.indexOf('-panel'));

        //Update last active chart
        Ext.state.Manager.set(Ext.String.format('activeChart-{0}', me.currentDashboardId), chartid);
        me.reloadActiveChartData();

    },

    reloadActiveChartData: function () {

        var me = this,
            dashboardConfigStore = me.getDashboardDashboardConfigStoreStore(),
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
            menuStore = me.getMenuManagementMenuTreeStoreStore(),
            defaultDashboardStore = me.getDashboardDashboardDefaultStoreStore();

        me.initMenuStore(menuStore);
        me.initDefaultDashboardStore(defaultDashboardStore);
    },

    initMenuStore: function (store) {
        var me = this,
            startingNode,
            btnMenu,
            callbackFn;

        me.bindMenuChanged(store);



        callbackFn = function (records, operation, success) {
            if (success && records.length > 0) {
                startingNode = store.getNodeById('a8de99a0-1b59-4df5-992d-13048917c93b'); //Select Dashboard tree item by id, done to allow future menu changes
                btnMenu = Ext.ComponentQuery.query('#dashboardsListBtn')[0].menu; //Dashboard menu button could reuse for other menu buttons in future
                me.buildDashboardMenu(store, startingNode, btnMenu);
            } else {
                Ext.Msg.alert('Dashboards Menu Error', 'Sorry, the dashboard menu configuration could not be loaded. No dashboard menu configurations were found.');
            }
        };

        store.load({ callback: callbackFn });
    },

    initDefaultDashboardStore: function (store) {
        callbackFn = function (records, operation, success) {
            if (!success || records.length === 0) {
                Ext.Msg.alert('Dashboards Default Error', 'Sorry, the set default dashboard could not be loaded. No default dashboard was found.');
            }
        };
        store.load({ callback: callbackFn });
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

    bindMenuChanged: function (store) {
        var me = this,
            btnMenu,
            startingNode;

        store.on('datachanged', function () {
            startingNode = store.getNodeById('a8de99a0-1b59-4df5-992d-13048917c93b'); //Select Dashboard tree item by id, done to allow future menu changes
            btnMenu = Ext.ComponentQuery.query('#dashboardsListBtn')[0].menu; //Dashboard menu button could reuse for other menu buttons in future
            me.buildDashboardMenu(store, startingNode, btnMenu);
        });
    },

    buildGridColumns: function (records, grid) {
        var me = this, columns = [];

        Ext.Array.each(records, function (record) {
            var obj = {};
            record = record.getData();

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

    getDefaultColumns: function (dashboardConfigStore) {

        var me = this,
            records,
            store = Ext.data.StoreManager.lookup('settingManager.SolrIndexesStore'),
            grid = Ext.ComponentQuery.query('dashboardRowResultsGrid')[0];

        store.on('datachanged', function () {
            var foundRecord = store.findRecord('name', 'Cats');
            records = foundRecord.solrFields().getRange();
            me.buildGridColumns(records, grid);
        }, me, { single: true });

        Ext.Ajax.request({
            url: '/data/mock/settingManager/SolrIndexes.json',
            success: function (response) {
                var data = Ext.decode(response.responseText);
                //Ext.state.Manager.set('solrIndexes', data);
                store.loadRawData(data);
            }
        });
    },

    refreshDashboard: function () {
        var me = this,
            callbackFn,
            criteriaPanel = me.getDashboardCriteriaPanel(),
            dashboardConfigStore = me.getDashboardDashboardConfigStoreStore();

        //callbackFn = function (records, operation, success) {
        //    if (success && records.length > 0) {
        //        me.loadDashboardConfigComps(criteriaPanel, dashboardConfigStore);
        //    }
        //};

        //dashboardConfigStore.load({ callback: callbackFn });
    },

    initDashboardConfigStore: function (store, filterParams) {
        var me = this,
            dashboardDefaultStore = me.getDashboardDashboardDefaultStoreStore(),
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

                            foundRecord = dashboardDefaultStore.first();

                            if (foundRecord) {
                                me.currentDashboardId = foundRecord.getData().id; //Set the default as current dashboard
                            }

                            dashboardConfigStore.getProxy().extraParams = { dashboardId: me.currentDashboardId, chartid: me.getLastActiveChartId() };
                            dashboardConfigStore.load({ callback: callbackFn });
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
            dashboardConfigStore = me.getDashboardDashboardConfigStoreStore();

        me.currentDashboardId = (!Ext.isEmpty(Ext.state.Manager.get('lastDashboardId'))) ?
            Ext.state.Manager.get('lastDashboardId') : Ext.state.Manager.get('defaultDashboardId'); //Set the default dashboard as current dashboard

        me.initDashboardConfigStore(dashboardConfigStore, { dashboardId: me.currentDashboardId, chartid: me.getLastActiveChartId() });

    },
    buildDashboardMenu: function (store, startingNode, btnMenu) {
        var menuObj,
            selectNodes,
            currentMenu = btnMenu;

        Ext.suspendLayouts();

        btnMenu.removeAll();

        selectNodes = function (node) {
            if (node) {
                if (node.data.parentId !== 'root') {

                    menuObj = {
                        text: node.data.text,
                        tooltip: node.data.qtip,
                        glyph: 0xf1ea
                    };

                    if (!node.isLeaf() && node.hasChildNodes()) { //Folder must contain children to be shown
                        menuObj.menu = { items: [] };
                        currentMenu = currentMenu.add(menuObj).menu; //Go deeper in menu structure
                    } else if (!node.isLeaf() && !node.hasChildNodes()) {
                        menuObj.menu = { items: [{ text: 'No Dashboards or Links Available', tooltip: 'Links or Dashboards may be added through "Dashboard Menu Management".' }] };
                        currentMenu.add(menuObj); //Create button to indicate empty folder and don't go deeper
                    } else {
                        //Define common props same whether link or dashboard type

                        if (node.data.iconCls === 'x-icon icon-server_chart') { //Dashboard
                            menuObj.dashboardId = node.data.dashboardId;
                        } else { //Link
                            menuObj.href = node.data.href;
                            menuObj.hrefTarget = '_blank';
                        }
                        currentMenu.add(menuObj);

                        if (node.isLast()) {
                            currentMenu = (currentMenu && currentMenu.ownerItem && currentMenu.ownerItem.parentMenu) ? currentMenu.ownerItem.parentMenu : currentMenu; //Go back up to parrent when you reach last node
                        }
                    }
                }

                node.eachChild(function (n) {
                    selectNodes(n);
                });

            }
        };

        selectNodes(startingNode);
        Ext.resumeLayouts(true);

    },

    loadDashboard: function (queries, chartConfig, chartInfo, resultsPanelConfig, dashboardConfig, dataIndex, activeQuery) {
        var me = this,
            dashboardStore = me.getDashboardDashboardChartsStoreStore(),
            proxy = dashboardStore.getProxy(),
            dashboardsView = me.getDashboardsView(),
            dashboardChartResultsContainer = dashboardsView.down('dashboardChartResultsContainer'),
            currentContainer = dashboardChartResultsContainer.down('container'),
            callbackFn,
            title;

        //Set dashboard view active before loading tab

        //dashboardsView.getEl().mask('Loading...', 'loadingMask');

        title = Ext.String.format('Dashboards: <span style="cursor:pointer;" data-qtip="{0}">{1}</span>', Ext.String.htmlEncode(me.buildDashboardInfoTpl(chartInfo)), chartInfo.title);

        dashboardsView.setTitle(title);

        callbackFn = function (records, operation, success) {
            if (success) {
                me.loadCriteriaCombos(chartInfo, dashboardConfig);
                me.loadChartData(dashboardStore, queries, chartConfig, chartInfo, resultsPanelConfig, dashboardConfig, activeQuery);
                me.loadResultsPanel(activeQuery, resultsPanelConfig, dashboardConfig);
            }
            //dashboardsView.getEl().unmask();
        };

        //Set sent params both independent and connected charts wrap params as array

        proxy.url = '/data/mock/dashboard/' + Ext.state.Manager.get('defaultDashboardId') + '/DashboardConnectedCharts.json';

        proxy.extraParams = { chartParms: queries };

        dashboardStore.load({
            scope: me,
            callback: callbackFn
        });

    },
    loadChartData: function (data, query, chartConfig, chartInfo, resultsPanelConfig, dashboardConfig, activeQuery) {
        var me = this,
            dashboardsView = me.getDashboardsView(),
            currentContainer = dashboardsView.down('dashboardChartResultsContainer');

        me.loadPanelConfig(chartConfig, currentContainer, data, dashboardConfig, chartInfo);


        //dashboardsView.getEl().unmask();
    },

    loadResultsPanel: function (query, resultsPanelConfig, dashboardConfig) {
        var me = this,
            //grid = Ext.ComponentQuery.query('dashboardRowResultsGrid', currentContainer)[0],
            dashboardsView = me.getDashboardsView(),
            dashboardChartResultsContainer = dashboardsView.down('dashboardChartResultsContainer'),
            currentContainer = dashboardChartResultsContainer.down('container'),
            grid = currentContainer.up().up().down('dashboardRowResultsGrid'),
            activepanel = (dashboardConfig.type !== 'Independent') ? null : Ext.ComponentQuery.query('#' + this.getLastActiveChartId() + '-panel', currentContainer)[0],
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
    loadPanelConfig: function (chartConfig, panel, chartDataStore, dashboardConfig, chartInfo) {
        var me = this,
            records,
            i,
            defaultContentObj = {},
            lastActiveChartId,
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
                data = (chartDataStore.getById(currentChartConifg.chartid)) ? chartDataStore.getById(currentChartConifg.chartid).getData() : { "facet_counts": { "facet_queries": {}, "facet_fields": {}, "facet_dates": {}, "facet_ranges": {} } },
                panel,
                store = (currentChartConifg.dataSource === 'FacetQuery') ?
                    me.buildFacetQueryStore(data.facet_counts.facet_queries, currentChartConifg.chartid, currentChartConifg.seriesData) : me.buildFacetFieldStore(data.facet_counts.facet_fields[currentChartConifg.fieldName], currentChartConifg.fieldName),
                chart;

            //currentChartConifg.controller = 'SDT.controller.dashboard.DashboardController';

            chart = me.buildChart(currentChartConifg, store);

            //console.log(chartInfo);

            //chart.title = currentChartConifg.title;

            if (dashboardConfig.type === 'Independent' && chart.itemId === lastActiveChartId) {
                chart.setDisabled(false);
            } else if (dashboardConfig.type === 'Independent' && chart.itemId !== lastActiveChartId) {
                chart.setDisabled(true);
            }

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

    loadCriteriaCombos: function (chartInfo, dashboardConfig) {

        var me = this,
            dashboardConfigStore = me.getDashboardDashboardConfigStoreStore(),
            dashboardCriteriaPanel = me.getDashboardCriteriaPanel(),
            userCriteriaData = (dashboardConfig.type !== 'Independent') ? dashboardConfig.userCriteriaData : me.getActiveChart(dashboardConfigStore.first()).get('userCriteriaData'),
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
            '<b>Created By:</b> {createdBy}<br>',
            '<b>Created Date:</b> {createDate}<br>',
            '<b>Modified By:</b> {modifiedBy}<br>',
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

        if (firstConfigRecord.get('type') !== 'Independent') {
            dataIndex = firstConfigRecord.get('dataIndex');
            me.getDefaultColumns(firstConfigRecord);
            criteriaPanel.initCriteriaPanel(firstConfigRecord.getData().id, firstConfigRecord.userCriteriaFields().getRange());
            me.loadBaseCriteriaPanel(firstConfigRecord.baseCriteria());
        } else {
            var activeChart = me.getActiveChart(firstConfigRecord);
            dataIndex = activeChart.get('dataIndex');
            me.getDefaultColumns(activeChart);
            criteriaPanel.initCriteriaPanel(firstConfigRecord.getData().id, activeChart.userCriteriaFields().getRange(), activeChart.get('chartid'));
            me.loadBaseCriteriaPanel(activeChart.baseCriteria());
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
            dashboardConfigStore = me.getDashboardDashboardConfigStoreStore();

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
            dashboardConfigStore = me.getDashboardDashboardConfigStoreStore(),
            criteriaFilters = me.getCriteriaFilters(),
            firstConfigRecord,
            activeQuery,
            criteriaPanel = me.getDashboardCriteriaPanel();

        callback = function () {

            firstConfigRecord = me.getCurrentDashboardRecord(dashboardConfigStore);

            if (firstConfigRecord.get('type') !== 'Independent') {

                queries.push(firstConfigRecord.getQuery().getData());

                queries[0].filters = criteriaFilters;

                activeQuery = queries[0];
                activeQuery.dataIndex = firstConfigRecord.get('dataIndex');

                me.loadDashboard(queries, firstConfigRecord.charts(), me.getChartInfo(firstConfigRecord.getData()), firstConfigRecord.getData().resultsPanel, firstConfigRecord.getData(), firstConfigRecord.get('dataIndex'), activeQuery);

            } else {

                var activeChart = me.getActiveChart(firstConfigRecord);

                activeChart.getQuery().set('filters', criteriaFilters);

                activeQuery = activeChart.getQuery();
                activeQuery.set('dataIndex', activeChart.get('dataIndex'));
                activeQuery.set('chartid', activeChart.get('chartid'));

                Ext.Array.each(firstConfigRecord.charts().getRange(), function (chart) {
                    chart.getQuery().set('dataIndex', chart.get('dataIndex'));
                    chart.getQuery().set('chartid', chart.get('chartid'));
                    queries.push(chart.getQuery());
                });

                me.loadDashboard(queries, firstConfigRecord.charts(), me.getChartInfo(firstConfigRecord.getData()), activeChart.getData().resultsPanel, firstConfigRecord.getData(), activeChart.get('dataIndex'), activeQuery);
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

        if (store.getCount() > 0 || store.getTotalCount() > 0) {
            var me = this, containsCustomColor = false, colorMapping = [], chartCreateObject = {};

            chartCreateObject.type = chartConfig.type;

            return { xtype: chartConfig.type, width: 300, heigth: 300, store: { type: chartConfig.chartid } };

            //return Ext.create('SDT.view.dashboard.chart.' + chartConfig.type, chartCreateObject);
        } else {
            //TODO: move this inline create to sperate file under the dashboard charts view
            return Ext.create('Ext.container.Container', {
                border: false,
                //itemId: chartConfig.chartid,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [{
                    border: false,
                    html: '<b>No data available</b>'
                }]
            });
        }
    },
    createPortlet: function (chart, type, title, lastActiveChartId) {
        var tools = [],
            activeTooltip = 'Currently Active',
            inactiveTooltip = 'Currently Inactive, click to make this dashboard active';

        if (type !== 'Connected') {
            if (chart.itemId === lastActiveChartId) {
                tools.push({ type: 'pin', hidden: false, tooltip: activeTooltip });
                tools.push({ type: 'unpin', hidden: true, tooltip: inactiveTooltip });
            } else {
                tools.push({ type: 'pin', hidden: true, tooltip: activeTooltip });
                tools.push({ type: 'unpin', hidden: false, tooltip: inactiveTooltip });
            }
        }
        var c = {
            viewTemplate: {
                title: title,
                layout: 'fit',
                closable: false,
                items: [chart],
                tools: tools
            }
        };

        return c;
    },

    buildFacetFieldStore: function (data, field) {
        return Ext.create('Ext.data.ArrayStore', {
            fields: [
                'label',
                'color',
                { name: 'count', mapping: 1 },
                {
                    name: 'legend', convert: function (v, record) {
                        return Ext.String.format('{0}:{1}', record.data.label, record.data.count);
                    }
                },
                {
                    name: 'range', convert: function (v, record) {
                        return Ext.String.format('{0}:[{1} TO {1}]', field, record.data.label);
                    }
                }
            ],
            data: (data) ? data : [] //Insure undefined doesnt get passed to store
        });
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