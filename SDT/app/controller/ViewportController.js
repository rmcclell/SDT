Ext.define('SDT.controller.ViewportController', {
    extend: 'Ext.app.Controller',
    requires: [
        'SDT.util.GLOBALS'
	],
    views: [
        'Viewport'
    ],
    models: [
        'dashboard.DashboardListsModel'
    ],
    stores: [
        'LanguagesStore'
    ],
    refs: [{
        ref: 'viewportPanel',
        selector: 'viewport > panel'
    }, {
        ref: 'viewport',
        selector: 'viewport'
    }],
    init: function () {
        var me = this;
        me.control({
            '#menuItemLanguages': {
                beforerender: me.getLanguages
            },
            '#homeButton': {
                click: me.loadHomeViewPanel
            },
            '#menuItemDashboardAdmin': {
                click: me.loadDashboardAdminViewPanel
            },
            'viewport': {
                beforerender: me.initApplication
            }
        });
    },
    
	initApplication: function (store, record, eventName, viewport) {
        this.setDisplayPrefs();
    },
    
	setDisplayPrefs : function () {
        SDT.util.GLOBALS.DISPLAY_FORMATS.number = Ext.state.Manager.get('stateNumberFormat',
                     { value: { "radioNumberFormat": '0,000.00' } }).value.radioNumberFormat;
        Ext.util.Format.decimalSeparator = SDT.util.GLOBALS.DISPLAY_FORMATS.number.charAt(5);
        Ext.util.Format.thousandSeparator = SDT.util.GLOBALS.DISPLAY_FORMATS.number.charAt(1);
        SDT.util.GLOBALS.DISPLAY_FORMATS.date = Ext.state.Manager.get('stateDateFormat',
                     { value: { "radioDateFormat": 'm-d-Y' } }).value.radioDateFormat;
    },
    
    getLanguages: function (menu) {
        var languageStore = this.getLanguagesStoreStore(),
            records = languageStore.getRange(),
            me = this;

        Ext.suspendLayouts();

        Ext.Array.each(records, function (record) {
            var checked = (record.data.language === 'English') ? true : false;
            menu.menu.add({
                text: record.data.language,
                value: record.data.code,
                rawValue: record.data.language, //Leverage value and rawValue on standard combos
                checked: checked,
                listeners: {
                    click: me.onSelectLanguage
                }
            });
        });

        Ext.resumeLayouts(true);
    },
    loadHomeViewPanel: function (button) {
        var viewPort = this.getViewportPanel(),
            view = viewPort.down('homeView');

        viewPort.getLayout().setActiveItem(view); //Set parent view active
    },
    loadDashboardAdminViewPanel: function (button) {
        var viewPort = this.getViewportPanel(),
            view = viewPort.down('dashboardAdminView');

        viewPort.getLayout().setActiveItem(view); //Set parent view active
        view.getLayout().setActiveItem(0);
    },
    onSelectLanguage: function (comp) {
        //component can be a menu item or combo item
        var me = this,
            lang = comp.value,
            url;

        if (lang) {
            url = Ext.util.Format.format('app/locale/ext-lang-{0}.js', lang);
            Ext.Ajax.request({
                url: url,
                success: function (response) {
                    eval(response.responseText);
                },
                failure: function () {
                    Ext.Msg.alert('Failure', 'Failed to load locale file.');
                },
                scope: me
            });
        }
    }
});