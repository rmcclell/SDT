Ext.define('SDT.view.globalSearch.GlobalSearchView', {
    extend: 'Ext.container.Container',
    requires:['SDT.view.globalSearch.GlobalSearchTabPanel'],
    alias: 'widget.globalSearchView',
    layout: 'fit',
    stateful: true,
    stateId: 'globalSearchView',
    style: { backgroundColor: '#FFF' },
    items: [{
        xtype: 'globalSearchTabPanel'
    }]
});