// Set the dimensions of the canvas / graph

down vote
var menu = {
      "nodes": [
            {id: 0, "x": 300, "y": 250, "url": "newProject()", "text": "New Project", "bcolor": "#000099", "color": "white", "dx":-40},
            {id: 1, "x": 300, "y": 10, "url": "search('project')", "text": "Project", "bcolor": "#FF9900", "color": "black", "dx":-30},
            {id: 2, "x": 10, "y": 400, "url": "search('customer')","text": "Customer", "bcolor": "#FF9900", "color": "black", "dx":-40},
            {id: 3, "x": 600, "y": 400, "url": "search('unit')","text": "Unit Title", "bcolor": "#FF9900", "color": "black", "dx":-30}]};

var width = 900, height = 600;

var svg = d3.select("#projectMenu").append("svg")
    .attr("width", width)
    .attr("height", height);

var w = 200, h = 100;
var node = svg.selectAll(".node")
        .data(menu.nodes)
        .enter().append("g")
            .attr("class", "node");

node.append("rect")
            .attr("width", w)
            .attr("height", h)
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", function(d) {return d.bcolor;});
