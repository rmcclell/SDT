Ext.define('SDT.view.menuManagement.tree.MenuTreeConfig', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.menuTreeConfig',
    bubbleEvents: ['selectionchange'],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            text: 'Add',
            itemId: 'addBtn',
            disabled: true,
            glyph: 0xf0fe,
            menu: {
                items: [{
                    text: 'Folder',
                    itemId: 'addFolderBtn',
                    glyph: 0xf0fe, //Todo make tabs icon
                }, {
                    text: 'Dashboard',
                    itemId: 'addDashboardBtn',
                    glyph: 0xf0fe, //Todo make chart icon
                }, {
                    text: 'Link',
                    itemId: 'addLinkBtn',
                    glyph: 0xf0fe, //Todo make link icon
                }]
            }
        }, {
            text: 'Edit',
            disabled: true,
            itemId: 'editBtn',
            glyph: 0xf0fe, //Todo make pecil icon
        }, {
            text: 'Delete',
            disabled: true,
            itemId: 'deleteBtn',
            glyph: 0xf0fe, //Todo make minus icon
        }]
    }],
    useArrows: true,
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            containerScroll: true
        }
    },
    store: 'menuManagement.MenuTreeStore'
});