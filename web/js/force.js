var w = 1000,
    h = 800,
    node,
    link,
    root;

var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return d._children ? -d.size / 100 : -30; })
    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
    .size([w, h - 160]);



var vis = d3.select("#graphContainer").append("svg:svg")
    .attr("width", w)
    .attr("height", h)

var tooltip = d3.select("body")
  .append("div")
  .attr("width", "400px")
  .attr("height", "200px")
  .attr("background-color", "#fff")
  .attr("border-color", "#ccc")
  .attr("color", "#5A5555")
  .text("a simple tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden");

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
      .on("mouseover", function(){
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").transition()        
        .duration(200);

        return tooltip
      })
      .on("mouseout", function(){
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