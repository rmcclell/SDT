Ext.define('SDT.controller.settingManager.DisplayController', {
    extend: 'Ext.app.Controller',
    refs: [{
        ref: 'settingManagerDialogView',
        selector: 'settingManagerDialogView'
    }],
    init: function () {
        var me = this;
        me.control({
            '#radioGroupDateFormat': {
                change: me.onradioGroupDateFormatChanged
            },
            '#radioGroupNumberFormat': {
                change: me.onradioGroupNumberFormatChanged
            }
        });
    },

    //update globals for date and number format so user does not need to reload page to see changes
    onradioGroupDateFormatChanged: function (radioGroup, newValue) {
        SDT.util.GLOBALS.DISPLAY_FORMATS.date = newValue.radioDateFormat;
    },

    //update globals for date and number format so user does not need to reload page to see changes
    onradioGroupNumberFormatChanged: function (radioGroup, newValue, oldValue, eOpts) {
        var t = newValue.radioNumberFormat;
        SDT.util.GLOBALS.DISPLAY_FORMATS.number = t;
        Ext.util.Format.decimalSeparator = t.charAt(5);
        Ext.util.Format.thousandSeparator = t.charAt(1);
    }
});