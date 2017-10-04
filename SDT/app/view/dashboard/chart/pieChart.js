﻿Ext.define('SDT.view.dashboard.chart.pieChart', {
    extend: 'Ext.chart.PolarChart',
	alias: 'widget.pieChart',
    controller: undefined,
	theme: 'default-gradients',
	insetPadding: 50,
	innerPadding: 20,
	interactions: ['rotate'],
	sprites: [],
	series: [{
		type: 'pie',
        angleField: 'count',
        label: {
            field: 'label',
            display: 'rotate'
		},
		highlight: true,
		tooltip: {
			trackMouse: true,
			renderer : function (tooltip, record, item) {
				tooltip.setHtml(record.get('label') + ': ' + record.get('count') + '%');
			}
        }//,
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