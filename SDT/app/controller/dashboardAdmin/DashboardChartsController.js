Ext.define('SDT.controller.dashboardAdmin.DashboardChartsController', {
    extend: 'Ext.app.Controller',
    uses: [
        'SDT.util.DateUtils'
    ],
    views: [
        'dashboardAdmin.cards.Charts',
        'dashboardAdmin.forms.AddEditChartForm',
        'dashboardAdmin.grids.ChartsGrid',
        'SDT.view.dashboardAdmin.grids.ChartUserCriteriaGrid'
    ],
    models: [
        'dashboardAdmin.ChartModel'
    ],
    stores: [
        'dashboardAdmin.ChartStore',
        'dashboardAdmin.FieldStore',
        'dashboard.DashboardChartsStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'charts': {
                show: me.loadChartsGrid
            },
            'dashboardWizardPanel chartsGrid button#addChart': {
                click: me.showCreateConnectedChartForm
            },
            'dashboardWizardPanel chartsGrid': {
                select: me.previewChart
            },
            'dashboardWizardPanel chartsActions': {
                editItem: me.chartConnectedEditItem
            },
            'addEditChartForm button#applyBtn': {
                click: me.applyChartItem
            },
            'form[type="Add"] field[name="chartid"]': {
                afterrender: me.createChartId
            },
            'addEditChartForm field[name="dataSource"], addEditChartForm field[name="fieldName"]': {
                change: me.updateQueryOrField
            },
            'charts field[name="facet"]': {
                afterrender: me.bindChartDataChangedEvent
            }
        });
    },
    refs: [{
        ref: 'charts',
        selector: 'charts'
    }, {
        ref: 'chartUserCriteriaGrid',
        selector: 'chartUserCriteriaGrid'
    }, {
        ref: 'filtersPreviewGrid',
        selector: 'filtersPreviewGrid'
    }, {
        ref: 'chartsGrid',
        selector: 'chartsGrid'
    }],

    createChartId: function (field) {
        field.setValue(new Ext.data.identifier.Uuid().generate());
    },

    updateQuery: function (field, newValue, oldValue) {
        var seriesGrid = field.up('form').down('seriesGrid'),
            store = seriesGrid.getStore();

        if (!Ext.isEmpty(oldValue) && newValue !== oldValue) {
            store.fireEvent('datachanged', store); //Update the query to get new group information from field name change
        }
    },

    updateQueryOrField: function (field, newValue, oldValue) {
        var form = field.up('form').getForm(),
            dataSource = form.findField('dataSource');

        //Update the facet field or facet query if one of the required fields changes
        this.toggleFieldTypeChart(dataSource);
    },
    toggleFieldTypeChart: function (combo) {
        var formPanel = combo.up('form'),
            grid = formPanel.down('seriesGrid'),
            form = formPanel.getForm(),
            fieldName = form.findField('fieldName'),
            facetField = form.findField('facetField'),
            facetQuery = form.findField('facetQuery');

        if (combo.getValue() === 'FacetField') {
            grid.hide();
            fieldName.allowBlank = false;
            fieldName.show();
            facetQuery.setRawValue('');
            grid.getStore().removeAll();
            this.buildFacetField(form, facetField);

        } else if (combo.getValue() === 'FacetQuery') {
            grid.show();
            fieldName.allowBlank = true;
            fieldName.hide();
            grid.fireEvent('show', grid);
            fieldName.clearValue();
            facetField.setRawValue('');
        }
    },

    buildFacetField: function (form, facetField) {
        var fieldName = form.findField('fieldName'),
            value = Ext.valueFrom(fieldName.getValue(), '');

        facetField.setValue(value);
    },

    previewChart: function (rowModel, record, index, eOpts) {

        var me = this,
            callbackFn,
            field = record.get('fieldName'),
            chartid = record.get('chartid'),
            chartParams = {},
            grid = me.getChartsGrid(),
            previewChartStore = Ext.create('SDT.store.dashboard.DashboardChartsStore'),
            previewChartProxy = previewChartStore.getProxy();

        callbackFn = function (records) {
            //if (operation.success) {

                var dashboardController = me.application.getController('SDT.controller.dashboard.DashboardController'),
                    chartid = record.get('chartid'),
                    chartConfig = { type: record.get('type'), chartid: chartid, seriesData: record.get('seriesData') },
                    dataSource = record.get('dataSource'),
                    field = record.get('fieldName'),
                    title = record.get('title'),
                    chart,
                    store = dataSource === 'FacetQuery' ? dashboardController.buildFacetQueryStore(this.first().get('facet_queries'), chartid) : dashboardController.buildFacetFieldStore(this.first().get('facet_fields')[field], field),
                    panel;

                chart = dashboardController.buildChart(chartConfig, store);
                chart.title = title;

                console.log(chart);

                panel = grid.up('charts');

                //panel.removeA();
                panel.insert(1, chart);
                //panel.show();
                
            //}
        };

        var dataIndex;

        if (Ext.isEmpty(record.get('dataIndex'))) {
            dataIndex = Ext.ComponentQuery.query('#dataIndex')[0].lastSelectedRecords[0].get('baseUrl');
        } else {
            dataIndex = record.get('dataIndex');
        }

        if (Ext.isEmpty(record.get('query'))) {
            chartParams.q = '*:*';
            chartParams.facet = true;
            chartParams['facet.missing'] = true;
            chartParams['json.nl'] = 'arrarr';
            chartParams.rows = 0;
            chartParams['facet.query'] = record.get('facetQuery');
            chartParams['facet.field'] = record.get('facetField');
        } else {
            var query = record.get('query');
            debugger;
            chartParams.chartid = chartid;
            chartParams.criteria = query.criteria;
            chartParams.filters = query.filters;
            chartParams.sorting = query.sorting;
            chartParams.facet = query.facet;
            chartParams.criteriaGrouping = query.criteriaGrouping;
            chartParams.filterGroupingType = query.filterGroupingType;
        }

        previewChartProxy.setParamsAsJson(chartParams);

        previewChartProxy.setReader({
            type: 'json',
            rootProperty: 'facet_counts'
        });

        previewChartProxy.url = 'http://localhost:8983/solr/cats/select';
        //previewChartProxy.extraParams = chartParams;

        previewChartStore.load({
            callback: callbackFn
        });
    },

    loadFiltersPreviewGrid: function (rowModel, record, index, eOpts) {
        var me = this,
            records,
            filtersPreviewGrid = me.getFiltersPreviewGrid(),
            store = filtersPreviewGrid.getStore();

        if (filtersPreviewGrid) {
            store.removeAll();
            filtersPreviewGrid.show();
            records = record.get('baseCriteria');
            if (records) {
                store.loadData(records);
            }
        }
    },
    
    bindChartDataChangedEvent: function (field) {
        var me = this,
            form = field.up('form'),
            charts = form.getForm().findField('charts'),
            facet = form.getForm().findField('facet'),
            store = me.getDashboardAdminChartStoreStore(),
            facets,
            data,
            facetField,
            chartArray;

        store.on('datachanged', function () {
            chartArray = [];
            facets = [];
            facetQuery = [];
            facetField = [];
            store.each(function (record, index, len) {
                data = record.getData();

                //Remove id field we are using chartId as id field configured on model with idProperty using a sequitial idgen id generator, extjs appear to setting even when we are setting it correctly
                data.id = null;
                delete data.id;

                Ext.Array.include(facets, data.facetField);
                Ext.Array.include(facets, data.facetQuery);

                Ext.Array.include(chartArray, data);
            });

            field.setValue(facetQuery.join('') + facetField.join(''));
            facet.setValue(facets.join(''));

            
            charts.setValue(JSON.stringify(chartArray, null, 4));
        });
    },
    updateChartQueryField: function (button) {
        var query = {},
            queryField,
            chartFormPanel = button.up('addEditchartForm'),
            chartForm = chartFormPanel.getForm();

        queryField = chartForm.findField('query');
        query.criteria = chartForm.findField('criteria').getValue();
        query.criteriaGrouping = chartForm.findField('criteriaGrouping').getValue();
        query.filterGroupingType = chartForm.findField('filterGroupingType').getValue();
        query.facet = chartForm.findField('facetField').getValue() + chartForm.findField('facetQuery').getValue();
        query.filters = chartForm.findField('filters').getValue();
        query.sorting = chartForm.findField('sorting').getValue();
        queryField.setValue(JSON.stringify(query, null, 4));
    },
    applyChartItem: function (btn) {
        var me = this,
            grid = me.getCharts().down('grid'),
            formPanel = btn.up('form'),
            form = formPanel.getForm(),
            foundRecord,
            store,
            formValues,
            chart;

        if (form.isValid()) {

            store = me.getDashboardAdminChartStoreStore();
            formValues = form.getValues();

            formValues.seriesData = Ext.isEmpty(formValues.seriesData) ? '' : Ext.decode(formValues.seriesData);
            formValues.title = Ext.String.trim(formValues.title);

            chart = Ext.create('SDT.model.dashboardAdmin.ChartModel', formValues);

            if (formPanel.type === 'Add') {
                chart.phantom = true;
                store.add(chart);
                form.reset();
                formPanel.down('field[hidden="false"]').focus(true, 10); //Reset field focus to first visible field in form
            } else {
                foundRecord = form.getRecord();
                foundRecord = store.getById(foundRecord.id);
                foundRecord.beginEdit();
                foundRecord.set(chart.getData()); //Replace old values with new
                foundRecord.endEdit();
                foundRecord.commit();
                store.sync(); //Sync is technically suppose to fire the datachange event on store but appears to be broken in framework
                store.fireEvent('datachanged', store);
                formPanel.close();
            }
            grid.getSelectionModel().select(chart);

        } else {
            Ext.Msg.alert('', 'Please ensure all required fields are populated.');
        }
    },
    chartConnectedEditItem: function (column, record, eventName, actionItem, grid) {
        var formPanel = Ext.create('SDT.view.dashboardAdmin.forms.AddEditChartForm', { type: 'Edit' }),
            rec = record.copy(record.data.chartid), // clone the record to avoid altering orignal
            seriesData = rec.getData().seriesData,
            form = formPanel.getForm();

        seriesData = Ext.encode(JSON.stringify(seriesData, null, 4));
        rec.set('seriesData', seriesData); //Encode to allow loading in form field

        formPanel.on('beforerender', function () {
            form.loadRecord(rec);
            form.fireEvent('dirtychange', form, false); //Fire dirtychange event to notify series when to load data on edit
        }, this, { single: true });

        formPanel.show();
    },

    loadChartsGrid: function (card) {
        var me = this,
            store = me.getDashboardAdminChartStoreStore(),
            form = card.getForm(),
            type = card.up('wizard').type;

        if (type === 'Edit') {
            me.loadChartsGridFromField(form, store);
        }
    },

    loadChartsGridFromField: function (form, store) {
        var charts = Ext.decode(form.findField('charts').getValue());
        store.loadData(charts);
    },

    showCreateConnectedChartForm: function (btn) {
        Ext.create('SDT.view.dashboardAdmin.forms.AddEditChartForm', { type: 'Add' }).show();
    }
});