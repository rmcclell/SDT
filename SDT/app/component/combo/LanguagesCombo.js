Ext.define('SDT.component.combo.LanguagesCombo', {
    extend: 'Ext.form.field.ComboBox',
    requires: ['SDT.store.LanguagesStore'],
    alias: 'widget.languagesCombo',
    displayField: 'language',
    valueField: 'code',
    labelAlign: 'right',
    labelWidth: 60,
    fieldLabel: 'Language',
    emptyText: 'Select...',
    allowBlank: true,
    queryMode: 'local',
    typeAhead: true,
    store: 'LanguagesStore'
});