Ext.define('SDT.view.dashboard.chart.columnChart', {
    extend: 'Ext.chart.CartesianChart',
    alias: 'widget.columnChart',
	insetPadding: 40,
	interactions: {
		type: 'itemedit',
		style: {
			lineWidth: 2
		},
		tooltip: {
			renderer: function (tooltip, item, target, e) {
				var formatString = '0',
				record = item.record;

				tooltip.setHtml(record.get('label') + ': ' +
				Ext.util.Format.number(target.yValue, formatString));
			}
		}
	},
	animation: {
		easing: 'easeOut',
		duration: 500
	},
	axes: [{
		type: 'numeric',
		position: 'left',
		fields: 'count',
		grid: true,
		maximum: 40,
		majorTickSteps: 10,
		title: 'Y Axes Title',
		renderer: function (axis, label, layoutContext) {
			return Ext.util.Format.number(layoutContext.renderer(label), '0');
		}
	}, {
		type: 'category',
		position: 'bottom',
		fields: 'label',
		grid: true
	}],
	series: [{
		type: 'bar',
		xField: 'label',
		yField: 'count',
		style: {
			opacity: 0.80,
			minGapWidth: 10
		},
		highlightCfg: {
			strokeStyle: 'black',
			radius: 10
		},
		label: {
			field: 'ind',
			display: 'insideEnd',
			renderer: function (v) {
				return Ext.util.Format.number(v, '0');
			}
		},
		tooltip: {
			trackMouse: true,
			renderer: function(tooltip, record, item) {
				var formatString = '0';

				tooltip.setHtml(record.get('label') + ': ' +
					Ext.util.Format.number(record.get('count'), formatString));
				}
		},
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

			
          }
	}],
	sprites: []
});