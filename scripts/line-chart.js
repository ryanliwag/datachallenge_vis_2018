var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 100},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

d3.csv("data/mrt_data_new_2.csv", type, function(error, data) {
  if (error) throw error;

  var cities = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    280000,
    450000
  ]);

  var area = d3.area()
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(temperature); });

  z.domain(cities.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axisRed")
      .call(d3.axisLeft(y));


  g.append("line")
      .style("stroke", "rgb(153, 161, 226)")
      .attr("x1", 0)     // x position of the first end of the line
      .attr("y1", y(350000))      // y position of the first end of the line
      .attr("x2", width-20)     // x position of the second end of the line
      .attr("y2", y(350000))    // y position of the second end of the line

  g.append("text")
      .attr("x", 500)     // x position of the first end of the line
      .attr("y", y(350000) -5)      // y position of the first end of the line
      .text("MRT Capacity 350,000")
      .style("fill", "rgb(153, 161, 226)")

  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", "rgb(153, 161, 226)");

});

function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}
