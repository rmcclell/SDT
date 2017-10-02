Ext.define('SDT.view.dashboardAdmin.fields.ColorCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.colorCombo',
    fieldLabel: 'Color',
    name: 'color',
    typeAhead: true,
    queryMode: 'local',
    forceSelection: true,
    allowBlank: true,
    store: [
        [false, 'Automatic'],
        ['#00FFFF', 'Aqua'],
        ['#000000', 'Black'],
        ['#0000FF', 'Blue'],
        ['#FF00FF', 'Fuchsia'],
        ['#808080', 'Gray'],
        ['#008000', 'Green'],
        ['#00FF00', 'Lime'],
        ['#800000', 'Maroon'],
        ['#000080', 'Navy'],
        ['#808000', 'Olive'],
        ['#FFA500', 'Orange'],
        ['#800080', 'Purple'],
        ['#FF0000', 'Red'],
        ['#C0C0C0', 'Silver'],
        ['#008080', 'Teal'],
        ['#FFFFFF', 'White'],
        ['#FFFF00', 'Yellow']
    ],
    value: false,
    listConfig: {
        // Custom rendering template for each item
        itemTpl: [
            '<tpl for=".">',
                '<tpl if="field1">',
                    '<div style="width:13px;height:13px;background-color:{field1}" data-qtip="{field2} #{field1}"><span style="padding-left:15px;">{field2}</span></div>',
                '</tpl>',
                '<tpl if="!field1">',
                    '<div style="width:13px;height:13px;background-color:#000" data-qtip="{field2} Automatically chose color"><span style="padding-left:15px;">{field2}</span></div>',
                '</tpl>',
            '</tpl>'
        ]
    }
});