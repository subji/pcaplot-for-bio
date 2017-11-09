function pca2dplot ()	{
	'use strict';

	var model = {};

	function figureList (type)	{
	 	switch(type)	{
	 		case "Primary Solid Tumor": 
	 		return { figure: "circle" }; break;
	 		case "Solid Tissue Normal": 
	 		return { figure: "rect" }; break;
	 	}
	}

	function getTypeList (data)	{
		var result = [],
				obj = {},
				idx = 0;

		for (var i = 0, l = data.length; i < l; i++)	{
			if (!obj[data[i].TYPE])	{
				result[idx] = { name: data[i].TYPE };
				obj[data[i].TYPE] = 'T';
				idx++;
			}
		}
		
		return { type_list: result };
	};

	function typeToString (obj)	{
		return Object.prototype.toString.call(obj)
								 .replace(/\[object |\]/g, '');
	};

	function getElement (element)	{
		var toStr = typeToString(element);
		
		if (toStr === 'String')	{
			return document.querySelector(element);
		} else if (toStr.indexOf('HTML') > -1)	{
			return element;
		} else { return null; }
	};

	var getMax = function (list, axis)	{
		return d3.max(list.map(function (d)	{
			return d[axis];
		}));
	};

	var getMin = function (list, axis)	{
		return d3.min(list.map(function (d)	{
			return d[axis];
		}));
	};

	function getScale (list)	{
		var xMin = getMin(list, 'PC1'),
				xMax = getMax(list, 'PC1'),
				yMin = getMin(list, 'PC2'),
				yMax = getMax(list, 'PC2');

		return {
			x: d3.scaleLinear()
					 .domain([xMin, xMax])
					 .range([model.margin[1], model.size.plot.width - model.margin[3]]),
			y: d3.scaleLinear()
					 .domain([yMin, yMax])
					 .range([model.size.plot.height - model.margin[2], model.margin[0]])
		};
	};

	function makeSVG (area, width, height)	{
		return d3.select(area).append('svg')
						 .attr('id', 'pca2dplot_plot_svg')
						 .attr('width', width)
						 .attr('height', height);
	};

	function setAxis (scale, ticks, way)	{
		return d3['axis' + (way === 1 ? 'Bottom' : 'Left')]
					(scale).ticks(ticks);
	};

	function setShape (data, x, y, svg, type)	{
		switch(type)	{
			case "circle": return circles(data, x, y, svg); break;
			case "rect": return rectangle(data, x, y, svg); break;
			case "triangle": return triangle(data, x, y, svg); 
			break;
		}
	};

	function circles (data, x, y, svg)	{
		return svg.append('circle')
							.attr('class', 'pca2dplot_circles')
							.attr('cx', data.x(x))
							.attr('cy', data.y(y))
							.attr('r', data.radius);
	}

	function rectangle (data, x, y, svg)	{
		return svg.append('rect')
							.attr('class', 'pca2dplot_rects')
							.attr('x', data.x(x) - data.radius)
							.attr('y',  data.y(y) - data.radius)
							.attr('width', data.radius * 2)
							.attr('height', data.radius * 2);
	}

	function triangle (data, x, y, svg)	{
		return svg.append('path')
							.attr('class', 'pca2dplot_triangles')	
							.attr('d', d3.svg.symbol().type('triangle-up'))
							.attr('tranform', 
								'translate(' + data.x(x) +  ', ' + 
								data.y(y) + ')');
	}

	function colour (value)	{
		switch(true)	{
			case (/Primary Solid Tumor/i).test(value) : 
				return { 
					name: "Primary Solid Tumor", 
					color: "#F64747" }; break;
			case (/Solid Tissue Normal/i).test(value) : 
				return { 
					name: "Solid Tissue Normal", 
					color: "#446CB3" }; break;	
		}
	}

	function draw2D (opts)	{
		console.log(opts);
		var svg = makeSVG(model.element, opts.width, opts.height);
		var xAxis = setAxis(opts.x, 5, 1),
				yAxis = setAxis(opts.y, 5, 2);

		svg.append('g')
			 .attr('class', 'pca2dplot_label_x')
			 .attr('transform', 
			 	'translate(' + (opts.width / 2.25) + ', ' + 
			 	(opts.height - model.margin[0] / 3) + ')')
			 .append('text')
			 .text('PC1');

		svg.append('g')
		.attr('class', 'pca2dplot_label_y')
		.attr('transform', 
					'translate(' + (model.margin[1] / 2) + 
									', ' + (opts.height / 2) + ')')
		.append('text')
		.text('PC2')
		.attr('transform', 'rotate(-90)');

		svg.append('g')
			 .attr('class', 'pca2dplot_xaxis')
			 .attr('transform', 
			 			 'translate(0, ' + 
			 			 (opts.height - model.margin[2]) + ')')
			 .call(xAxis);

		svg.append('g')
			 .attr('class', 'pca2dplot_yaxis')
			 .attr('transform', 
			 			 'translate(' + model.margin[1] + ', 0)')
			 .call(yAxis);

		for (var i = 0, l = opts.data.length; i < l; i++)	{
			var pca = opts.data[i];

			setShape(opts, pca.PC1, pca.PC2, svg, 
			figureList(pca.TYPE).figure)
			.data([pca])
			.style('stroke', function (d)	{
				return colour(pca.TYPE).color;
			})
			.style('fill', function (d)	{
				return colour(pca.TYPE).color;
			});
		}
	};

	return function (opts)	{
		model.element = getElement(opts.element);
		model.margin = opts.margin;
		model.size = {
			plot: {
				width: opts.width,
				height: opts.height,
			}
		};

		d3.tsv('/files/pcaplot', function (d)	{
			var data = {
				title: 'pca_plot',
				sample_list: d,
			};

			var scale = getScale(d);
			var type_list = getTypeList(data.sample_list);

			draw2D({
				data: d,
				width: opts.width,
				height: opts.height,
				type: type_list,
				x: scale.x,
				y: scale.y,
				radius: 5,
			});
		})
	};
};