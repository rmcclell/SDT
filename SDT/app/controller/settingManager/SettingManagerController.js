Ext.define('SDT.controller.settingManager.SettingManagerController', {
    extend: 'Ext.app.Controller',
    views: [
        'settingManager.SettingManagerDialogView'
    ],
    refs: [{
        ref: 'settingManagerDialogView',
        selector: 'settingManagerDialogView'
    }],
    init: function () {
        var me = this;
        me.control({
            '#settingManagerMenuBtn': {
                click: me.onSettingManagerMenuBtnClick
            }
        });
    },

    onSettingManagerMenuBtnClick: function () {
        var dialog = Ext.widget('settingManagerDialogView');
        dialog.show();
    }
});