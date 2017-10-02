Ext.define('SDT.store.ThemesStore', {
    extend: 'Ext.data.Store',
    fields: ['cssFile', 'theme'],
    data: [{
        cssFile: 'ext-all.css',
        theme: 'Blue'
    }, {
        cssFile: 'ext-all-gray.css',
        theme: 'Gray'
    },
    {
        cssFile: 'ext-all-access.css',
        theme: 'Accessibility'
    },
    {
        cssFile: 'ext-all-neptune.css',
        theme: 'Neptune'
    }]
});