function drawCalendar(dateData){

  var weeksInMonth = function(month){
    var m = d3.timeMonth.floor(month)
    return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
  }

  var minDate = d3.min(dateData, function(d) { return new Date(d.date) })
  var maxDate = d3.max(dateData, function(d) { return new Date(d.date) })

  var cellMargin = 5,
      cellSize = 20;

  var width = 1100;
  var height = 90;
  var xOffset=20;
  var calX=25;
  var calY=50;//offset of calendar in each group

  //bars variables
  var y = d3.scaleLinear().rangeRound([0, 500]);
  y.domain([0, d3.max(dateData, function(d) { return parseInt(d.na_entry) })]);



  var svg = d3.select("body").append("svg")
      .attr("width","90%")
      .attr("viewBox","0 0 "+(xOffset+width)+" 300")

  function drawbar(dataas){

    svg.selectAll(".bar")
      .data(dateData)
      .enter().append("rect")
        .attr("class", "bar")
        .transition()
        .duration(200)
        .delay(function (d, i) {
        return i * 50;
        })
        .attr("y", 240)
        .attr("x", 200)
        .attr("height", 30)
        .attr("width", y(dataas))
  }




  var day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      month = d3.timeFormat("%m")
      format = d3.timeFormat("%Y-%m-%d"),
      titleFormat = d3.utcFormat("%a, %d-%b");
      monthName = d3.timeFormat("%B"),
      months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

  var svg_months = svg.selectAll("g")
    .data(months)
    .enter().append("g")
    .attr("class", "month")
    .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) ) // the 20 is for the month labels
    .attr("width", function(d) {
      var columns = weeksInMonth(d);
      return ((cellSize * columns) + (cellMargin * (columns + 2)));
    })
    .append("g")

  // draw day labels
  var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  var dayLabels=svg.append("g").attr("id","dayLabels")
  days.forEach(function(d,i)    {
      dayLabels.append("text")
      .attr("class","day-name")
      .attr("x",xOffset)
      .attr("y",function(d) { return calY+(i * cellSize * cellMargin + 30) /4; })
      .attr("dy","0.9em")
      .text(d);
  })

  svg_months.append("text")
    .attr("class", "month-name")
    .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 + calY )
    .attr("x",
      function(d) {return (month(d) * cellSize * 4.2)}
    )
    .attr("text-anchor", "middle")
    .text(function(d) { return monthName(d); })

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  var rect = svg_months.selectAll("rect.day")
    .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 3).attr("ry", 3) // rounded corners
    .attr("fill", '#eaeaea') // default light grey fill
    .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin + calY; })
    .attr("x", function(d) {return xOffset+calX+(week(d) * cellSize) ;})
    .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div	.html(d + "<br/>"  + lookup[d])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

        drawbar(lookup[d]);
        })
    .on("mouseout", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);

        d3.selectAll(".bar").remove();
    })
    .datum(format);

  rect.append("title")
    .text(function(d) { return titleFormat(new Date(d)); });

  var lookup = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(leaves) {
      return d3.sum(leaves, function(d){ return parseInt(d.na_entry); });
    })
    .object(dateData);

  var scale = d3.scaleLinear()
    .domain(d3.extent(dateData, function(d) { return parseInt(d.na_entry); }))
    .range([0.2,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

  rect.filter(function(d) { return d in lookup; })
    .style("fill", function(d) { return d3.interpolateBlues(scale(lookup[d])); })
    .select("title")
    .text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });


}

d3.csv("data/mrt_data_new.csv", function(response){
  drawCalendar(response);
})
