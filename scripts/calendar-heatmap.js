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
  var middle = width / 2,
      mid_left = middle - 75,
      mid_right = middle + 75;

  var height = 90;
  var xOffset=20;
  var calX=25;
  var calY=50;//offset of calendar in each group


  //bars variables
  var x = d3.scaleBand().rangeRound([0, 400]).paddingInner(0.06),
      y = d3.scaleLinear().rangeRound([mid_right, width-20]),
      y2 = d3.scaleLinear().rangeRound([20, mid_left]);

  var stations = ["North Ave", "Quezon", "GMA", "Araneta", "Santolan", "Ortigas", "Shaw Blvd", "Boni", "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft"]
  y.domain([0, 100000]);
  y2.domain([100000,0])
  x.domain(stations);

  var svg = d3.select("body").append("svg")
      .attr("width","80%")
      .attr("viewBox","0 0 "+(xOffset+width)+" 300")


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
        d3.selectAll(".bar").transition().duration(500).style("opacity", 0);
        d3.selectAll(".bar2").transition().duration(500).style("opacity", 0);
        d3.selectAll(".bar").remove();
        d3.selectAll(".bar2").remove();
        drawbars(d);

        })
    .on("mouseout", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", 0);


    })
    .datum(format);

  rect.append("title")
    .text(function(d) { return titleFormat(new Date(d)); });

  var lookup = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(leaves) {
      return d3.sum(leaves, function(d){ return parseInt(d.total_entry); });
    })
    .object(dateData);

    var productsById = d3.nest()
      .key(function(d) {
        return d.date;
      })
      .object(dateData)




  var scale = d3.scaleLinear()
    .domain(d3.extent(dateData, function(d) { return parseInt(d.total_entry); }))
    .range([0.2,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

  rect.filter(function(d) { return d in lookup; })
    .style("fill", function(d) { return d3.interpolateBlues(scale(lookup[d])); })

    var tables = d3.select("body").append("svg")
        .attr("width","80%")
        .attr("viewBox","0 0 "+(xOffset+width)+" 1000")

    tables.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisBottom(y))
      .attr("transform", "translate(0,400)")
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" )

  tables.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisBottom(y2))
    .attr("transform", "translate(0,400)")
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" )


  tables.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisLeft(x))
    .selectAll("text")
    .attr("x", middle+10)
      .style("text-anchor", "middle")
      .attr("dx", "-.8em")

      tables.selectAll(".bar-outline").data(stations).enter().append("rect")
          .attr("y", function(d) {
            return x(d) + 1; } )
          .attr("x", mid_right)
          .attr("fill",'#eaeaea')
          .attr("height", 22)
          .attr("width", (width - mid_right - 20));

      tables.selectAll(".bar-outline2").data(stations).enter().append("rect")
          .attr("y", function(d) {
            return x(d) + 1; } )
          .attr("x", 20)
          .attr("fill",'#eaeaea')
          .attr("height", 22)
          .attr("width", (mid_left-20));


  function drawbars(dataas){

    var station_entry = ["na_entry", "qa_entry", "gk_entry", "c_entry", "s_entry", "o_entry", "sb_entry", "ba_entry", "g_entry", "b_entry", "a_entry", "m_entry", "t_entry"]
    var station_exit = ["na_exit", "qa_exit", "gk_exit", "c_exit", "s_exit", "o_exit", "sb_exit", "ba_exit", "g_exit", "b_exit", "a_exit", "m_exit", "t_exit"]
    console.log(station_entry[0])
    tables.selectAll(".bar")
      .data(stations)
      .enter().append("rect")
        .attr("class", "bar")
        .transition()
        .duration(200)
        .style("opacity", .9)
        .attr("y",  function(d) {
          return x(d); })
        .attr("x", mid_right)
        .attr("height", 20)
        .attr("width", function (d,i) {
        var temp1 = productsById[dataas][0][station_entry[i]]
        console.log(y(temp1))
        return y(temp1)-mid_right;
        })

    tables.selectAll(".bar2")
      .data(stations)
      .enter().append("rect")
        .attr("class", "bar")
        .transition()
        .duration(200)
        .style("opacity", .9)
        .attr("y",  function(d) {
          return x(d); })
        .attr("x", function (d,i) {
        var temp1 = productsById[dataas][0][station_exit[i]]
        return y2(temp1);
        })
        .attr("height", 20)
        .attr("width", function (d,i) {
        var temp1 = productsById[dataas][0][station_exit[i]]
        return mid_left - y2(temp1);
        })

  }


}

d3.csv("data/mrt_data_new.csv", function(response){
  drawCalendar(response);
})
