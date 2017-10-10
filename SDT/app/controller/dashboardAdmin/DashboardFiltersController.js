Ext.define('SDT.controller.dashboardAdmin.DashboardFiltersController', {
    extend: 'Ext.app.Controller',
    uses: ['SDT.util.DateUtils'],
    views: [
        'dashboardAdmin.cards.Filters',

        'dashboardAdmin.forms.AddEditFiltersForm',

        'dashboardAdmin.containers.fieldTypes.DateContainer',
        'dashboardAdmin.containers.fieldTypes.NumericContainer',
        'dashboardAdmin.containers.fieldTypes.TextContainer',
        'dashboardAdmin.containers.fieldTypes.BooleanContainer',

        'dashboardAdmin.grids.FiltersGrid',
        'dashboardAdmin.grids.PreviewGrid'
    ],
    models: [
        'dashboardAdmin.AvailableValueModel',
        'dashboardAdmin.PreviewModel',
        'dashboardAdmin.FiltersModel'
    ],
    stores: [
        'dashboardAdmin.AvailableValueStore',
        'dashboardAdmin.FiltersStore',
        'dashboardAdmin.FieldStore',
        'dashboard.DashboardResultStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'addEditFiltersForm field[name="fieldName"]': {
                change: me.changeField
            },
            'addEditFiltersForm[filterType="Base"] field[name="fieldLabel"], addEditFiltersForm[filterType="Base"] field[name="type"], addEditFiltersForm[filterType="Base"] field[name="value"], addEditFiltersForm[filterType="Base"] field[name="operator"], addEditFiltersForm[filterType="Base"] field[name="to"], addEditFiltersForm[filterType="Base"] field[name="from"]': {
                change: me.updateBaseFilterCriteria
            },
            'addEditFiltersForm[filterType="Series"] field[name="fieldLabel"], addEditFiltersForm[filterType="Series"] field[name="type"], addEditFiltersForm[filterType="Series"] field[name="value"], addEditFiltersForm[filterType="Series"] field[name="operator"], addEditFiltersForm[filterType="Series"] field[name="to"], addEditFiltersForm[filterType="Series"] field[name="from"]': {
                change: me.updateSeriesFilterCriteria
            },
            'addEditFiltersForm combo[name="value"]': {
                change: me.preventDuplicateSelections
            },
            'addEditFiltersForm[type="Add"] field[name="condition"]': {
                afterrender: me.createConditionId
            },
            'addEditFiltersForm textContainer': {
                beforerender: me.loadAvailableValues
            },
            'addEditFiltersForm, addEditChartForm, addEditCriteriaSelectionForm': {
                afterrender: me.clearFieldFilter
            },
            'addEditFiltersForm field[name="fieldName"], addEditChartForm field[name="fieldName"]': {
                change: me.updateFieldLabel
            },
            'addEditFiltersForm button#applyBtn': {
                click: me.applyFilterItem
            },
            'addEditSeriesForm[filterType="Series"] filtersGrid': {
                beforerender: me.bindSeriesFilterDataChangedEvent
            },
            'previewGrid': {
                beforerender: me.bindFilterDataChangedEvent
            },
            'dashboardConnectedWizardPanel filters, #filtersTab': {
                show: me.loadFiltersGrid
            },
            'filtersActions': {
                editItem: me.filterEditItem
            },
            'filtersGrid button[text="Add Filter"]': {
                click: me.showCreateFilterForm
            },
            'filters field[name="filterGroupingType"], addEditSeriesForm field[name="filterGroupingType"]': {
                change: me.changeFilterGroupType
            },
            'filters button[name="applyCriteriaGrouping"], addEditSeriesForm button[name="applyCriteriaGrouping"]': {
                click: me.executeApplycriteriaGrouping
            }
        });
    },
    refs: [{
        ref: 'viewportPanel',
        selector: 'viewport > panel'
    }, {
        ref: 'details',
        selector: 'details'
    }, {
        ref: 'filters',
        selector: 'filters'
    }, {
        ref: 'dashboardAdminView',
        selector: 'dashboardAdminView'
    }, {
        ref: 'previewGrid',
        selector: 'previewGrid'
    }, {
        ref: 'dashboardWizardPanel',
        selector: 'dashboardWizardPanel'
    }, {
        ref: 'dashboardsGrid',
        selector: 'dashboardsGrid'
    }],

    preventDuplicateSelections: function (combo, newValue, oldValue) {
        combo.setValue(Ext.Array.unique(combo.getValue()));
    },

    updateFieldLabel: function (combo, newValue, oldValue) {
        var fieldLabel = combo.up('form').getForm().findField('fieldLabel'),
            selectedFieldTypeRec = combo.findRecordByValue(newValue),
            selectedFieldValue;

        if (!Ext.isEmpty(newValue) && selectedFieldTypeRec) {
            selectedFieldValue = selectedFieldTypeRec.get('value');
            fieldLabel.setRawValue(selectedFieldValue);
        } else {
            fieldLabel.setRawValue('');
        }
    },

    changeFilterGroupType: function (combo, newValue, oldValue) {
        var me = this,
            formPanel = combo.up('form'),
            baseCriteriaArray = [],
            applycriteriaGrouping = formPanel.down('button[name="applyCriteriaGrouping"]'),
            form = formPanel.getForm(),
            criteria = form.findField('criteria'),
            filtersGrid = formPanel.down('filtersGrid'),
            store = filtersGrid.getStore(),
            previewGrid = formPanel.down('previewGrid'),
            criteriaGroupingField = form.findField('criteriaGrouping');

        Ext.suspendLayouts();

        if (newValue === 'custom') {
            criteriaGroupingField.setVisible(true);
            if (applycriteriaGrouping) {
                applycriteriaGrouping.setVisible(true);
            }
        } else {
            criteriaGroupingField.setVisible(false);
            if (applycriteriaGrouping) {
                applycriteriaGrouping.setVisible(false);
            }

            criteriaGroupingField.setValue(me.cleanCriteriaGroupingText(criteriaGroupingField.getValue()).replace(new RegExp('OR|AND', 'gi'), newValue).replace(new RegExp('\\(|\\)', 'g'), ''));

            baseCriteriaArray = me.getBaseCriteria(store);

            criteria.setValue(me.buildFilterFromcriteriaGrouping(criteriaGroupingField.getValue(), baseCriteriaArray));

            if (previewGrid) { me.excuteGridPreview(previewGrid); }
        }

        Ext.resumeLayouts();
        formPanel.doLayout();
    },

    cleanCriteriaGroupingText: function (str) {
        return str.toUpperCase().replace(/\s+/g, ' ').trim();
    },

    executeApplycriteriaGrouping: function (button) {
        var me = this,
            formPanel = button.up('form'),
            form = formPanel.getForm(),
            baseCriteriaArray = [],
            criteria = form.findField('criteria'),
            criteriaGrouping = form.findField('criteriaGrouping'),
            filtersGrid = formPanel.down('filtersGrid'),
            previewGrid = formPanel.down('previewGrid'),
            store = filtersGrid.getStore();

        baseCriteriaArray = me.getBaseCriteria(store);

        criteriaGrouping.setValue(me.cleanCriteriaGroupingText(criteriaGrouping.getValue()));

        criteria.setValue(me.buildFilterFromcriteriaGrouping(criteriaGrouping.getValue(), baseCriteriaArray));
        me.excuteGridPreview(previewGrid);
    },

    createConditionId: function (field) {
        var store = field.up('form').store;
        field.setValue(store.getCount() + 1);
    },

    initFieldsStore: function (dataIndex, callbackFn) {

        var me = this,
            store = me.getDashboardAdminFieldStoreStore();

        store.getProxy().extraParams = {
            dataIndex: dataIndex
        };

        if (store.getTotalCount() === 0) {
            store.load({ callback: callbackFn });
        }
    },

    initStores: function () {
        //Inititializes stores for wizard if preloading store is required

        var me = this,
            dashboardAdminFieldStore = me.getDashboardAdminFieldStoreStore();

        //Clear listeners that are dynamically created (only needed on memory proxy based stores, cause that is the only type that has dynamic events that I am managing)

        dashboardAdminFieldStore.clearListeners('load');

        //Remove previous data from stores loading on edits and showing on add operations

        dashboardAdminFieldStore.removeAll();
    },


    updateLabelField: function (field) {
        var labelField = field.up('form').getForm().findField('fieldLabel');

        labelField.setValue(field.getRawValue());
        labelField.focus(true, 10);
    },

    clearFieldFilter: function (form) {

        //Reset filter to default filter on render
        var me = this,
            dashboardAdminFieldStore = me.getDashboardAdminFieldStoreStore();

        dashboardAdminFieldStore.clearFilter(true);

    },

    updateQueryOrField: function (field, oldValue, newValue) {
        var form = field.up('form').getForm(),
            dataSource = form.findField('dataSource');

        //Update the facet field or facet query if one of the required fields changes
        this.toggleFieldTypeChart(dataSource);
    },

    excuteGridPreview: function (grid) {
        var callbackFn,
            form = grid.up('form').getForm(),
            dataIndexValue = Ext.ComponentQuery.query('#dataIndex')[0].getValue(),
            criteria = form.findField('criteria').getValue(),
            store = grid.getStore(),
            currentExtraParams = store.getProxy().extraParams;

        currentExtraParams.fq = (criteria === '%3A%22%22') ? '' : decodeURIComponent(criteria);
        //currentExtraParams.dataIndex = dataIndexValue;
        //currentExtraParams.filters = '';

        store.getProxy().extraParams = currentExtraParams;

        callbackFn = function () {
            grid.setTitle(grid.prefix + ' - ' + store.getTotalCount());
        };

        store.removeAll();

        //Should eventually return all results when no filter applied for now requires atleast on filter needs fixed in service layer
        //Only base params exist no filters specified
        store.load({ callback: callbackFn });
    },
    bindFilterDataChangedEvent: function (grid) {
        var me = this,
            filterGroupingFieldset,
            field,
            baseCriteria,
            criteriaGrouping,
            filterGroupingType,
            baseCriteriaArray,
            filtersGrid = grid.up('form').down('filtersGrid'),
            store = filtersGrid.getStore();

        store.on('datachanged', function () {

            filterGroupingFieldset = grid.up('form').down('fieldset');
            field = grid.up('form').getForm().findField('criteria');

            baseCriteria = field.up('form').getForm().findField('baseCriteria');
            criteriaGrouping = field.up('form').getForm().findField('criteriaGrouping');
            filterGroupingType = field.up('form').getForm().findField('filterGroupingType');

            baseCriteriaArray = [];

            baseCriteriaArray = me.getBaseCriteria(this);

            me.buildcriteriaGrouping(store, filterGroupingType, criteriaGrouping);

            me.toggleFilterGroupingVisibility(this, filterGroupingFieldset);

            //Include any fields added to filters as visible columns

            grid = me.toggleColumnVisbility(grid, Ext.Array.pluck(baseCriteriaArray, 'fieldName'));

            baseCriteria.setValue(Ext.encode(baseCriteriaArray));

            field.setValue(me.buildFilterFromcriteriaGrouping(criteriaGrouping.getValue(), baseCriteriaArray));

            me.excuteGridPreview(grid);
            //filtersGrid.validate();
        });
    },

    bindSeriesFilterDataChangedEvent: function (grid) {
        var me = this,
            filterGroupingFieldset,
            criteria,
            seriesCriteria,
            criteriaGrouping,
            filterGroupingType,
            seriesCriteriaArray,
            store = grid.getStore();

        store.on('datachanged', function () {

            filterGroupingFieldset = grid.up('form').down('fieldset');
            criteria = grid.up('form').getForm().findField('criteria');
            seriesCriteria = grid.up('form').getForm().findField('seriesCriteria');
            criteriaGrouping = grid.up('form').getForm().findField('criteriaGrouping');
            filterGroupingType = grid.up('form').getForm().findField('filterGroupingType');

            seriesCriteriaArray = [];

            seriesCriteriaArray = me.getBaseCriteria(this);

            me.buildcriteriaGrouping(store, filterGroupingType, criteriaGrouping);
            me.toggleFilterGroupingVisibility(store, filterGroupingFieldset);
            seriesCriteria.setValue(Ext.encode(seriesCriteriaArray));
            criteria.setValue(me.buildFilterFromcriteriaGrouping(criteriaGrouping.getValue(), seriesCriteriaArray));
        });
    },

    toggleFilterGroupingVisibility: function (store, fieldset) {
        if (store.getCount() > 1) {
            fieldset.setVisible(true);
        } else {
            fieldset.setVisible(false);
        }
    },

    buildcriteriaGrouping: function (store, filterGroupingType, criteriaGrouping) {
        var conditions = [],
            addedRecords,
            removedRecords,
            groupingSeperator;

        criteriaGrouping.setRawValue(this.cleanCriteriaGroupingText(criteriaGrouping.getValue()));

        groupingSeperator = (filterGroupingType.getValue() === 'custom') ? 'AND' : filterGroupingType.getValue();

        if (Ext.isEmpty(criteriaGrouping.getValue())) {

            store.each(function (record, index, len) {
                data = record.getData();
                record.phantom = false;
                conditions.push(data.condition);
            });

            conditions = (conditions.length > 0) ? conditions.join(Ext.String.format(' {0} ', groupingSeperator)) : '';
        } else {

            addedRecords = store.getNewRecords();
            removedRecords = store.getRemovedRecords();

            Ext.Array.each(removedRecords, function (record, index, len) {
                data = record.getData();
                criteriaGrouping.setRawValue(criteriaGrouping.getValue().replace(new RegExp(groupingSeperator + ' ' + data.condition + '|' + data.condition + ' ' + groupingSeperator + '|' + data.condition, 'g'), ''));
            });

            Ext.Array.each(addedRecords, function (record, index, len) {
                data = record.getData();
                record.phantom = false;
                conditions.push(data.condition);
            });

            conditions = ((conditions.length === 1) ?
                Ext.String.format(' {0} {1}', groupingSeperator, conditions.join()) : (conditions.length !== 0) ?
                    Ext.String.format(' {0} ', groupingSeperator) + conditions.join(Ext.String.format(' {0} ', groupingSeperator)) : ''
            );
            conditions = criteriaGrouping.getValue() + conditions;
        }

        conditions = conditions.replace(/\s+/g, ' ');
        conditions = conditions.trim();

        if (Ext.isEmpty(conditions)) {
            filterGroupingType.setRawValue('AND');
            filterGroupingType.select('AND');
        }

        criteriaGrouping.setRawValue(conditions);

    },

    updateBaseFilterCriteria: function (field, newValue, oldValue) {
        var formPanel = field.up('form'),
            form = formPanel.getForm(),
            fieldName = form.findField('fieldName').getValue(),
            type = form.findField('type').getValue(),
            operator,
            value,
            to,
            valueClone,
            criteriaValue,
            criteria = form.findField('criteria'),
            from;

        if (type === 'Text') {

            value = form.findField('value').getValue();
            operator = form.findField('operator').getValue();

            valueClone = (Ext.isArray(value)) ? Ext.Array.clone(value) : value.split(',');

            if (Ext.isArray(valueClone) && !Ext.isEmpty(valueClone)) {
                Ext.Array.each(valueClone, function (item, index, allItems) {
                    allItems[index] = (item === 'Not Set') ? '(*:* NOT [* TO *]) OR (*:* ["" TO ""])' : Ext.String.format('"{0}"', item);
                });
                valueClone = valueClone.join(' OR ');
                criteriaValue = Ext.String.format('{0}{1}:({2})', ((operator === '<>') ? '-' : ''), fieldName, valueClone);
            } else {
                criteriaValue = Ext.String.format('{0}:(*:* NOT [* TO *]) OR (*:* ["" TO ""])', fieldName);
            }

        } else if (type === 'Date' || type === 'Numeric') {

            operator = form.findField('operator').getValue();
            to = (Ext.isEmpty(form.findField('to').getValue())) ? '*' : form.findField('to').getValue();
            from = (Ext.isEmpty(form.findField('from').getValue())) ? '*' : form.findField('from').getValue();

            criteriaValue = Ext.String.format('{0}{1}:[{2} TO {3}]', ((operator === '<>') ? '-' : ''), fieldName, (from === '' ? '*' : from), (to === '' ? '*' : to));
        } else if (type === 'Boolean') {

            value = form.findField('value').getValue();

            valueClone = (Ext.isArray(value)) ? Ext.Array.clone(value) : value.split(',');

            if (Ext.isArray(valueClone)) {
                Ext.Array.each(valueClone, function (item, index, allItems) {
                    allItems[index] = (item === 'Not Set') ? '(*:* NOT [* TO *])' : Ext.String.format('"{0}"', item);
                });
                valueClone = valueClone.join(' OR ');
                criteriaValue = Ext.String.format('{0}:({1})', fieldName, valueClone);
            }
        }

        criteria.setRawValue(criteriaValue);

    },

    updateSeriesFilterCriteria: function (field, newValue, oldValue) {
        var formPanel = field.up('form'),
            form = formPanel.getForm(),
            fieldName = form.findField('fieldName').getValue(),
            type = form.findField('type').getValue(),
            operator,
            value,
            to,
            valueClone,
            criteriaValue,
            criteria = form.findField('criteria'),
            from;

        if (type === 'Text') {

            value = form.findField('value').getValue();
            operator = form.findField('operator').getValue();

            valueClone = (Ext.isArray(value)) ? Ext.Array.clone(value) : value.split(',');

            if (Ext.isArray(valueClone) && !Ext.isEmpty(valueClone)) {
                Ext.Array.each(valueClone, function (item, index, allItems) {
                    allItems[index] = (item === 'Not Set') ? '(*:* NOT [* TO *]) OR (*:* ["" TO ""])' : Ext.String.format('["{0}" TO "{0}"]', item);
                });
                valueClone = valueClone.join(' OR ');
                criteriaValue = Ext.String.format('{0}{1}:({2})', ((operator === '<>') ? '-' : ''), fieldName, valueClone);
            } else {
                criteriaValue = Ext.String.format('{0}:(*:* NOT [* TO *]) OR (*:* ["" TO ""])', fieldName);
            }

        } else if (type === 'Date' || type === 'Numeric') {

            operator = form.findField('operator').getValue();
            to = (Ext.isEmpty(form.findField('to').getValue())) ? '*' : form.findField('to').getValue();
            from = (Ext.isEmpty(form.findField('from').getValue())) ? '*' : form.findField('from').getValue();

            criteriaValue = Ext.String.format('{0}{1}:[{2} TO {3}]', ((operator === '<>') ? '-' : ''), fieldName, (from === '' ? '*' : from), (to === '' ? '*' : to));
        } else if (type === 'Boolean') {

            value = form.findField('value').getValue();

            valueClone = (Ext.isArray(value)) ? Ext.Array.clone(value) : value.split(',');

            if (Ext.isArray(valueClone)) {
                Ext.Array.each(valueClone, function (item, index, allItems) {
                    allItems[index] = (item === 'Not Set') ? '(*:* NOT [* TO *])' : Ext.String.format('"{0}"', item);
                });
                valueClone = valueClone.join(' OR ');
                criteriaValue = Ext.String.format('{0}:({1})', fieldName, valueClone);
            }
        }

        criteria.setRawValue(criteriaValue);

    },

    getBaseCriteria: function (store) {
        var me = this,
            data,
            fieldLabel,
            foundRecord,
            baseCriteriaArray = [],
            baseCriteriaObj = {},
            fieldsStore = me.getDashboardAdminFieldStoreStore();

        store.each(function (record, index, len) {
            data = record.getData();

            baseCriteriaObj = {};
            baseCriteriaObj.name = data.fieldName;
            baseCriteriaObj.fieldName = data.fieldName;
            baseCriteriaObj.from = data.from;
            baseCriteriaObj.to = data.to;
            baseCriteriaObj.operator = data.operator;
            baseCriteriaObj.type = data.type;
            baseCriteriaObj.condition = parseInt(data.condition, 10);
            baseCriteriaObj.value = (Ext.isArray(data.value)) ? data.value.join(',') : data.value;

            baseCriteriaObj.criteria = encodeURIComponent(data.criteria);

            foundRecord = fieldsStore.findRecord('key', data.fieldName);
            fieldLabel = (foundRecord) ? foundRecord.getData().value : data.fieldLabel;
            record.set('fieldLabel', fieldLabel);

            baseCriteriaObj.fieldLabel = fieldLabel;

            baseCriteriaArray.push(baseCriteriaObj);
        });

        return baseCriteriaArray;
    },

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

    toggleColumnVisbility: function (grid, visibleColumnsList) {

        Ext.Array.each(visibleColumnsList, function (value) {
            Ext.suspendLayouts();
            Ext.Array.each(grid.columns, function (column, index, columns) {
                if (column.xtype !== 'rownumberer' && column.dataIndex === value) {
                    columns[index].setVisible(true);
                    return false; // break here
                }
            });
            Ext.resumeLayouts();
        });

        return grid;

    },

    applyFilterItem: function (btn) {
        var formPanel = btn.up('form'),
            form = formPanel.getForm(),
            foundRecord,
            store = formPanel.store;

        if (form.isValid()) {
            var filter = Ext.create('SDT.model.dashboardAdmin.FiltersModel', form.getValues());
            if (formPanel.type === 'Add') {
                filter.phantom = true;
                store.add(filter);

                formPanel.remove(formPanel.down('#fieldBox')); //Additional remove needed before reset must remove fieldBox container with type information to avoid store error

                form.reset();
                formPanel.down('field[hidden="false"]').focus(true, 10); //Reset field focus to first visible field in form
            } else {
                foundRecord = form.getRecord();
                foundRecord = store.findRecord('condition', foundRecord.getData().condition, 0, false, false, true);
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
    filterEditItem: function (column, record, eventName, actionItem, grid) {
        var me = this,
            store = grid.getStore(),
            parent = grid.up('form'),
            filterType = 'Series',
            rec = record.copy(record.id),
            formPanel = Ext.widget('addEditFiltersForm', { filterType: filterType, type: 'Edit', store: store }),
            form = formPanel.getForm(),
            fieldName = form.findField('fieldName');

        formPanel.on('changeFieldComplete', function () {
            rec.data.value = (!Ext.isEmpty(rec.data.value) && Ext.isString(rec.data.value)) ? rec.data.value.split(',') : (Ext.isArray(rec.data.value)) ? rec.data.value : [];
            if (rec.data.type === 'Text') {
                formPanel.on('valueFieldLoaded', function () {
                    form.loadRecord(rec);
                }, me, { single: true });
            } else {
                form.loadRecord(rec);
            }

        }, me, { single: true });

        formPanel.on('beforerender', function () {
            fieldName.setValue(rec.data.fieldName);
        }, me, { single: true });

        formPanel.show();
    },

    loadFiltersGrid: function (parent) {
        var me = this,
            grid = parent.down('previewGrid'),
            filterStore = parent.down('filtersGrid').getStore(),
            store = Ext.getStore('SolrIndexesStore'),
            fieldStore = me.getDashboardAdminFieldStoreStore(),
            resultStore = Ext.create('SDT.store.dashboard.DashboardResultStore'),
            proxy = resultStore.getProxy(),
            type = parent.up('component[type="Add"], component[type="Edit"]').type, //Determine type of filter add or edit could be a wizard panel or window
            currentForm = grid.up('form'),
            field = currentForm.getForm().findField('baseCriteria'),
            dataIndexValue = Ext.ComponentQuery.query('#dataIndex')[0].getValue(),
            fieldData = {},
            query = {},
            fields = [],
            fieldsList = [],
            columns = [],
            columnObj = {};

        //Create columns and data store dynamiclly on fields list

        var foundRecord = store.findRecord('name', 'Cats');
        records = foundRecord.get('solrFields');

        proxy.url = 'http://localhost:8983/solr/cats/select';
        proxy.extraParams = { q: '*:*' };

        fieldStore.loadData(records);

        fieldStore.each(function (record, index, len) {
            if (index === 0) {
                columns.push({
                    xtype: 'rownumberer',
                    width: 50,
                    stateful: false
                });
            }

            columnObj = {};

            switch (record.get('type')) {
                case 'boolean':
                    columnObj = {
                        xtype: 'booleancolumn',
                        falseText: 'No',
                        trueText: 'Yes',
                        emptyCellText: 'Not Set'
                    };
                    break;
                case 'tdate':
                    columnObj = {
                        renderer: function (value) { return SDT.util.DateUtils.convertGridDate(value); }
                    };
                    break;
                default:
            }

            columnObj.dataIndex = record.get('key');
            columnObj.text = record.get('value');
            columnObj.hidden = (record.get('showInGrid')) ? false : true;
            columnObj.flex = 1;

            columns.push(columnObj);

            fieldData = {}; //Reset field data to blank object

            if (record.get('type') === 'tdate') {
                fieldData = {
                    name: record.get('key'),
                    type: 'date',
                    dateFormat: 'c',
                    convert: function (v, record) {
                        return SDT.util.DateUtils.convertGridDate(v, record);
                    }

                };

            } else {
                fieldData = { name: record.get('key') };
            }

            fields.push(fieldData);
            fieldsList.push(fieldData.name);
            resultStore.model.addFields(fields);
        });

        if (fieldsList.length > 0) {
            query.fieldsList = fieldsList.join(',');
        }

        query.dataIndex = dataIndexValue;
        grid.prefix = dataIndexValue;
        proxy.extraParams = Ext.Object.merge(proxy.extraParams, query);
        resultStore.setProxy(proxy);

        grid.on('reconfigure', function (grid) {

            var callbackFn;

            callbackFn = function () {
                grid.setTitle(grid.prefix + ' - ' + resultStore.getTotalCount());
            };

            if (type === 'Add') {
                resultStore.load({ callback: callbackFn });
            } else if (type === 'Edit') {
                me.loadFiltersGridFromField(field, filterStore);
            }

        }, this, { single: true });

        grid.reconfigure(resultStore, columns);

    },

    loadFiltersGridFromField: function (field, store) {
        var filters = Ext.decode(field.getValue());

        Ext.Array.each(filters, function (item) {
            item.criteria = decodeURIComponent(item.criteria);
        });

        store.loadData(filters);
    },

    loadSeriesGrid: function (grid) {
        var store = grid.getStore(),
            form = grid.up('form').getForm(),
            seriesData;

        form.on('dirtychange', function () {
            seriesData = form.findField('seriesData').getValue();
            store.loadData(Ext.decode(seriesData));
        }, { single: true });
    },


    showCreateFilterForm: function (btn) {
        var store = btn.up('grid').getStore(),
            parent = btn.up('form'),
            filterType = 'Series';

        Ext.widget('addEditFiltersForm', { filterType: filterType, type: 'Add', store: store }).show();
    },

    loadAvailableValues: function (container) {
        var me = this,
            formPanel = container.up('form'),
            valueCombo = formPanel.getForm().findField('value'),
            fieldName = formPanel.getForm().findField('fieldName').getValue(),
            callbackFn,
            dataIndexValue = Ext.ComponentQuery.query('#dataIndex')[0].getValue(),
            store = valueCombo.getStore(),
            proxy = store.getProxy();

        //?facet.field = country & facet=on & q=*:*&rows=0

        store.getProxy().extraParams = {
            'facet.field': fieldName,
            'facet.missing': true,
            'json.nl': 'arrarr',
            facet: 'on',
            rows: 0,
            q: '*:*'
        };

        store.getProxy().setReader({
            type: 'array',
            rootProperty: Ext.String.format('facet_counts.facet_fields.{0}', fieldName)
        });

        callbackFn = function (operation, success) {
            //Change field type from combo to textfield depending on amount of results
            formPanel.fireEvent('valueFieldLoaded', me);
        };

        //Load facet query to retrieve availble values
        store.load({
            callback: callbackFn
        });
    },

    changeField: function (combo, newValue, oldValue) {

        var me = this,
            form = combo.up('form'),
            fieldName = combo.getValue(),
            filterTypeField = form.getForm().findField('type'),
            selectedFieldTypeRec = combo.findRecordByValue(fieldName),
            selectedFieldType,
            type;

        if (selectedFieldTypeRec) {
            selectedFieldType = selectedFieldTypeRec.get('type');
        }

        if (form.down('#fieldBox')) {
            form.remove(form.down('#fieldBox'));
        }

        switch (selectedFieldType) {
            case 'string':
            case 'text':
                type = 'Text';
                break;
            case 'tdate':
                type = 'Date';
                break;
            case 'tint':
            case 'float':
            case 'int':
                type = 'Numeric';
                break;
            case 'boolean':
                type = 'Boolean';
                break;
        }

        if (!Ext.isEmpty(type)) {
            form.insert(2, { xtype: Ext.String.format('{0}Container', type.toLowerCase()) });
            filterTypeField.setRawValue(type);
            form.fireEvent('changeFieldComplete', me);
        }
    },
    toggleFieldTypeChart: function (combo) {
        var formPanel = combo.up('form'),
            seriesGrid = formPanel.down('seriesGrid'),
            form = formPanel.getForm(),
            fieldName = form.findField('fieldName'),
            fieldLabel = form.findField('fieldLabel'),
            facetField = form.findField('facetField'),
            facetQuery = form.findField('facetQuery');

        if (combo.getValue() === 'FacetField') {
            seriesGrid.hide();
            fieldName.allowBlank = false;
            fieldName.show();
            facetQuery.setRawValue('');
            seriesGrid.getStore().removeAll();
            this.buildFacetField(form, facetField);

        } else if (combo.getValue() === 'FacetQuery') {
            seriesGrid.show();
            fieldName.allowBlank = true;
            fieldName.hide();
            seriesGrid.fireEvent('show', seriesGrid);
            fieldLabel.setRawValue('');
            fieldName.clearValue();
            facetField.setRawValue('');
        }
    },
    buildFacetField: function (form, facetField) {
        var fieldName = form.findField('fieldName'),
            value = Ext.String.format('&facet.field={0}', Ext.valueFrom(fieldName.getValue(), ''));

        facetField.setValue(value);
    }
});