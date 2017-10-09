Ext.define('SDT.view.dashboard.chart.pieChart', {
    extend: 'Ext.chart.PolarChart',
	alias: 'widget.pieChart',
    theme: 'default-gradients',
    insetPadding: 15,
    innerPadding: 15,
    interactions: ['rotate', 'itemhighlight'],
    series: [{
		type: 'pie',
        angleField: 'count',
        highlight: {
            margin: 20
        },
        label: {
            field: 'label',
            display: 'outside',
            fontSize: 11
		}/*

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