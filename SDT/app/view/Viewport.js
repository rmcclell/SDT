Ext.define('SDT.view.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'viewport',
    requires: [
        'SDT.util.GLOBALS',
        'SDT.view.DashboardsView',
        'SDT.view.DashboardAdminView',
        'SDT.view.globalSearch.GlobalSearchView',
        'SDT.view.HomeView'
    ],
    layout: 'border',
    items: [{
        xtype: 'container',
        itemId: 'viewportContainer',
        html: '<div id="header"><div id="logo" class="header"><div id="title"><span id="build-label"><a href="#" target="_blank">Release Notes</a></span><img data-qtip="&lt;b&gt;Quick Facts&lt;/b&gt;&lt;table width=&quot;300&quot;&gt;&lt;tr&gt;&lt;td&gt;&lt;b&gt;Release&lt;/b&gt;&lt;/td&gt;&lt;td&gt;&lt;b&gt;Peak&lt;/b&gt;&lt;/td&gt;&lt;td&gt;&lt;b&gt;Range&lt;/b&gt;&lt;/td&gt;&lt;td&gt;&lt;b&gt;Rank&lt;/b&gt;&lt;/td&gt;&lt;td&gt;&lt;b&gt;Elevation&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Previous&lt;/td&gt;&lt;td&gt;Blanca Peak&lt;/td&gt;&lt;td&gt;Sangre de Cristo&lt;/td&gt;&lt;td&gt;4th&lt;/td&gt;&lt;td&gt;14,345&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Current&lt;/td&gt;&lt;td&gt;Bross&lt;/td&gt;&lt;td&gt;Mosquito&lt;/td&gt;&lt;td&gt;22nd&lt;/td&gt;&lt;td&gt;14,172&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" width="26" height="8" id="big-mnt" class="header" src="' + Ext.BLANK_IMAGE_URL + '"></div></div><div id="header-right"><div id="dots" class="header"></div><div id="header-links"><a href="#" target="_blank" class="empty-link">Help</a></div></div></div>',
        region: 'north',
        height: 70,
        border: false
    }, {
        xtype: 'panel',
        title: 'Dashboard',
        header: false,
        layout: {
            type: 'card',
            deferredRender: true
        },
        region: 'center',
        border: true,
        activeItem: 1, //dashboardsView
        autoScoll: true,
        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'textfield',
                width: 250,
                itemId: 'globalSearchTextField'
            }, {
                glyph: 0xf002,
                text: 'Search',
                itemId: 'globalSearchBtn',
                menu: [{
                    text: 'Global Search',
                    itemId: 'menuItemGlobalSearch'
                }]
            }, '-', {
                text: 'Home',
                glyph: 0xf015,
                itemId: 'homeButton'
            }, '-', {
                text: 'Dashboards',
                glyph: 0xf0e4,
                itemId: 'dashboardsListBtn',
                menu: []
            }, '-', {
                text: 'Admin',
                glyph: 0xf085,
                itemId: 'viewportAdminMenu',
                menu: [{
                    text: 'Dashboard Admin Tool',
                    itemId: 'menuItemDashboardAdmin',
                    iconCls: 'x-icon icon-application_view_detail'
                }, {
                    text: 'Dashboard Menu Management',
                    itemId: 'menuItemMenuManagement',
                    iconCls: 'x-icon icon-application_view_detail'
                }]
            }, '->', {
                xtype: 'container',
                itemId: 'userDetails',
                tpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '<div class="x-field">', '<div style="font-weight:900;float:right" ', 'data-qtip="&lt;u&gt;&lt;b&gt;User Details&lt;/b&gt;&lt;/u&gt;&lt;br&gt;&lt;b&gt;Department:&lt;/b&gt; {Department}&lt;br&gt;&lt;b&gt;Email:&lt;/b&gt; {Email}&lt;br&gt;&lt;b&gt;First Name:&lt;/b&gt; {FirstName}&lt;br&gt;&lt;b&gt;Full Name:&lt;/b&gt; {FullName}&lt;br&gt;&lt;b&gt;Last Name:&lt;/b&gt; {LastName}&lt;br&gt;&lt;b&gt;Name:&lt;/b&gt; {Name}&lt;br&gt;&lt;b&gt;Telephone:&lt;/b&gt; {Telephone}&lt;br&gt;&lt;b&gt;Title:&lt;/b&gt; {Title}&lt;br&gt;&lt;b&gt;Username:&lt;/b&gt; {Username}&lt;br&gt;"', '>{FullName}{CancelLink}</div>', '</div>', '</tpl>')
                //html data-qtip html enties are encoded
            }, '-', {
                text: 'Settings',
                glyph: 0xf013,
                itemId: 'viewportSettingsBtn',
                menu: {
                    items: [{
                        text: 'Languages',
                        hidden: false,
                        itemId: 'menuItemLanguages',
                        menu: {
                            defaults: {
                                group: 'languages'
                            },
                            items: []
                        }
                    }, {
                        text: 'Themes',
                        hidden: false,
                        itemId: 'menuItemThemes',
                        menu: {
                            defaults: {
                                group: 'themes'
                            },
                            items: []
                        }
                    }, {
                        text: 'Settings',
                        itemId: 'settingManagerMenuBtn'
                    }]
                }
            }]
        }],
        items: [{
            xtype: 'homeView'
        }, {
            xtype: 'dashboardsView'
        }, {
            xtype: 'dashboardAdminView'
        }, {
            xtype: 'globalSearchView'
        }]
    }]
});