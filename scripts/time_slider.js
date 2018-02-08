function draw_timeview(dateData){

  //get nested data with hour as keys
  var data_all = d3.nest()
    .key(function(d) {
      return d.time;
    })
    .object(dateData)



    var width = 1000
    var height = 600

    var margin = {
        top: 10,
        bottom: 200,
        left: 70,
        right: 20
    }

    var svg = d3.select('#vis')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var data = {};

    var x_scale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var y_scale = d3.scaleLinear()
        .range([height, 0]);

    var colour_scale = d3.scaleQuantile()
        .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

    var y_axis = d3.axisLeft(y_scale);
    var x_axis = d3.axisBottom(x_scale);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')');

    svg.append('g')
        .attr('class', 'y axis');



var t = d3.transition()
    .duration(2000);


function draw(hour) {

  var months_entry = ["na_entry", "qa_entry", "gk_entry", "c_entry", "s_entry", "o_entry", "sb_entry", "ba_entry", "g_entry", "b_entry", "a_entry", "m_entry", "t_entry"]
  var months_exit = ["na_exit", "qa_exit", "gk_exit", "c_exit", "s_exit", "o_exit", "sb_exit", "ba_exit", "g_exit", "b_exit", "a_exit", "m_exit", "t_exit"]
  var months = ["North avenue", "Quezon Avenue", "GMA Kamuning", "Araneta", "Santolan", "Ortigas", "Shaw Boulevard", "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft"]


    x_scale.domain(months);

    var max_value = 200000;

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    svg.selectAll("path").remove()

    var valueline = d3.line()
        .x(function(d, i) { return x_scale(d) + 40; })
        .y(function(d, i) { return y_scale(data_all[hour][0][months_entry[i]]); });

    var valueline2 = d3.line()
        .x(function(d, i) { return x_scale(d) + 40; })
        .y(function(d, i) { return y_scale(data_all[hour][0][months_exit[i]]); });

    // Add the valueline path.
    svg.append("path")
      .transition()
      .duration(500)
        .attr("class", "line_entries")
        .attr("d", valueline(months));

    svg.append("path")
        .attr("class", "line_exits")
        .attr("d", valueline2(months));

    svg.select('.x.axis')
         .call(x_axis)
         .selectAll("text")
        .attr("transform","rotate(-90)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em");


     svg.select('.y.axis')
         .transition(t)
         .call(y_axis);

       }



var slider = d3.select('#hour');
draw(4);
slider.on('change', function() {
  console.log(this.value);
  draw(this.value)
    })
  }


  d3.csv("data/final_graph.csv", function(response){
     draw_timeview(response);
  })
