Ext.define('SDT.controller.menuManagement.MenuManagementController', {
    extend: 'Ext.app.Controller',
    views: [
        'menuManagement.forms.MenuManagementForm',
        'menuManagement.views.AddEditDashboardView',
        'menuManagement.views.AddEditFolderView',
        'menuManagement.views.AddEditLinkView'
    ],
    models: [
        'menuManagement.MenuTreeNodeModel',
        'dashboard.DashboardListsModel'
    ],
    stores: [
        'menuManagement.MenuTreeStore',
        'dashboard.DashboardListsStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'button#viewportAdminMenu menuitem#menuItemMenuManagement': {
                click: me.showMenuManagement
            },
            'menuManagementForm treepanel': {
                selectionchange: me.treeItemClick,
                afterrender: me.loadMenuTree
            },
            'menuManagementForm button#applyBtn': {
                click: me.applyMenuTreeConfig
            },
            'menuManagementForm treepanel toolbar button#addBtn menuitem#addFolderBtn': {
                click: me.addFolder
            },
            'menuManagementForm treepanel toolbar button#addBtn menuitem#addDashboardBtn': {
                click: me.addDashboard
            },
            'menuManagementForm treepanel toolbar button#addBtn menuitem#addLinkBtn': {
                click: me.addLink
            },
            'menuManagementForm treepanel toolbar button#editBtn': {
                click: me.editNode
            },
            'menuManagementForm treepanel toolbar button#deleteBtn': {
                click: me.deleteNode
            },
            'addEditDashboardView[type="Add"] button#applyBtn, addEditLinkView[type="Add"] button#applyBtn, addEditFolderView[type="Add"] button#applyBtn': {
                click: me.applyMenuTreeNodeAdd
            },
            'addEditDashboardView form': {
                beforerender: me.loadDashboardLists
            },
            'addEditDashboardView[type="Edit"] button#applyBtn, addEditLinkView[type="Edit"] button#applyBtn, addEditFolderView[type="Edit"] button#applyBtn': {
                click: me.applyMenuTreeNodeEdit
            },
            'addEditDashboardView[type="Edit"], addEditLinkView[type="Edit"], addEditFolderView[type="Edit"]': {
                beforerender: me.loadNodeEdit
            },
            'addEditDashboardView button#cancelBtn, addEditLinkView button#cancelBtn, addEditFolderView button#cancelBtn, menuManagementForm button#cancelBtn': {
                click: me.closeWindow
            },
            'menuManagementForm': {
                beforeclose: me.closeMenuManagementForm
            },
            'addEditDashboardView form combo[name="dashboardId"]': {
                change: me.updateDashboardText
            }
        });
    },

    refs: [{
        ref: 'menuManagementTree',
        selector: 'menuManagementForm > treepanel'
    }],

    loadMenuTree: function (tree) {
        var store = tree.getStore();

        store.getRootNode().expand();
        this.selectDefaultTreeItem(tree);
    },

    selectDefaultTreeItem: function (tree) {
        var defaultNode = tree.getStore().getNodeById('a8de99a0-1b59-4df5-992d-13048917c93b');
        tree.getSelectionModel().select(defaultNode); //Select dashboards node to start
    },

    loadDashboardLists: function (formPanel) {
        formPanel.getForm().findField('dashboardId').getStore().load();
    },

    updateDashboardText: function (combo, newValue, oldValue) {
        var form = combo.up('form').getForm(),
            selectedDashboardRec = combo.findRecordByValue(newValue),
            text = form.findField('text');

        if (selectedDashboardRec) {
            text.setValue(selectedDashboardRec.get('title'));
            text.focus(true, 250);
        }
    },

    applyMenuTreeNodeAdd: function (button) {
        var form = button.up('form').getForm(),
            tree = this.getMenuManagementTree(),
            store = tree.getStore(),
            window = button.up('window'),
            createdNode,
            newNode,
            node = window.node;

        if (form.isValid()) {

            Ext.data.NodeInterface.decorate('SDT.model.menuManagement.MenuTreeNodeModel'); //Decorate node model to node interface

            newNode = Ext.create('SDT.model.menuManagement.MenuTreeNodeModel', form.getValues());
            newNode.phantom = true; //Needed for new records

            newNode.beginEdit(); //Avoid multiple datachanged events from firing

            newNode.set('id', Ext.data.IdGenerator.get('uuid').generate());

            if (newNode.get('iconCls') === 'x-icon icon-tabs') {
                newNode.set('leaf', false);
                //newNode.set('expaneded', true);
                newNode.set('children', []);
            } else {
                newNode.set('leaf', true);
            }

            newNode.endEdit(); //End edit to fire datachanged event once

            createdNode = node.createNode(newNode);

            node.appendChild(createdNode, false, true); //Third argument needed for commit changes 

            node.expand(); //Expand parrent node so childeren can be seen

            if (newNode.get('leaf') === false) {
                tree.getSelectionModel().select(store.getNodeById(newNode.get('id'))); //Select newly added node if it is a folder so user can imediately add children items
            }

            window.close();
        }
    },

    applyMenuTreeNodeEdit: function (button) {
        var form = button.up('form').getForm(),
            window = button.up('window'),
            node = window.node;
        if (form.isValid()) {

            node.set(form.getValues());

            window.close();
        }
    },

    loadNodeEdit: function (window) {
        var form = window.down('form').getForm(),
            node = window.node;

        form.loadRecord(node);
    },

    closeWindow: function (button) {
        button.up('form').close();
    },

    closeMenuManagementForm: function (form) {
        form.down('treepanel').getStore().sort(); //Must be re sorted for menu to render correctly in cases where user drag and drop folders or adds new folders
    },

    applyMenuTreeConfig: function (button) {
        var window = button.up('window'),
            tree = window.down('treepanel'),
            store = tree.getStore();

        store.sync();
        window.close();
    },

    showMenuManagement: function () {
        var view = Ext.create('SDT.view.menuManagement.forms.MenuManagementForm');
        view.on('afterrender', this.loadMenuTree, { single: true });
    },
    treeItemClick: function (selectionModel, records) {
        var treeview = selectionModel.view,
            record = records[0],
            toolbar = treeview.up('treepanel').down('toolbar'),
            addBtn = toolbar.down('#addBtn'),
            deleteBtn = toolbar.down('#deleteBtn'),
            editBtn = toolbar.down('#editBtn'),
            preventDeleteEdit = ((record.getData().parentId === 'root' || record.getData().root) ? true : false),
            preventAdd = (record.getData().root || record.getData().leaf) ? true : false;

        addBtn.setDisabled(preventAdd);
        deleteBtn.setDisabled(preventDeleteEdit);
        editBtn.setDisabled(preventDeleteEdit);
    },
    addFolder: function (button) {
        var tree = button.up('treepanel'),
            node = tree.getSelectionModel().getSelection()[0];
        Ext.create('SDT.view.menuManagement.views.AddEditFolderView', { type: 'Add', node: node });
    },
    addDashboard: function (button) {
        var tree = button.up('treepanel'),
            node = tree.getSelectionModel().getSelection()[0];
        Ext.create('SDT.view.menuManagement.views.AddEditDashboardView', { type: 'Add', node: node });
    },
    addLink: function (button) {
        var tree = button.up('treepanel'),
            node = tree.getSelectionModel().getSelection()[0];
        Ext.create('SDT.view.menuManagement.views.AddEditLinkView', { type: 'Add', node: node });
    },
    editNode: function (button) {
        var tree = button.up('treepanel'),
            node = tree.getSelectionModel().getSelection()[0],
            nodeType = (node.getData().leaf === false) ? 'Folder' : (!Ext.isEmpty(node.getData().href)) ? 'Link' : 'Dashboard';
        Ext.create('SDT.view.menuManagement.views.AddEdit' + nodeType + 'View', { type: 'Edit', node: node });
    },
    deleteNode: function (button) {
        var tree = button.up('treepanel'),
            node = tree.getSelectionModel().getSelection()[0],
            nodeText = node.getData().text,
            nodeType = (node.getData().leaf === false) ? 'folder' : (!Ext.isEmpty(node.getData().href)) ? 'link' : 'dashboard';

        Ext.Msg.show({
            title: 'Confirm Delete',
            msg: Ext.String.format('Are you sure you want to delete the following "{0}" {1}? Deleteing folders will remove their childeren items.', nodeText, nodeType),
            buttons: Ext.Msg.YESNO,
            fn: function (btn) {
                if (btn === 'yes') {
                    node.destroy({ action: 'destroy', params: { id: node.internalId } });
                }
            },
            icon: Ext.Msg.QUESTION
        });
    }
});