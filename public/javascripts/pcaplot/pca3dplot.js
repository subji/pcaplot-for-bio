function pca3dplot ()	{
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

	function figureList (type)	{
	 	switch(type)	{
	 		case "Primary Solid Tumor": 
	 		return drawCircle(colour(type).color); break;
	 		case "Solid Tissue Normal": 
	 		return drawRect(colour(type).color); break;
	 	}
	}

	function getMax (list, axis)	{
		return d3.max(list.map(function (d)	{
			return d[axis];
		}));
	};

	function getMin (list, axis)	{
		return d3.min(list.map(function (d)	{
			return d[axis];
		}));
	};

	function getScale (ds, de, rs, re)	{
		return d3.scaleLinear()
						 .domain([ds, de])
						 .range([rs, re]);
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

	function vector (x, y, z)	{
		return new THREE.Vector3(x, y, z);
	};

	function createFigureCanvas ()	{
		var canvas = document.createElement("canvas");
				canvas.width = 10;
				canvas.height = 10;

		return canvas;
	};

	function drawRect (color)		{
		var canvas = createFigureCanvas();
		var context = canvas.getContext("2d");
				context.fillStyle = color;
				context.fillRect(0,0,10,10);

		return canvas;
	};

	function drawCircle (color)	{
		var radius  = 5;
		var canvas  = createFigureCanvas();
		var context = canvas.getContext("2d");
				context.beginPath();
				context.arc(5, 5, radius, 0, 2 * Math.PI, false);
				context.fillStyle = color;
				context.fill();

		return canvas;
	};

	function drawTriangle (_color)	{
		var canvas  = createFigureCanvas();
		var context = canvas.getContext("2d");
		var path 		= new Path2D();

		path.moveTo(0, 5);
		path.lineTo(5, 10);
		path.lineTo(5, 0);
		path.closePath();

		context.fillStyle = _color;
		context.fill(path);

		return canvas;
	};

	var createTextCanvas = function(text)	{
		var font_size = (text.constructor === String) ? 15 : 12;
		var font_weight = (text.constructor === String) ? 
											'bold' : 'none';
		var canvas = document.createElement('canvas');
		var canvasText = canvas.getContext('2d');
		var font_definition  = font_weight + ' ' + 
													 font_size + 'px Arial';

		canvasText.font = font_definition;

		var canvasTextWidth = canvasText.measureText(text).width;
		var canvasTextHeight = Math.ceil(font_size);

		canvas.width = canvasTextWidth;
		canvas.height = canvasTextHeight;

		canvasText.font = font_definition;
		canvasText.fillStyle = (text.constructor === String) ? 
													'black' : 0xFF0000;
		canvasText.fillText(text, 0, font_size);

		return canvas;
	}

	var createCanvas = function(canvas)	{
		var plane   = new THREE.PlaneBufferGeometry(canvas.width, canvas.height);
		var texture = new THREE.Texture(canvas);

		texture.needsUpdate = true;
		texture.minFilter 	= THREE.LinearFilter;

		var spriteMaterial = new THREE.SpriteMaterial({ map : texture });
		var sprite 				 = new THREE.Sprite(spriteMaterial);
				sprite.scale.set(canvas.width, canvas.height, 1);

		return sprite;
	}

	function createFigure (figure)	{
		return createCanvas(figureList(figure));
	}

	function createText (text)	{
		return createCanvas(createTextCanvas(text));
	}

	function reformValue (json, value)	{
		return (json.constructor === Function) ? 
						json(value) : json;
	}

	function mkAxis (scene, axisList, position)	{
		var result;

		for(var i = 0, len = axisList.length ; i < len ; i++)	{
			result = createText(axisList[i]);
			result.position.x = reformValue(position.x, axisList[i]);
			result.position.y = reformValue(position.y, axisList[i]);
			result.position.z = reformValue(position.z, axisList[i]);

			scene.add(result);
		}
	}

	function calculatedAxis (period, min, max)	{
		var result = [];

		for(var i = min, l = max; i < l; i++)	{
			if(i % period === 0)	{ result.push(i); }
		}

		return result;
	};

	function setAxisList (min, max, count)	{
		var numCal 	 	= Math.floor((max - min) / count);
		var numFormat = numCal * .1;
		var numPeriod = (numFormat & 2 === 0 
											? Math.ceil(numFormat + 0.1) 
											: Math.ceil(numFormat)) * 10;

		return calculatedAxis(numPeriod, min, max);
	};

	function draw3D (opts)	{
		var xMin = getMin(opts.data, "PC1");
		var yMin = getMin(opts.data, "PC2");
		var zMin = getMin(opts.data, "PC3");
		var xMax = getMax(opts.data, "PC1");
		var yMax = getMax(opts.data, "PC2");
		var zMax = getMax(opts.data, "PC3");
		var square_size = {
			x : { start : -110, end : 110 },
			y : { start : -110, end : 110 },
			z : { start : -110, end : 110 },
		};

		var x = getScale(xMin, xMax, square_size.x.start, square_size.x.end),
				y = getScale(yMin, yMax, square_size.y.start, square_size.y.end),
				z = getScale(zMin, zMax, square_size.z.start, square_size.z.end);

		var default_axis 	= { x : 0.5, y : -0.5, z : 0 };
		var event_targets = [];
		var renderer = new THREE.WebGLRenderer({
			antialias : true, alpha : true
		});

		var camera = new THREE.OrthographicCamera(
			(opts.width / -2), (opts.width / 2)  ,
			(opts.height / 2), (opts.height / -2), -2500, 5000);

		var scene 		= new THREE.Scene();
		var object3d 	= new THREE.Object3D();
		var raycaster = new THREE.Raycaster();
		var ray_mouse = new THREE.Vector3();

		renderer.setSize(opts.width, opts.height);
		renderer.setClearColor(0xFFFFFF);

		model.element.appendChild(renderer.domElement);

		object3d.rotation.x = default_axis.x;
		object3d.rotation.y = default_axis.y;
		object3d.rotation.z = default_axis.z;

		scene.add(object3d);

		var border_geometry = new THREE.Geometry();

		border_geometry.vertices.push(
			vector(x(xMin), y(yMin), z(zMin)),
			vector(x(xMax), y(yMin), z(zMin)),
			vector(x(xMax), y(yMax), z(zMin)),
			vector(x(xMin), y(yMax), z(zMin)),
			vector(x(xMin), y(yMin), z(zMin)),
			vector(x(xMin), y(yMin), z(zMax)),
			vector(x(xMin), y(yMax), z(zMax)),
			vector(x(xMin), y(yMax), z(zMin)),
			vector(x(xMin), y(yMax), z(zMax)),
			vector(x(xMax), y(yMax), z(zMax)),
			vector(x(xMax), y(yMax), z(zMin)),
			vector(x(xMax), y(yMax), z(zMax)),
			vector(x(xMax), y(yMin), z(zMax)),
			vector(x(xMax), y(yMin), z(zMin)),
			vector(x(xMax), y(yMin), z(zMax)),
			vector(x(xMax), y(yMax), z(zMax)),
			vector(x(xMin), y(yMax), z(zMax)),
			vector(x(xMin), y(yMin), z(zMax)),
			vector(x(xMax), y(yMin), z(zMax)),
			vector(x(xMin), y(yMin), z(zMax)),
			vector(x(xMin), y(yMin), z(zMin))
			);

		var border_material = new THREE.LineBasicMaterial({
			color : 0x515151, lineWidth : 1
		});

		var border = new THREE.Line(border_geometry, border_material);
		border.type = THREE.Lines;

		object3d.add(border);

		for (var i = 0, len = opts.data.length; i < len; i ++) {
			var posX   = x(Number(opts.data[i].PC1));
			var posY   = y(Number(opts.data[i].PC2));
			var posZ 	 = z(Number(opts.data[i].PC3));
			var figure = createFigure(opts.data[i].TYPE);

			d3.select(figure).datum({
				sample : opts.data[i].SAMPLE 		,
				type 	 : opts.data[i].TYPE 			,
				pc1 	 : Number(opts.data[i].PC1),
				pc2 	 : Number(opts.data[i].PC2),
				pc3 	 : Number(opts.data[i].PC3)
			});

			figure.position.set(posX, posY, posZ);

			event_targets.push(figure);
			object3d.add( figure );
		}

		var label_x = createText("PC1(X-axis)");
		label_x.position.x = (square_size.x.end - square_size.x.start) / 2;
		label_x.position.y = (square_size.y.start - (model.margin[0] + model.margin[2]));
		label_x.position.z = (square_size.z.start);

		object3d.add(label_x);

		var label_y = createText("PC2(Y-axis)");
		label_y.position.x = (square_size.x.start - (model.margin[1] + model.margin[3]));
		label_y.position.y = (square_size.y.end - square_size.y.start) / 2;
		label_y.position.z = (square_size.z.start);

		object3d.add(label_y);

		var label_z = createText("PC3(Z-axis)");
		label_z.position.x = (square_size.x.start - (model.margin[1] + model.margin[3]));
		label_z.position.y = (square_size.y.start - (model.margin[0] + model.margin[2]));
		label_z.position.z = (square_size.z.end - square_size.z.start) / 2;

		object3d.add(label_z);

		var xAxis = setAxisList(Math.floor(xMin), Math.floor(xMax), 5);
		var yAxis = setAxisList(Math.floor(yMin), Math.floor(yMax), 5);
		var zAxis = setAxisList(Math.floor(zMin), Math.floor(zMax), 5);

		mkAxis(object3d, xAxis, {
			x : x,
			y : (square_size.y.start - model.margin[0]),
			z : (square_size.z.start)
		});

		mkAxis(object3d, yAxis, {
			x : (square_size.x.start - model.margin[1]),
			y : y,
			z : (square_size.z.start)
		});

		mkAxis(object3d, zAxis, {
			x : (square_size.x.start - model.margin[1]),
			y : (square_size.y.start - model.margin[0]),
			z : z
		});

		// var e = _event(renderer, camera, scene, object3d, raycaster, ray_mouse, event_targets, size) || null;
		// window.onmousedown = e.win_m_down;
		// window.onmouseup   = e.win_m_up;
		// window.onmousemove = e.win_m_move;

		// $("#pcaplot_view_3d canvas")
		// .on("mousemove", e.raytracingMousemove);

		renderer.render(scene, camera);

		// e.ray_render();
		// e.animate();
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

			draw3D({
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