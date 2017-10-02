Ext.define('SDT.controller.globalSearch.GlobalSearchController', {
    extend: 'Ext.app.Controller',
    views: [
       'globalSearch.GlobalSearchView'
   ],
    stores: [
        'globalSearch.GlobalSearchFilterStore'
    ],
    refs: [{
        ref: 'globalSearchView',
        selector: 'globalSearchView'
    }, {
        ref: 'globalSearchTextField',
        selector: '#globalSearchTextField'
    }, {
        ref: 'viewportContainer',
        selector: '#viewportContainer'
    }, {
        ref: 'viewportPanel',
        selector: 'viewport > panel'
    }],
    init: function () {
        var me = this;
        me.control({
            '#globalSearchBtn': {
                click: me.selectGlobalSearchMenuItem
            },
            '#menuItemGlobalSearch': {
                click: me.applyGlobalSearchState
            },
            '#globalSearchTextField': {
                keydown: me.onSearchTextKeyDown
            }
        });
    },
    loadFilterData: function (grid, dataIndex, criteria) {
        var me = this,
            facetQuery,
            filterStore = me.getGlobalSearchGlobalSearchFilterStoreStore(),
            proxy = filterStore.getProxy();
			
        var callbackFn = function (records, operation, success) {
            if (success) {}
            
        };

        filterStore.load({
            callback: callbackFn,
            scope: this
        });
    },
    selectGlobalSearchMenuItem: function (btn) {
        var item = Ext.state.Manager.get('globalSearchMenuItem'),
            ownerCt = btn.menu;

        if (Ext.isEmpty(item)) {
            item = 'menuItemGlobalSearch';
        }

        Ext.Array.each(ownerCt.items.items, function (menuItem) {
            if (menuItem.itemId === item) {
                menuItem.setIconCls('x-icon icon-accept');
            } else {
                menuItem.setIconCls('');
            }
        });
    },
    applyGlobalSearchState: function (item) {
        var me = this,
            searchField = me.getGlobalSearchTextField(),
            searchCriteria = searchField.value;

        searchCriteria = searchField.validateSearchText(searchCriteria);
        if (searchCriteria) {
            Ext.state.Manager.set('globalSearchMenuItem', item.itemId);
            this.showGlobalSearch(this.onSearch);
        }
    },
    showGlobalSearch: function (callbackFn) {
        var me = this,
            globalSearchView = me.getGlobalSearchView(),
            viewPort = me.getViewportPanel();

        if (viewPort.getLayout().getActiveItem().xtype !== 'globalSearchView') {
            globalSearchView.on('show', callbackFn, me, { single: true });

            //Set Global Search view active before loading results
            viewPort.getLayout().setActiveItem(globalSearchView); //Set parent view active
        } else {
            //Already active
            Ext.Function.bind(callbackFn, me)();
        }
    },

    applyGridState: function (grid) {
        if (Ext.state.Manager.get(grid.stateId)) {                  // Added conditional after noting that new users do not have defined state. CH - 02.01.2013
            grid.applyState(Ext.state.Manager.get(grid.stateId));   // Manual state application to the target grid. CH - 02.01.2013
        }
    },
    onSearchTextKeyDown: function (field, event) {
        var me = this,
            searchField = me.getGlobalSearchTextField(),
            searchCriteria = searchField.value,
            key = event.getKey();

        if (key === event.ENTER) {
            searchCriteria = searchField.validateSearchText(searchCriteria);
            if (searchCriteria) {
                this.showGlobalSearch(this.onSearch);
            }
        }
    },
    onSearch: function () {
    },
    showSearchResultTab: function (tab, display) {
        if (display === 'show') {
            tab.show();
            tab.tab.show();
        } else {
            tab.hide();
            tab.tab.hide();
        }

    },
    searchCallbackFn: function (type, tab, store) {
        tab.setTitle(type + ': ' + store.getTotalCount());
        //This is function accounts for rendering issues of IE
        if (Ext.isIE && store.getTotalCount() >= 70000) {
			Ext.Msg.alert('', 'Internet Explorer has known issues with displaying over 70,000 results acurately, We suggest you refine your search reduce the number of results.');
        }
    }
});