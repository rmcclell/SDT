Ext.define('SDT.store.menuManagement.MenuTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'SDT.model.menuManagement.MenuTreeNodeModel',
    autoLoad: false,
    autoSync: false,
    remoteFilter: false,
    remoteSort: false,
    clearOnLoad: true,
    sortOnLoad: true,
    rootProperty: {
        text: 'Menus',
        id: 'root',
        rootProperty: true,
        qtip: 'Menu Root',
        allowDrop: false,
		glyph: 0xf0fe, //Todo make tab icon
        expanded: false //Hidden because of extjs bug autoloading store when expanded expanded in menuManagementController afterrender
    },
    folderSort: true
});