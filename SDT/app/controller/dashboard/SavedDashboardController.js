Ext.define('SDT.controller.dashboard.SavedDashboardController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboard.DashboardAddEditSavedUserCriteriaFilter'
    ],
    stores: [
        'dashboard.DashboardSavedUserCriteriaStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'tool[type="save"]': {
                click: me.onSaveClick
            }, 'dashboardCriteriaPanel button[name="addUserCriteriaFilter"]': {
                click: me.onAddClick
            }, 'dashboardCriteriaPanel button[name="deleteUserCriteriaFilter"]': {
                click: me.onDeleteClick
            }, 'dashboardCriteriaPanel button[name="editUserCriteriaFilter"]': {
                click: me.onEditClick
            }, 'dashboardCriteriaPanel field[name="dashboardSavedUserCriteriaFilters"]': {
                change: me.loadSavedUserCriteriaFilters,
                beforerender: me.fireChangeEventSavedUserCriteriaFilters
            }, 'dashboardAddEditSavedUserCriteriaFilter button[name="cancel"]': {
                click: me.onCancelClick
            }, 'dashboardAddEditSavedUserCriteriaFilter[mode="edit"]': {
                beforerender: me.loadEditFormData
            }, 'dashboardAddEditSavedUserCriteriaFilter form field[name="dashboardSavedUserCriteriaFilters"]': {
                afterrender: me.focusFilterNameField
            }, 'dashboardAddEditSavedUserCriteriaFilter[mode="add"] button[name="apply"]': {
                click: me.onAddApplyClick
            }, 'dashboardAddEditSavedUserCriteriaFilter[mode="edit"] button[name="apply"]': {
                click: me.onEditApplyClick
            }, 'dashboardAddEditSavedUserCriteriaFilter form': {
                afterrender: me.bindKeyNav
            }
        });
    },

    bindUserCriteriaFilterNameFieldValidator: function (field) {

        var store = field.up('window').getSavedUserFilterCombo().getStore();

        //Create custom validate function to make sure duplicate filter names dont alreadu exists

        field.isValid = function () {
            var me = this,
                trimText = Ext.util.Format.trim(me.getValue()),
                foundRecord = store.findRecord('display', trimText, 0, false, false, true);

            if (me.allowBlank === false && trimText.length === 0) {
                me.markInvalid(me.blankText);
                return false; //Validate textfield with just white space as false
            } else if (foundRecord) {
                me.markInvalid(Ext.String.format('"{0}" already exists filter name must be one that is unique.', trimText)); //Validate if title is already in use
                return false;
            } else {
                me.clearInvalid();
                return true;
            }
        };
    },

    bindKeyNav: function (form) {
        var applyButton = form.up('window').down('button[name="apply"]');
        form.keyNav = Ext.create('Ext.util.KeyNav', form.el, {
            enter: function () { applyButton.fireEvent('click', applyButton); },
            scope: form
        });
    },

    fireChangeEventSavedUserCriteriaFilters: function (field) {
        field.fireEvent('change', field, field.getValue(), '');
    },

    focusFilterNameField: function (field) {
        field.focus(true, 500);
    },

    loadEditFormData: function (window) {
        var comboValue = window.getSavedUserFilterCombo().getValue(),
            form = window.down('form').getForm(),
            filterName = form.findField('dashboardSavedUserCriteriaFilters');

        filterName.setRawValue(comboValue);
    },

    loadSavedUserCriteriaFilters: function (combo, newValue, oldValue) {
        var me = this,
            field,
            dashboardCriteriaPanel = combo.up('form'),
            stateOutOfSync = false,
            dashboardCriteriaForm = dashboardCriteriaPanel.getForm(),
            dashboardSelectedChartFiltersField = dashboardCriteriaForm.findField('dashboardSelectedChartFilters'),
            stateId = dashboardCriteriaPanel.stateId,
            state = Ext.state.Manager.get(stateId, {});

        if (Ext.isEmpty(newValue)) {
            dashboardCriteriaForm.reset();
        }

        if (!Ext.isEmpty(state[newValue])) {

            dashboardCriteriaPanel.stateful = false;

            Ext.Object.each(state[newValue], function (key, value, myself) {
                field = dashboardCriteriaForm.findField(key);
                if (field) {
                    if (field.name !== 'dashboardSelectedChartFilters') {
                        if (field.xtype === 'combo') {
                            field.lastValue = value; //Is a value only used on box select combos
                            field.suspendEvents(false);
                            field.setValue(value, true); // invert value
                            field.resumeEvents();
                        }
                        field.setRawValue(value); //Raw used to prevent on change event from firing
                    } else {
                        field.lastValue = value; //Is a value only used on box select combos
                    }
                } else {
                    stateOutOfSync = true;
                    myself[key] = null;
                    delete myself[key];
                }
            });

            //Build filters for custom click through filters cause the don't exists in drop down created from state
            if (!Ext.isEmpty(state[newValue].dashboardSelectedChartFilters)) {
                var dashboardFilters = dashboardCriteriaPanel.getForm().findField('dashboardSelectedChartFilters'),
                    records = [],
                    filters = [];

                Ext.Array.each(state[newValue].dashboardSelectedChartFilters, function (filter) {
                    if (!Ext.isEmpty(filter)) {
                        filters.push(filter);
                        records.push({ filter: filter, display: decodeURIComponent(filter) });
                    }
                });

                dashboardFilters.lastValue = filters.join(',');

                dashboardFilters.suspendEvents(false);

                dashboardFilters.setValue(filters, true);
                dashboardFilters.value = filters;

                dashboardFilters.resumeEvents();

                dashboardFilters.store.loadData(records);
                dashboardFilters.valueStore.loadData(records);
            }

            dashboardCriteriaPanel.stateful = true;

            //Update preference if entry for dashboard if field available doesnt match saved criteria
            if (stateOutOfSync) {
                Ext.state.Manager.set(dashboardCriteriaPanel.stateId, state); //Reappply state if differences were found
            }

        }

        me.toogleControls(newValue, dashboardCriteriaPanel);

        dashboardSelectedChartFiltersField.fireEvent('applyFilterChange', dashboardSelectedChartFiltersField);
    },

    toogleControls: function (comboValue, dashboardCriteriaPanel) {
        var deleteButton = dashboardCriteriaPanel.down('button[name="deleteUserCriteriaFilter"]'),
            editButton = dashboardCriteriaPanel.down('button[name="editUserCriteriaFilter"]'),
            isDisabled = true,
            saveTool = dashboardCriteriaPanel.down('tool[type="save"]');


        isDisabled = (Ext.isEmpty(comboValue)) ? true : false;

        deleteButton.setDisabled(isDisabled);
        editButton.setDisabled(isDisabled);
        saveTool.setDisabled(isDisabled);

    },

    onAddApplyClick: function (button) {
        var me = this,
            win = button.up('window'),
            form = win.down('form').getForm(),
            combo = win.getSavedUserFilterCombo(),
            store = combo.getStore(),
            criteriaFormPanel = combo.up('form'),
            criteriaForm = criteriaFormPanel.getForm(),
            dashboardParams = criteriaForm.getValues(),
            filterName = form.findField('dashboardSavedUserCriteriaFilters'),
            filterNameValue = filterName.getValue().trim(),
            foundRecord;

        foundRecord = store.findRecord('value', filterNameValue, 0, false, false, true);

        if (form.isValid() && !foundRecord && me.containsDashboardParams(dashboardParams)) {
            me.executeSave(combo, filterNameValue, store, win, criteriaFormPanel, dashboardParams);
        } else if (foundRecord) {
            Ext.Msg.confirm('Confirm Filter Overwrite', Ext.String.format('The filter "{0}" you have typed already exists in the current dashboard. Do you wish to overwrite "{0}" with current filter parameters?', filterNameValue), function (btn, text) {
                if (btn === 'yes') {
                    me.executeSave(combo, filterNameValue, store, win, criteriaFormPanel, dashboardParams);
                }
            });
        } else if (!me.containsDashboardParams(dashboardParams)) {
            Ext.Msg.confirm('No Filter Criteria Has Been Defined', Ext.String.format('You have not chosen any user criteria filters. Do you wish to save "{0}" with no filters defined?', filterNameValue), function (btn, text) {
                if (btn === 'yes') {
                    me.executeSave(combo, filterNameValue, store, win, criteriaFormPanel, dashboardParams);
                }
            });
        }
    },

    onEditApplyClick: function (button) {
        var me = this,
            win = button.up('window'),
            form = win.down('form').getForm(),
            combo = win.getSavedUserFilterCombo(),
            store = combo.getStore(),
            criteriaFormPanel = combo.up('form'),
            criteriaForm = criteriaFormPanel.getForm(),
            dashboardParams = criteriaForm.getValues(),
            filterName = form.findField('dashboardSavedUserCriteriaFilters'),
            filterNameValue = filterName.getValue().trim();

        me.bindUserCriteriaFilterNameFieldValidator(filterName);

        if (form.isValid()) {
            me.executeEdit(combo, filterNameValue, store, win, criteriaFormPanel, dashboardParams);
        }
    },

    executeEdit: function (combo, filterNameValue, store, win, criteriaFormPanel, dashboardParams) {

        var me = this,
            stateId = criteriaFormPanel.stateId,
            comboValue = combo.getValue(),
            foundRecord,
            filterNameItem = { display: filterNameValue, value: filterNameValue };

        foundRecord = store.findRecord('value', comboValue, 0, false, false, true);

        store.on('datachanged', function () {
            me.editDashboardCriteria(dashboardParams, filterNameValue, comboValue, stateId, win, combo);
        }, me, { single: true });

        if (foundRecord) {
            foundRecord.beginEdit();
            foundRecord.set(filterNameItem); //Replace old values with new
            foundRecord.endEdit();
            foundRecord.commit();
            store.sync(); //Sync is technically suppose to fire the datachange event on store but appears to be broken in framework
            store.fireEvent('datachanged', store);
        }

    },

    onCloseOrCancelClick: function (button) {
        var win = button.up('window');
        win.close();
    },

    executeSave: function (combo, filterNameValue, store, win, criteriaFormPanel, dashboardParams) {

        var me = this,
            filterNameItem = { display: filterNameValue, value: filterNameValue };

        store.on('datachanged', function () {
            me.onSaveDashboard(criteriaFormPanel, dashboardParams, filterNameValue);
            combo.setValue(filterNameValue, true);
            win.close();
        }, me, { single: true });

        store.add(filterNameItem);
    },

    onCancelClick: function (button) {
        var formPanel = button.up('form');
        formPanel.close();
    },

    onAddClick: function (button) {
        var combo = button.up('form').getForm().findField('dashboardSavedUserCriteriaFilters');
        Ext.create('SDT.view.dashboard.DashboardAddEditSavedUserCriteriaFilter', { config: { savedUserFilterCombo: combo }, mode: 'add' });
    },

    onEditClick: function (button) {
        var combo = button.up('form').getForm().findField('dashboardSavedUserCriteriaFilters');
        Ext.create('SDT.view.dashboard.DashboardAddEditSavedUserCriteriaFilter', { config: { savedUserFilterCombo: combo }, mode: 'edit' });
    },

    onSaveClick: function (tool) {
        var me = this,
            criteriaFormPanel = tool.up('form'),
            criteriaForm = criteriaFormPanel.getForm(),
            dashboardParams = criteriaForm.getValues(),
            filterNameCombo = criteriaForm.findField('dashboardSavedUserCriteriaFilters'),
            filterNameValue = filterNameCombo.getValue();

        me.onSaveDashboard(criteriaFormPanel, dashboardParams, filterNameValue, filterNameCombo); //Update existing
    },

    onSaveDashboard: function (criteriaFormPanel, dashboardParams, comboValue, combo) {

        var me = this,
            stateId = criteriaFormPanel.stateId,
            currentState = Ext.state.Manager.get(stateId, {});

        dashboardParams.dashboardSavedUserCriteriaFilters = null;
        delete dashboardParams.dashboardSavedUserCriteriaFilters;

        me.saveDashboardCriteria(dashboardParams, comboValue, stateId, currentState);
    },
    containsDashboardParams: function (dashboardParams) {
        var paramFound = false;
        Ext.Object.each(dashboardParams, function (key, value) {
            if (Ext.isArray(value) && value.length > 0) {
                paramFound = true;
                return;
            }
        });
        return paramFound;
    },

    onDeleteClick: function (button) {
        var me = this,
            criteriaFormPanel = button.up('form'),
            stateId = criteriaFormPanel.stateId,
            currentState = Ext.state.Manager.get(stateId, {}),
            criteriaForm = criteriaFormPanel.getForm(),
            combo = criteriaForm.findField('dashboardSavedUserCriteriaFilters'),
            comboValue = combo.getValue();

        Ext.Msg.confirm('Confirm Filter Delete', Ext.String.format('Are you sure you want to delete the following fileter "{0}"?', comboValue), function (btn, text) {
            if (btn === 'yes') {
                me.removeDashboardCriteria(comboValue, stateId, currentState, combo);
                criteriaForm.reset();
            }
        });

    },

    removeDashboardCriteria: function (comboValue, stateId, currentState, combo) {

        var store = combo.getStore(),
            index = store.find('value', comboValue);

        currentState[comboValue] = null;
        delete currentState[comboValue];

        if (index !== -1) {
            store.removeAt(index);
            combo.setValue();
        }

        Ext.state.Manager.set(stateId, currentState);
    },

    editDashboardCriteria: function (dashboardParams, newComboValue, oldComboValue, stateId, win, combo) {
        var me = this,
            currentState = Ext.state.Manager.get(stateId, {});

        //Copy params to new filter name
        currentState[newComboValue] = dashboardParams;

        //Remove old named filter from state
        currentState[oldComboValue] = null;
        delete currentState[oldComboValue];

        //Save update state
        Ext.state.Manager.set(stateId, currentState);

        combo.clearValue();
        combo.setValue(newComboValue, true);

        win.close();

        me.showNotification('', 'Successfully renamed from "' + oldComboValue + '" to "' + newComboValue + '. ');

    },

    saveDashboardCriteria: function (dashboardParams, comboValue, stateId, currentState) {
        var me = this;

        currentState[comboValue] = dashboardParams;
        Ext.state.Manager.set(stateId, currentState);

        me.showNotification('', 'Successfully saved as "' + comboValue + '". ');

    },
    showNotification: function (type, html) {
        Ext.Msg.alert('', html);
    }
});