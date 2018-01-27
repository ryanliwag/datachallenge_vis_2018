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

  var svg = d3.select("#chart").append("svg")
      .attr("width","70%")
      .attr("viewBox","0 0 "+(xOffset+width)+" 300")


    // Define the div for the tooltip-calendar
    var div_c = d3.select("#chart").append("div")
        .attr("class", "tooltip-calendar")
        .style("opacity", 0);

    var div = d3.select("chart").append("div")
        .attr("class", "tooltip-bar")
        .style("opacity", 0);

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



  svg_months.selectAll("rect.day-background")
   .data(function(d, i) {
     return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
   .enter().append("rect")
   .attr("class", "dayback")
   .attr("width", cellSize-2)
   .attr("height", cellSize-2)
   .attr("rx", 3).attr("ry", 3) // rounded corners
   .attr("fill", '#282828') // default light grey fill
   .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin + calY; })
   .attr("x", function(d) {
     return xOffset+calX+(week(d) * cellSize) ;})


  var rect = svg_months.selectAll("rect.day")
    .data(function(d, i) {
      return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize -5)
    .attr("height", cellSize - 5)
    .attr("rx", 3).attr("ry", 3) // rounded corners
    .attr("fill", '#eaeaea') // default light grey fill
    .attr("y", function(d) { return (day(d) * cellSize + 1) + (day(d) * cellMargin) + cellMargin + calY; })
    .attr("x", function(d,i) {
      return xOffset+calX+(week(d) * cellSize + 1) ;})
    .on("mouseover", function(d) {
      var xPos = +d3.select(this).attr("x")
      var wid = +d3.select(this).attr("width");
      d3.select(this).attr("width", wid + 5).attr("height", wid + 5);

      div_c.transition()
                .duration(500)
                .style("opacity", .9);

      if (productsById[d][0]["station"]){

      console.log("yo")
      }

      div_c.html( "<b>Date:</b> " + productsById[d][0]["date"] +"<br />"
                  +"<b>Total Entries:</b> " + productsById[d][0]["total_entry"] +"<br />"
                  +"<b>Total Exit:</b> " + productsById[d][0]["total_exit"] +"<br />"
                  +"<b>Holiday:</b> " + productsById[d][0]["holiday_reason"] +"<br />"
                  +"<b>Precipitation:</b> " + productsById[d][0]["precip"] +"<br />"
                  +"<b>Mrt Breakdown: </b> " + productsById[d][0]["station"]  +"<br />"
                  + "<b>Train Direction: </b> " + productsById[d][0]["dir"]  +"<br />"
                  +"<b>Breakdown Time: </b> " + productsById[d][0]["time"] +"<br />"
                  +"<b>Breakdown Reason: </b> " + productsById[d][0]["reason"] +"<br />")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
        })
    .on("mouseout", function(d) {
      d3.select(this).attr("width", cellSize - 5).attr("height", cellSize - 5);

      div_c.transition()
      .duration(500)
      .style("opacity", 0);
    })
    .on('click', function(d) {
      d3.selectAll(".bar").transition().duration(500).style("opacity", 0);
      d3.selectAll(".bar2").transition().duration(500).style("opacity", 0);
      d3.selectAll(".bar").remove();
      d3.selectAll(".bar2").remove();
      drawbars(d);
     })
    .datum(format);




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

  var lookup_h = d3.nest()
    .key(function(d) { return d.holiday; })
    .object(dateData);

  var lookup_b = d3.nest()
    .key(function(d) { return d.date_break; })
    .object(dateData);

  var scale = d3.scaleLinear()
    .domain(d3.extent(dateData, function(d) { return parseInt(d.total_entry); }))
    .range([0.2,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme



  var reg = rect.filter(function(d) {
    return d in lookup; })
    .attr("id", "redLine")
    .style("fill", function(d) {
        return d3.interpolateLab("lightblue","#3500d3")(scale(lookup[d])); })




        svg.append("text")
        	.attr("x", 100)
        	.attr("y", 30)
        	.attr("class", "legend")
        	.text("Holidays");

        svg.append("rect")
        .attr("x", 75)
        .attr("y", 17)
        .attr("width", cellSize -5)
        .attr("height", cellSize - 5)
        .attr("rx", 3).attr("ry", 3) // rounded corners
        .attr("fill", '#eaeaea') // default light grey fill
        .on("click", function(){
          // Determine if current line is visible
          var active   = redLine.active ? false : true ,
            filler = active ? function(d) {
                return d3.interpolateLab("lightblue","#3500d3")(scale(lookup[d])); }:"red";
          // Hide or show the elements
          rect.filter(function(d) {
            return d in lookup_h; })
            .attr("id", "redLine")
            .style("fill", filler)
              .style("opacity", 1);
          // Update whether or not the elements are active
          redLine.active = active;
        })



        svg.append("text")
        	.attr("x", 200)
        	.attr("y", 30)
        	.attr("class", "legend")
        	.style("fill", "red")
        	.on("click", function(){
        		// Determine if current line is visible
        		var active   = redLine.active ? false : true ,
              filler = active ? function(d) {
                  return d3.interpolateLab("lightblue","#3500d3")(scale(lookup[d])); }:"orange";
        		// Hide or show the elements
            rect.filter(function(d) {
              return d in lookup_b; })
              .attr("id", "redLine")
              .style("fill", filler)
                .style("opacity", 1);
        		// Update whether or not the elements are active
        		redLine.active = active;
        	})
        	.text("Mrt Breaks");



    var tables = d3.select("#chart").append("svg")
      .attr("width","70%")
      .attr("viewBox","0 0 "+(xOffset+width)+" 700")

    tables.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisBottom(y))
      .attr("transform", "translate(0,400)")
      .style("fill", "rgb(153, 161, 226)")
      .selectAll("text")
        .style("text-anchor", "end")
        .style("fill", "rgb(153, 161, 226)")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" )

  tables.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisBottom(y2))
    .attr("transform", "translate(0,400)")
    .style("fill", "rgb(153, 161, 226)")
    .selectAll("text")
      .style("text-anchor", "end")
      .style("fill", "rgb(153, 161, 226)")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" )


  tables.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisLeft(x))
    .selectAll("text")
    .attr("x", middle+10)
      .style("text-anchor", "middle")
      .style("fill", "rgb(153, 161, 226)")
      .attr("dx", "-.8em")

      tables.selectAll(".bar-outline").data(stations).enter().append("rect")
          .attr("y", function(d) {
            return x(d) + 1; } )
          .attr("x", mid_right)
          .attr("fill",'#282828')
          .attr("height", 22)
          .attr("width", (width - mid_right - 20));

      tables.selectAll(".bar-outline2").data(stations).enter().append("rect")
          .attr("y", function(d) {
            return x(d) + 1; } )
          .attr("x", 20)
          .attr("fill",'#282828')
          .attr("height", 22)
          .attr("width", (mid_left-20));


  function drawbars(dataas){

    var station_entry = ["na_entry", "qa_entry", "gk_entry", "c_entry", "s_entry", "o_entry", "sb_entry", "ba_entry", "g_entry", "b_entry", "a_entry", "m_entry", "t_entry"]
    var station_exit = ["na_exit", "qa_exit", "gk_exit", "c_exit", "s_exit", "o_exit", "sb_exit", "ba_exit", "g_exit", "b_exit", "a_exit", "m_exit", "t_exit"]


    var lols = tables.selectAll(".bar")
          .data(stations)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("y",  function(d) {
              return x(d); })
            .attr("height", 20)


      lols.transition()
                .duration(300)
                .attr("width", function (d,i) {
                var temp1 = productsById[dataas][0][station_entry[i]]
                return y(temp1)-mid_right;
              })
              .attr("x", mid_right)

      lols.on("mouseover", function(d,i) {
        div.transition()
        .duration(200)
        .style("opacity", .9);
        div	.html(d)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

      }).on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });




    var lols2 = tables.selectAll(".bar2")
      .data(stations)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("y",  function(d) {
          return x(d); })
        .attr("height", 20)


        lols2.transition()
            .duration(300)
            .attr("x", function (d,i) {
            var temp1 = productsById[dataas][0][station_exit[i]]
            return y2(temp1);
            })
            .attr("width", function (d,i) {
            var temp1 = productsById[dataas][0][station_exit[i]]
            return mid_left - y2(temp1);
            })

        lols2.on("mouseover", function(d,i) {
          div.transition()
          .duration(200)
          .style("opacity", .9);
          div	.html(d)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");

        }).on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
          });

  }


}

d3.csv("data/mrt_data_new.csv", function(response){
  drawCalendar(response);
})
