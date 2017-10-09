Ext.define('SDT.view.dashboard.chart.barChart', {
    extend: 'Ext.chart.CartesianChart',
    alias: 'widget.barChart',
    theme: 'default-gradients',
    flipXY: true,
    insetPadding: 15,
    axes: [{
        type: 'category',
        position: 'left',
        rotate: {
            degrees: -45
        },
        fields: ['label']
    }, {
		type: 'numeric',
        position: 'bottom',
		fields: ['count']
	}],
	series: [{
        type: 'bar',
        axis: 'bottom',
		xField: 'label',
        yField: 'count',
        style: {
            minGapWidth: 10
        },
        highlight: {
            strokeStyle: 'black',
            fillStyle: 'gold'
        },
        label: {
            field: 'count',
            display: 'insideEnd',
			renderer: function (v) {
                return v.toFixed(1);
			}
		},
		tooltip: {
			trackMouse: true,
			renderer: function(tooltip, record, item) {
				var formatString = '0';

				tooltip.setHtml(record.get('label') + ': ' +
					Ext.util.Format.number(record.get('count'), formatString));
				}
		}
	}]
});