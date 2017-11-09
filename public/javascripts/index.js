(function ()	{
	$.ajax({
		type: 'get',
		url: '/files/pcaplot',
		success: function (d)	{
			var pca2d = pca2dplot();

			pca2d({
				width: 600,
				height: 400,
				data: d,
				element: '#main',
				margin: [40, 40, 40, 40]
			});

			// var pca3d = pca3dplot();

			// pca3d({
			// 	width: 600,
			// 	height: 400,
			// 	data: d,
			// 	element: '#main',
			// 	margin: [40, 40, 40, 40]
			// });
		},
		error: function (errr)	{
			console.log(errr);
		}
	})
})();