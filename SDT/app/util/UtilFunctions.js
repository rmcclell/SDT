Ext.define('SDT.util.UtilFunctions', {
    singleton: true,
    historyHandler: function (token) {
        var me = this;

        token = token || '';

        if (Ext.isEmppy(token)) {
            me.logError('UtilFunctions:historyHandler: The passed token was invalid. Check to ensure that you\'re not misspelling the token name, and that it exists in the token list.');
        } else {
            me.logError('UtilFunctions::historyHandler: Hello, you\'ve reached the historyHandler method. At this time, nobody is here to take your call, so please leave a message after the beep.');
        }
    },
    
    gridCellWrap: function (val) {
        val = (Ext.isEmpty(val)) ? '' : val;
        return Ext.String.format('<div class="x-column-text-wrapped">{0}</div>', val);
    },

    gridCellValueElipse: function (val) {
        var newValue = Ext.util.Format.ellipsis(val, 25);
        return newValue + '...';
    },

    postData: function (url, data) {
        if (!Ext.fly('frmDummy')) {
            var frm = document.createElement('form');
            frm.id = 'frmDummy';
            frm.name = frm.id;
            frm.className = 'x-hidden';
            document.body.appendChild(frm);
        }

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            form: Ext.fly('frmDummy'),
            isUpload: true,
            params: data
        });
    }
});