// draw bar chart

function isWhite(d){
  return d[0]>250 && d[1]>250 && d[2]>250
}

function drawOne(id,color,frequency){
  
  //print out ID
  // d3.select("body").append("p").text(id);

  //set SVG configuration
  var svgConf = {
    //height and width
    h: 200, w:200,xPad:10,yPad:10,barPad:0.1,whiteCut:0.1,brickPad:1
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
  var barContainer = d3.select("#barContainer");
  var svg = barContainer.append("svg")
    .attr("height",svgConf.h)
    .attr("width",svgConf.w)
    .attr("id",id);

  //draw bar
  var bar = svg.selectAll(".bar").data(frequency).enter();

  bar.append("rect")
  /*.attr("fill", function(d,i){
    return "rgb("+Math.round(color[i][0])+","+Math.round(color[i][1])+","+Math.round(color[i][2])+")";
  })*/
  .attr("fill","#5A5555")
  .attr("class","bar")
  .attr("height",function(d,i){return isWhite(color[i])
                    ? yScale(svgConf.whiteCut*d)  //cut the height of white bars
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










// draw tree

var w = 800,
    h = 800,
    node,
    link,
    root;

var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return d._children ? -d.size / 100 : -30; })
    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
    .size([w, h - 160]);



var treeGraph = d3.select("#machineLearning")
    .append("div").attr("id", "graphContainer");

var vis = treeGraph
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var tooltip = d3.select("#machineLearning")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden");;

var imgContainer = tooltip.append("div")
  .attr("id", "imgContainer");

tooltipH = tooltip.append("h2");
var barContainer = tooltip.append("div")
  .attr("id", "barContainer");





root = data;
root.fixed = true;
root.x = w / 2;
root.y = h / 2 - 80;
d3.select()
update();

function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update the links…
  link = vis.selectAll("line.link")
      .data(links, function(d) { return d.target.distance ? d.target.distance : d.target.id; });

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Exit any old links.
  link.exit().remove();

  // Update the nodes…
  node = vis.selectAll("circle.node")
      .data(nodes, function(d) { return d.id; })
      .style("fill", color);

  node.transition()
      .attr("r", function(d) { return size(d); }); //d.children ? 4.5 : Math.sqrt(d.size) / 10

  // Enter any new nodes.
  node.enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return size(d); }) //d.children ? 4.5 : Math.sqrt(d.size) / 10
      .style("fill", color)
      .on("click", click)
      .call(force.drag)
      .on("mouseover", function(d){
        d3.select(this).attr("r", function(d) { return 2 * size(d);  });
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(d){
        // tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").transition()        
        // .duration(200);

        if (d.children){
          id = "bar" + d.name
          frequency = d.distribution
          colorDist = d.color
          imgContainer.html("")
          barContainer.html("")
          drawOne(id,colorDist,frequency) 

        }
        else{
          category = d.category
          id = "bar" + d.name
          frequency = d.distribution
          colorDist = d.color

          imgRoot = "http://www.deepfashion.org/image/lg-"
          imgEnd = ".jpg"
          imgContainer.html("<img src='" + imgRoot + d.name + imgEnd + "' alt=''>")
          barContainer.html("")
          drawOne(id,colorDist,frequency) 

        }




        return tooltip
      })
      .on("mouseout", function(d){
        d3.select(this).attr("r", function(d) { return size(d);  });

        return tooltip.style("visibility", "hidden");
      });

  // Exit any old nodes.
  node.exit().remove();
}

// mouseover = function(d) {
//   this.text.attr('transform', 'translate(' + d.x + ',' + (d.y - 5 - (d.children ? 3.5 : Math.sqrt(d.size) / 2)) + ')')
//     .text(d.name + ": " + d.size + " loc")
//     .style('display', null);
// };

// mouseout = function(d) {
//   this.text.style('display', 'none');
// };



function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function size(d){
  return d._children? (d.size > 10? (d.size < 200? d.size: 100): 8) : 6;
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#70374D" : d.children ? "#d6d1d0" : "#D78A9F";
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}