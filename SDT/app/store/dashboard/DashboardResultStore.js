//TODO: Relocated to seperate file
Ext.define('SDT.proxyAjax', {
    override: 'Ext.data.proxy.Ajax',
    encodeSorters: function (sorters) {
        var length = sorters.length,
            sortStrs = [],
            sorter, i;

        for (i = 0; i < length; i++) {
            sorter = sorters[i];
            sortStrs[i] = sorter._property + ' ' + sorter._direction
        }

        return sortStrs.join(',');
    }
});

Ext.define('SDT.store.dashboard.DashboardResultStore', {
    extend: 'Ext.data.Store',
    remoteFilter: false,
    remoteSort: true,
    pageSize: 60,
    autoLoad: false,
    model: 'SDT.model.dashboard.DashboardResultModel',
    proxy: {
        type: 'ajax',
        limitParam: 'rows',
        sortParam: 'sort',
        startParam: 'start',
        noCache: false,
        reader: {
            type: 'json',
            rootProperty: 'response.docs',
            totalProperty: 'response.numFound'
        }
    }
});