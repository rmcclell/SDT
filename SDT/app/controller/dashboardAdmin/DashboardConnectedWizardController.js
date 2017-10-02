Ext.define('SDT.controller.dashboardAdmin.DashboardConnectedWizardController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.DashboardsGrid',
        'dashboardAdmin.DashboardConnectedWizardPanel'
    ],
    models: [],
    stores: [],
    init: function () {
        var me = this;
        me.control({
            'dashboardsGrid > toolbar > button menuitem#createConnectedDashboardBtn': {
                click: me.createDashboard
            }
        });
    },
    refs: [{
        ref: 'viewportPanel',
        selector: 'viewport > panel'
    }, {
        ref: 'dashboardAdminView',
        selector: 'dashboardAdminView'
    }, {
        ref: 'dashboardsGrid',
        selector: 'dashboardsGrid'
    }],

    createDashboard: function (btn) {
        var dashboardAdminView = this.getDashboardAdminView(),
            dtStr = Ext.Date.format(new Date(), 'c'),
            dashboardWizardPanel = Ext.create('SDT.view.dashboardAdmin.DashboardConnectedWizardPanel', { type: 'Add' }),
            newDashboardDetailsForm = dashboardWizardPanel.down('details').getForm(),
            modifiedDate = newDashboardDetailsForm.findField('modifiedDate'),
            createDate = newDashboardDetailsForm.findField('createDate');

        dashboardAdminView.getLayout().setActiveItem(dashboardWizardPanel);

        dtStr = dtStr.slice(0, dtStr.lastIndexOf('-')) + '.500Z'; //Add milliseconds to timestamp so timestamp uses strict iso 8601 ex date 2012-12-27T00:05:49.826Z

        modifiedDate.setRawValue(dtStr);
        createDate.setRawValue(dtStr);
    }
});