Ext.define('SDT.controller.dashboardAdmin.DashboardChartsController', {
    extend: 'Ext.app.Controller',
    uses: [
        'SDT.util.DateUtils'
    ],
    views: [
        'dashboardAdmin.cards.Charts',
        'dashboardAdmin.forms.AddEditConnectedChartForm',
        'dashboardAdmin.forms.AddEditIndependentChartForm',
        'dashboardAdmin.containers.ChartsContainer',
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
            'dashboardConnectedWizardPanel chartsGrid button[text="Add Chart"]': {
                click: me.showCreateConnectedChartForm
            },
            'dashboardIndependentWizardPanel chartsIndependentGrid button[text="Add Chart"]': {
                click: me.showCreateIndependentChartForm
            },
            'dashboardConnectedWizardPanel chartsGrid, dashboardIndependentWizardPanel chartsGrid': {
                select: me.previewChart
            },
            'dashboardIndependentWizardPanel chartsGrid': {
                select: me.setUserCriteriaGridStore
            },
            'dashboardConnectedWizardPanel chartsActions': {
                editItem: me.chartConnectedEditItem
            },
            'dashboardIndependentWizardPanel chartsActions': {
                editItem: me.chartIndependentEditItem
            },
            'addEditConnectedChartForm button#applyBtn': {
                click: me.applyChartItem
            },
            'addEditIndependentChartForm button#applyBtn': {
                click: me.applyIndependentChartItem
            },
            'form[type="Add"] field[name="chartid"]': {
                afterrender: me.createChartId
            },
            'addEditConnectedChartForm field[name="dataSource"], addEditConnectedChartForm field[name="fieldName"], addEditIndependentChartVieForm field[name="dataSource"], addEditIndependentChartForm field[name="fieldName"]': {
                change: me.updateQueryOrField
            },
            'charts > chartsContainer field[name="facet"]': {
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

                panel = grid.up('chartsContainer').down('#chartContainer').down('#chartPreview');

                panel.setTitle(title);
                panel.removeAll();
                panel.add(chart);
                panel.show();
                
            //}
        };

        var dataIndex;

        if (Ext.isEmpty(record.get('dataIndex'))) {
            dataIndex = Ext.ComponentQuery.query('#dataIndex')[0].getValue();
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
            chartParams.chartid = chartid;
            chartParams.criteria = query.criteria;
            chartParams.filters = query.filters;
            chartParams.sorting = query.sorting;
            chartParams.facet = query.facet;
            chartParams.criteriaGrouping = query.criteriaGrouping;
            chartParams.filterGroupingType = query.filterGroupingType;
        }

        previewChartProxy.setReader({
            type: 'array',
            rootProperty: Ext.String.format('facet_counts.facet_fields.{0}', field)
        });

        previewChartProxy.url = 'http://localhost:8983/solr/cats/select';
        previewChartProxy.extraParams = chartParams;

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

    setUserCriteriaGridStore: function (rowModel, record, index, eOpts) {
        var me = this,
            records,
            userCriteriaGrid = me.getChartUserCriteriaGrid(),
            store = userCriteriaGrid.getStore();

        if (userCriteriaGrid) {
            store.removeAll();
            userCriteriaGrid.show();
            records = record.get('userCriteriaFields');
            if (records) {
                store.loadData(records);
            }
        }

        me.loadFiltersPreviewGrid(rowModel, record, index, eOpts);

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

                facets.push(data.facetField);
                facets.push(data.facetQuery);

                Ext.Array.include(chartArray, Ext.encode(data));
            });

            field.setValue(facetQuery.join('') + facetField.join(''));
            facet.setValue(facets.join(''));
            charts.setValue('[' + chartArray.join(',') + ']');
        });
    },

    applyIndependentChartItem: function (btn) {
        var me = this,
            grid = me.getCharts().down('grid'),
            formPanel = btn.up('form'),
            form = formPanel.getForm(),
            foundRecord,
            store,
            formValues,
            chart;
        me.updateChartQueryField(btn);
        if (form.isValid()) {

            store = me.getDashboardAdminChartStoreStore();
            formValues = form.getValues();

            formValues.seriesData = Ext.isEmpty(formValues.seriesData) ? '' : Ext.decode(formValues.seriesData);
            formValues.baseCriteria = Ext.isEmpty(formValues.baseCriteria) ? [] : Ext.decode(formValues.baseCriteria);
            formValues.query = Ext.isEmpty(formValues.query) ? '' : Ext.decode(formValues.query);
            formValues.resultsPanel = Ext.isEmpty(formValues.resultsPanel) ? {} : Ext.decode(formValues.resultsPanel);
            formValues.userCriteriaFields = Ext.isEmpty(formValues.userCriteriaFields) ? [] : Ext.decode(formValues.userCriteriaFields);

            formValues.title = Ext.String.trim(formValues.title);

            chart = Ext.create('SDT.model.dashboardAdmin.ChartModel', formValues);

            if (formPanel.type === 'Add') {
                chart.phantom = true;
                store.add(chart);

                form.reset();
                formPanel.down('tabpanel').getLayout().setActiveItem(0); //Reset tab focus to first tab

                //Remove data from grids

                formPanel.down('filtersGrid').getStore().removeAll();
                formPanel.down('seriesGrid').getStore().removeAll();
                formPanel.down('userCriteriaGrid').getStore().removeAll();

                formPanel.down('previewGrid').getStore().removeAll();

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
    updateChartQueryField: function (button) {
        var query = {},
            queryField,
            independentChartFormPanel = button.up('addEditIndependentChartForm'),
            independentChartForm = independentChartFormPanel.getForm();

        queryField = independentChartForm.findField('query');
        query.criteria = independentChartForm.findField('criteria').getValue();
        query.criteriaGrouping = independentChartForm.findField('criteriaGrouping').getValue();
        query.filterGroupingType = independentChartForm.findField('filterGroupingType').getValue();
        query.facet = independentChartForm.findField('facetField').getValue() + independentChartForm.findField('facetQuery').getValue();
        query.filters = independentChartForm.findField('filters').getValue();
        query.sorting = independentChartForm.findField('sorting').getValue();
        queryField.setValue(Ext.encode(query));
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
        var formPanel = Ext.create('SDT.view.dashboardAdmin.forms.AddEditConnectedChartForm', { type: 'Edit' }),
            rec = record.copy(record.data.chartid), // clone the record to avoid altering orignal
            seriesData = rec.getData().seriesData,
            form = formPanel.getForm();

        //TODO: Remove this code when all rangeCriteria and rangeData have been removed from legacy dashboards
        Ext.Array.each(seriesData, function (series) {
            if (Ext.isEmpty(series.seriesCriteria)) {
                series.seriesCriteria = series.rangeCriteria;
                series.rangeCriteria = null;
                delete series.rangeCriteria;
            }
        });

        seriesData = Ext.encode(seriesData);

        rec.set('seriesData', seriesData); //Encode to allow loading in form field

        formPanel.on('beforerender', function () {
            form.loadRecord(rec);
            form.fireEvent('dirtychange', form, false); //Fire dirtychange event to notify series when to load data on edit
        }, this, { single: true });

        formPanel.show();
    },

    chartIndependentEditItem: function (column, record, eventName, actionItem, grid) {
        var formPanel = Ext.widget('addEditIndependentChartForm', { type: 'Edit' }),
            rec = record.copy(record.data.chartid), // clone the record to avoid altering orignal
            seriesData = rec.getData().seriesData,
            baseCriteria = rec.getData().baseCriteria,
            resultsPanel = rec.getData().resultsPanel,
            query = rec.getData().query,
            userCriteriaFields = rec.getData().userCriteriaFields,
            form = formPanel.getForm();
        //TODO: Remove this code when all rangeCriteria and rangeData have been removed from legacy dashboards
        Ext.Array.each(seriesData, function (series) {
            if (Ext.isEmpty(series.seriesCriteria)) {
                series.seriesCriteria = series.rangeCriteria;
                series.rangeCriteria = null;
                delete series.rangeCriteria;
            }
        });
        seriesData = Ext.encode(seriesData);
        query = Ext.encode(query);
        baseCriteria = Ext.encode(baseCriteria);
        resultsPanel = Ext.encode(resultsPanel);
        userCriteriaFields = Ext.encode(userCriteriaFields);
        rec.set('seriesData', seriesData); //Encode to allow loading in form field
        rec.set('query', query);
        rec.set('baseCriteria', baseCriteria); //Encode to allow loading in form field
        rec.set('resultsPanel', resultsPanel); //Encode to allow loading in form field
        rec.set('userCriteriaFields', userCriteriaFields); //Encode to allow loading in form field
        view.on('beforerender', function () {
            var store = this.getDashboardAdminFieldStoreStore();
            store.on('load', function () {
                form.loadRecord(rec);
                form.fireEvent('dirtychange', form, false); //Fire dirtychange event to notify series when to load data on edit
            }, this, { single: true });
            view.down("#filterGroupingType").setValue(Ext.decode(query).filterGroupingType);
            view.down("#criteriaGrouping").setValue(Ext.decode(query).criteriaGrouping);
        }, this, { single: true });

        view.show();
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
        Ext.create('SDT.view.dashboardAdmin.forms.AddEditConnectedChartForm', { type: 'Add' }).show();
    },

    showCreateIndependentChartForm: function (btn) {
        Ext.create('SDT.view.dashboardAdmin.forms.AddEditIndependentChartForm', { type: 'Add' }).show();
    }
});