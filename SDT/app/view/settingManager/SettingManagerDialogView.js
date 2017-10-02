Ext.define('SDT.view.settingManager.SettingManagerDialogView', {
    extend: 'Ext.tab.Panel',
    floating: true,
    closable: true,
    alias: 'widget.settingManagerDialogView',
    requires: [
        'SDT.view.settingManager.PreferencesGridView',
        'SDT.view.settingManager.ProfilesGridView',
        'SDT.view.settingManager.SolrIndexesGridView',
        'SDT.view.settingManager.localDisplayFormat'
    ],
    title: 'Settings Manager',
    width: 500,
    height: 500,
    items: [{
        title: 'Profiles',
        xtype: 'profilesGrid'
    }, {
        title: 'Preferences',
        xtype: 'preferencesGrid'
    }, {
        title: 'Solr Indexes',
        xtype: 'solrIndexesGrid'
    }, {
        title: 'Display',
        xtype: 'localDisplayFormat'
    }]
});