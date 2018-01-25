

//import csv files

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 100, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    middle = +svg.attr("width") / 2,
    mh = +svg.attr("height") /2;


    // bounds the data
var x = d3.scaleBand().rangeRound([0, mh]).paddingInner(0.1),
    y = d3.scaleLinear().rangeRound([middle, width]),
    y2 = d3.scaleLinear().rangeRound([0, middle-100]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/data.csv", function(d){
  return {
    date : d.date,
    value : +d.close
  };
}, function(data){
  //this maps the x axis
  y.domain([0, d3.max(data, function(d) { return d.value })])
  y2.domain([d3.max(data, function(d) { return d.value }),0])
  //this maps the y axis
  x.domain(data.map(function(d) { return d.date; }));

  g.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisLeft(x))
    .selectAll("text")
    .attr("x", middle)
      .attr("dx", "-.8em")

  g.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisBottom(y2))
    .attr("transform", "translate(0," + middle +")")
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" )


  g.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisBottom(y))
    .attr("transform", "translate(0," + middle +")")
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" )

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .transition()
      .duration(200)
      .delay(function (d, i) {
      return i * 50;
      })
      .attr("y", function(d) { return x(d.date); })
      .attr("x", middle)
      .attr("height", x.bandwidth())
      .attr("width", function(d) { return width - y(d.value); })

  g.selectAll(".bar2")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .transition()
      .duration(150)
      .delay(function (d, i) {
      return i * 50;
      })
      .attr("y", function(d) { return x(d.date); })
      .attr("x", function(d){return 380 - y2(d.value)})
      .attr("height", x.bandwidth())
      .attr("width", function(d) { return y2(d.value); })
});

var nested_data = d3.nest()
.key(function(d) { return d.status; })
.key(function(d) { return d.priority; })
.rollup(function(leaves) { return {"length": leaves.length, "total_time": d3.sum(leaves, function(d) {return parseFloat(d.time);})} })
.entries(csv_data);
