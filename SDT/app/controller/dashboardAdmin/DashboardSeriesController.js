Ext.define('SDT.controller.dashboardAdmin.DashboardSeriesController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.forms.AddEditSeriesForm',
        'dashboardAdmin.grids.SeriesGrid'
    ],
    models: [
        'dashboardAdmin.SeriesModel'
    ],
    stores: [
        'dashboardAdmin.SeriesStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'seriesGrid button#addSeries': {
                click: me.showSeriesForm
            },
            'seriesActions': {
                editItem: me.seriesEditItem
            },
            'addEditSeriesForm #applyBtn': {
                click: me.applySeriesItem
            },
            'addEditChartForm[type="Edit"] seriesGrid': {
                show: me.loadSeriesConnectedGrid
            },
            'addEditChartView > addEditChartForm': {
                afterrender: me.bindSeriesDataChangedEvent
            },
            'addEditChartForm': {
                afterrender: me.bindSeriesDataChangedEvent
            }
        });
    },
    refs: [],

    buildFilterFromcriteriaGrouping: function (criteriaGroupingString, conditionList) {
        var parts = Ext.String.splitWords(criteriaGroupingString);
        Ext.Array.each(conditionList, function (value, index) {
            Ext.Array.each(parts, function (partValue, partIndex, allParts) {
                if (value.condition.toString() === partValue) {
                    allParts[partIndex] = value.criteria;
                } else if ('(' + value.condition.toString() === partValue) {
                    allParts[partIndex] = '(' + value.criteria;
                } else if (value.condition.toString() + ')' === partValue) {
                    allParts[partIndex] = value.criteria + ')';
                }
            });
        });

        return parts.join(encodeURIComponent(' '));
    },

    toggleFilterGroupingVisibility: function (store, fieldset) {
        if (store.getCount() > 1) {
            fieldset.setVisible(true);
        } else {
            fieldset.setVisible(false);
        }
    },

    bindSeriesDataChangedEvent: function (formPanel) {
        var me = this,
            store = me.getDashboardAdminSeriesStoreStore(),
            data,
            facetQueryArray,
            facetQueryValue,
            seriesDataArray,
            seriesObj,
            form = formPanel.getForm(),
            facetQuery = form.findField('facetQuery'),
            seriesData = form.findField('seriesData'),
            seriesGrid = formPanel.down('seriesGrid');

        store.on('datachanged', function () {
            facetQueryArray = [];
            seriesDataArray = [];

            store.each(function (record, index, len) {
                data = record.getData();

                facetQueryValue = Ext.String.format('&facet.query={!group={0} label={1}}{2}', data.group, encodeURIComponent(Ext.String.format('"{0}"', data.label)), data.criteria);
                facetQueryArray.push(facetQueryValue);

                seriesObj = {};

                seriesObj.color = data.color;
                seriesObj.criteria = data.criteria;
                seriesObj.criteriaGrouping = data.criteriaGrouping;
                seriesObj.filterGroupingType = data.filterGroupingType;
                seriesObj.facetQuery = facetQueryValue;
                seriesObj.group = data.group;
                seriesObj.label = data.label;
                seriesObj.seriesCriteria = (Ext.isEmpty(data.seriesCriteria)) ? data.rangeCriteria : data.seriesCriteria;

                //record.set('group', group);
                record.set('facetQuery', facetQueryValue);

                seriesDataArray.push(seriesObj);
            });
            seriesData.setValue(JSON.stringify(seriesDataArray, null, 4));
            facetQuery.setValue(facetQueryArray.join(''));
            seriesGrid.validate();
        });
    },

    applySeriesItem: function (btn) {
        var store = btn.up('form').store,
            formPanel = btn.up('form'),
            form = formPanel.getForm(),
            filter,
            formValues;

        if (form.isValid()) {

            formValues = form.getValues();

            formValues.seriesCriteria = (Ext.isEmpty(formValues.seriesCriteria)) ? [] : Ext.decode(formValues.seriesCriteria);
            formValues.label = Ext.String.trim(formValues.label);
            formValues.criteria = this.buildFilterFromcriteriaGrouping(formValues.criteriaGrouping, formValues.seriesCriteria);

            filter = Ext.create('SDT.model.dashboardAdmin.SeriesModel', formValues);

            if (formPanel.type === 'Add') {
                filter.phantom = true;
                store.add(filter);
                form.reset();
                formPanel.down('filtersGrid').getStore().removeAll(); //Reset series grid
                formPanel.down('field[hidden="false"]').focus(true, 10); //Reset field focus to first visible field in form
            } else {
                foundRecord = form.getRecord();
                foundRecord = store.getById(foundRecord.id);
                foundRecord.beginEdit();
                foundRecord.set(filter.getData()); //Replace old values with new
                foundRecord.endEdit();
                foundRecord.commit();
                store.sync(); //Sync is technically suppose to fire the datachange event on store but appears to be broken in framework
                store.fireEvent('datachanged', store);
                formPanel.close();
            }
        } else {
            Ext.Msg.alert('', 'Please ensure all required fields are populated.');
        }
    },

    loadSeriesGridFromField: function (fieldValue, store) {
        var filters = Ext.decode(fieldValue);
        store.loadData(filters);
    },
    loadSeriesConnectedGrid: function (grid) {
        var me = this,
            field = grid.up('form').getForm().findField('seriesData'),
            store = grid.getStore();

        field.on('change', function (field, newValue, oldValue) {
            me.loadSeriesGridFromField(newValue, store);
        }, me, { single: true });
    },

    loadFiltersGridFromField: function (field, store) {
        var filters = Ext.decode(field.getValue());

        Ext.Array.each(filters, function (item) {
            item.criteria = decodeURIComponent(item.criteria);
        });

        store.loadData(filters);
    },

    seriesEditItem: function (column, record, eventName, actionItem, grid) {
        var me = this,
            store = grid.getStore(),
            formPanel = Ext.create('SDT.view.dashboardAdmin.forms.AddEditSeriesForm', { filterType: 'Series', store: store, type: 'Edit' }),
            rec = record.copy(record.id), // clone the record to avoid altering orignal
            seriesCriteria = rec.getData().seriesCriteria,
            form = formPanel.getForm(),
            filterGroupingFieldset,
            filtersStore,
            seriesCriteriaField;

        rec.set('rangeCriteria', Ext.encode(seriesCriteria)); //Encode to allow loading in form field
        rec.set('seriesCriteria', Ext.encode(seriesCriteria)); //Encode to allow loading in form field

        formPanel.on('beforerender', function () {
            form.loadRecord(rec);
            seriesCriteriaField = form.findField('seriesCriteria');
            filtersStore = formPanel.down('filtersGrid').getStore();
            filterGroupingFieldset = formPanel.down('fieldset');
            me.loadFiltersGridFromField(seriesCriteriaField, filtersStore);
            me.toggleFilterGroupingVisibility(filtersStore, filterGroupingFieldset);
        }, me, { single: true });

        formPanel.show();
    },

    showSeriesForm: function (btn) {
        var me = this,
            store = btn.up('grid').getStore(),
            formPanel = Ext.create('SDT.view.dashboardAdmin.forms.AddEditSeriesForm', { filterType: 'Series', type: 'Add', store: store }),
            chartid = btn.up('form').getForm().findField('chartid'),
            group = formPanel.getForm().findField('group');

        formPanel.on('beforerender', function () {
            group.originalValue = chartid.getValue();
            group.setValue(chartid.getValue());
        }, me, { single: true });

        formPanel.show();
    }
});