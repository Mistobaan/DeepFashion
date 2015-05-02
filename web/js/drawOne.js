function isWhite(d){
	return d[0]>250 && d[1]>250 && d[2]>250
}

function drawOne(id,color,frequency){
	
	//print out ID
	d3.select("body").append("p").text(id);

	//set SVG configuration
	var svgConf = {
		//height and width
		h:300,w:150,xPad:20,yPad:10,barPad:0.1,whiteCut:0.1,brickPad:1
	};
	var height = svgConf.h-2*svgConf.yPad, width = svgConf.w-2*svgConf.xPad;

	//calculate scales
	var xScale = d3.scale.ordinal()
		.domain(d3.range(frequency.length))
		.rangeBands([0,width],svgConf.barPad);
	var yMax = d3.max(frequency, function(d,i){ return isWhite(color[i]) ? d/2 : d;});
	var yScale = d3.scale.linear()
		.domain([0,yMax])
		.range([0,height]);

	//create svg
	var svg = d3.select("body").append("svg")
		.attr("height",svgConf.h)
		.attr("width",svgConf.w)
		.attr("id",id);

	//draw bar
	var bar = svg.selectAll(".bar").data(frequency).enter();

	bar.append("rect")
	/*.attr("fill", function(d,i){
		return "rgb("+Math.round(color[i][0])+","+Math.round(color[i][1])+","+Math.round(color[i][2])+")";
	})*/
	.attr("fill","")
	.attr("class","bar")
	.attr("height",function(d,i){return isWhite(color[i])
										? yScale(svgConf.whiteCut*d)	//cut the height of white bars
										: yScale(d);})
	.attr("width",xScale.rangeBand)
	.attr("x",function(d,i){return xScale(i);})
	.attr("y",function(d,i){return isWhite(color[i])
									? svgConf.h-svgConf.yPad-yScale(svgConf.whiteCut*d)
									: svgConf.h-svgConf.yPad-yScale(d);});

	//draw block
	var block = svg.selectAll("block").data(color).enter();

	block.append("rect")
	.attr("fill",function(d){
		return "rgb("+Math.round(d[0])+","+Math.round(d[1])+","+Math.round(d[2])+")"
	})
	.attr("height",xScale.rangeBand)
	.attr("width",xScale.rangeBand)
	.attr("x",function(d,i){
		return xScale(i);
	})
	.attr("y", svgConf.h-svgConf.yPad-svgConf.brickPad);
}
