Ext.define('SDT.store.LanguagesStore', {
    extend: 'Ext.data.Store',
    fields: ['code', 'language'],
    data: [{
        code: 'en',
        language: 'English'
    }, {
        code: 'fr',
        language: 'French'
    }, {
        code: 'de',
        language: 'German'
    }, {
        code: 'it',
        language: 'Italian'
    }, {
        code: 'es',
        language: 'Spanish'
    }]
});