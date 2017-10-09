Ext.define('SDT.view.dashboard.chart.pieChart', {
    extend: 'Ext.chart.PolarChart',
	alias: 'widget.pieChart',
    theme: 'default-gradients',
    insetPadding: 20,
    innerPadding: 10,
	interactions: ['rotate'],
	series: [{
		type: 'pie',
        angleField: 'count',
        label: {
            field: 'label',
            calloutLine: {
                length: 30,
                width: 3
                // specifying 'color' is also possible here
            }
		},
        highlight: true//,
        /*

		tooltip: {
			trackMouse: true,
            renderer: function (tooltip, record, item) {
                tooltip.setHtml(record.get('label') + ': ' + record.get('count') + '%');
			}
        }*/
        //,
        /*
		renderer: function(sprite, config, rendererData, index) {
			 var color = rendererData.store.getAt(index).get('color');
			 if(color !== 'false') {
				 return Ext.apply(config, {
				   fill: color
				 });
		} else {
			return Ext.apply(config, {
				   fill: '#F00'
				 });
		}
	  }*/
	}]
});