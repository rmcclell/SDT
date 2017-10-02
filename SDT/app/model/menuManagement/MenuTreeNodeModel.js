Ext.define('SDT.model.menuManagement.MenuTreeNodeModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'text', persist: true },
        { name: 'dashboardId', persist: true },
        { name: 'parentId', persist: true },
        { name: 'allowDrop', defaultValue: true, persist: true },
        { name: 'allowDrag', defaultValue: true, persist: true },
        { name: 'leaf', defaultValue: false, persist: true },
        { name: 'children', persist: true },
        { name: 'qtip', persist: true },
        { name: 'href', persist: true },
        { name: 'hrefTarget', defaultValue: '_blank', persist: true },
        { name: 'iconCls', persist: true }
    ],
    //Proxy located on model by design refer to http://docs.sencha.com/extjs/4.1.1/#!/guide/tree for valid example of tree save
    proxy: {
        type: 'ajax',
        noCache: true,
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            allowSingle: false,
            writeAllFields: true
        },
        actionMethods: {
            create: 'POST',
            update: 'POST',
            destroy: 'GET',
            read: 'GET'
        },
        api: {
            create: '',
            update: '',
            destroy: '',
            read: '/data/mock/dashboardAdmin/locationPathTree.json'
        }
    }
});