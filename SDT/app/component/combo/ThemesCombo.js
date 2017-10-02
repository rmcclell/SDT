Ext.define('SDT.component.combo.ThemesCombo', {
    extend: 'Ext.form.field.ComboBox',
    requires: ['SDT.store.ThemesStore'],
    alias: 'widget.themesCombo',
    displayField: 'theme',
    valueField: 'cssFile',
    fieldLabel: 'Theme',
    labelAlign: 'right',
    labelWidth: 80,
    emptyText: 'Select...',
    allowBlank: true,
    queryMode: 'local',
    typeAhead: true,
    store: Ext.create('SDT.store.ThemesStore')
});