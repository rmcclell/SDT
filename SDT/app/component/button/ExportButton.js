Ext.define('SDT.component.button.ExportButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.exportButton',
    text: 'Export',
    tooltip: 'Export the results set to an CSV file',
    menu: {
        items: [{
            text: 'Visible Columns',
            name: 'visible',
            tooltip: 'Export All Visible Columns'
        }, {
            text: 'All Columns',
            tooltip: 'Export All Available Columns',
            name: 'all'
        }]
    }
});