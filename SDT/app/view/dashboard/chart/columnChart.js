Ext.define('SDT.view.dashboard.chart.columnChart', {
    extend: 'Ext.chart.CartesianChart',
    alias: 'widget.columnChart',
    theme: 'default-gradients',
    axes: [{
		type: 'numeric',
		position: 'left',
		fields: 'count'
    }, {
        type: 'category',
        position: 'bottom',
        fields: 'label'
	}],
	series: {
		type: 'bar',
		xField: 'label',
        yField: 'count',
        style: {
            minGapWidth: 20
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
		}/*,
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
	}
});