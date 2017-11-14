Ext.define('SDT.component.button.ExportButton', {
    extend: 'Ext.button.Button',
    glyph: 0xf1c3,
    alias: 'widget.exportButton',
    text: 'Export to Excel',
    tooltip: 'Export the results set to an Excel file for downloard. Note large results set may take longer to download. You may continue to work while this is done.',
    menu: {
        items: [/*{
            text: 'Visible Columns',
            name: 'visible',
            tooltip: 'Export All Visible Columns'
        }, */{
            text: 'All Columns',
            tooltip: 'Export All Available Columns',
            name: 'all'
        }/*, {
            text: 'Hidden Columns',
            tooltip: 'Export All Hidden Columns',
            name: 'hidden'
        }*/]
    }
});