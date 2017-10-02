Ext.define('SDT.view.HomeView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.homeView',
    title: 'Home Page',
    layout: 'fit',
    items: [{
        xtype: 'container',
        html: '<iframe name="homePage" src="http://lucene.apache.org/solr/" frameborder="0" scrolling="auto" width="100%" height="100%" marginwidth="5" marginheight="5" ></iframe>'
    }]
});