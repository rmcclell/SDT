Ext.define('SDT.view.settingManager.localDisplayFormat', {
    extend: 'Ext.form.Panel',
    alias: 'widget.localDisplayFormat',
    requires: [
        'Ext.form.field.Radio',
        'Ext.form.FieldSet',
        'Ext.form.RadioGroup',
        'Ext.form.field.Checkbox'
    ],
    title: 'Display',
    bodyStyle: 'padding: 5px 5px 5px 5px',
    items: [
        {
            xtype: 'fieldset',
            title: 'Date Format',
            items: [{
                xtype: 'radiogroup',
                columns: 1,
                vertical: true,
                stateId: 'stateDateFormat',
                itemId: 'radioGroupDateFormat',
                items: [
                    {
                        boxLabel: 'MM-DD-YYYY',
                        name: 'radioDateFormat',
                        inputValue: 'm-d-Y',
                        checked: true
                    }, {
                        boxLabel: 'DD-MM-YYYY',
                        name: 'radioDateFormat',
                        inputValue: 'd-m-Y'
                    }, {
                        boxLabel: 'YYYY-MM-DD',
                        name: 'radioDateFormat',
                        inputValue: 'Y-m-d'
                    }]
            }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Number Format',
            items: [{
                xtype: 'radiogroup',
                columns: 1,
                vertical: true,
                stateId: 'stateNumberFormat',
                itemId: 'radioGroupNumberFormat',
                items: [
                    {
                        boxLabel: '0,000.00',
                        name: 'radioNumberFormat',
                        inputValue: '0,000.00',
                        checked: true
                    }, {
                        boxLabel: '0.000,00',
                        name: 'radioNumberFormat',
                        inputValue: '0.000,00'
                    }]
            }
            ]
        }
    ]
});