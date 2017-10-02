Ext.define('SDT.controller.dashboardAdmin.DashboardIndependentWizardController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.DashboardsGrid',
        'dashboardAdmin.DashboardIndependentWizardPanel',
        'SDT.view.dashboardAdmin.forms.AddEditIndependentChartForm'
    ],
    models: [],
    stores: [],
    init: function () {
        var me = this;
        me.control({
            'dashboardsGrid > toolbar > button menuitem#createIndependentDashboardBtn': {
                click: me.createDashboard
            },
            'addEditIndependentChartForm field[name="facetField"], addEditIndependentChartForm field[name="facetQuery"], addEditIndependentChartForm filtersContainer #criteria': {
                change: me.updateChartQueryField
            }
           
        });
    },
    refs: [{
        ref: 'viewportPanel',
        selector: 'viewport > panel'
    }, {
        ref: 'addEditIndependentChartForm',
        selector: 'addEditIndependentChartForm'
    }, {
        ref: 'dashboardAdminView',
        selector: 'dashboardAdminView'
    }, {
        ref: 'dashboardsGrid',
        selector: 'dashboardsGrid'
    }],
    updateChartQueryField: function (field, newValue, oldValue) {
        var query = {},
            independentChartForm = this.getAddEditIndependentChartForm(),
            queryField = independentChartForm.down("#query");
        query.criteria = independentChartForm.down("#criteria").value;
        query.criteriaGrouping = independentChartForm.down("#criteriaGrouping").value;
        query.filterGroupingType = independentChartForm.down("#filterGroupingType").value;
        query.facet = independentChartForm.down("#facetField").value +  independentChartForm.down("#facetQuery").value;
        query.filters = independentChartForm.down("#filterFormField").value;
        query.sorting = independentChartForm.down("#sorting").value;
        queryField.setValue(Ext.encode(query));

        // var form = field.up('form').getForm(),
        //  dataSource = form.findField('dataSource');

        //Update the facet field or facet query if one of the required fields changes
        // this.toggleFieldTypeChart(dataSource);
    },
    createDashboard: function (btn) {
        var dashboardAdminView = this.getDashboardAdminView(),
            dtStr = Ext.Date.format(new Date(), 'c'),
            dashboardWizardPanel = Ext.create('SDT.view.dashboardAdmin.DashboardIndependentWizardPanel', { type: 'Add' }),
            newDashboardDetailsForm = dashboardWizardPanel.down('details').getForm(),
            modifiedDate = newDashboardDetailsForm.findField('modifiedDate'),
            createDate = newDashboardDetailsForm.findField('createDate');

        dashboardAdminView.getLayout().setActiveItem(dashboardWizardPanel);

        dtStr = dtStr.slice(0, dtStr.lastIndexOf('-')) + '.500Z'; //Add milliseconds to timestamp so timestamp uses strict iso 8601 ex date 2012-12-27T00:05:49.826Z

        modifiedDate.setRawValue(dtStr);
        createDate.setRawValue(dtStr);
    }
});