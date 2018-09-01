/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:100, right:10, top:10, bottom:150 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + ","
        + margin.top + ")");


// X Label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month");

// Y Label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");


// load revenue data
d3.json("data/revenues.json").then(function(data) {
  console.log(data);

  // convert revenue data to integers
  data.forEach(function(d) {
    d.revenue = parseFloat(d.revenue);
  });

  // X Scale
  var x = d3.scaleBand()
    .domain(data.map( function(d) {
      return d.month;
    }))
    .range([0,width])
    .paddingInner(0.3)
    .paddingOuter(0.3);


  // Y Scale
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.revenue;
    })])
    .range([height,0]);


  // X Axis
  var xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxisCall)
    .selectAll("text")
      .attr("y", "15")
      .attr("text-anchor", "middle");


  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat( function(d) {
      return "$" + d;
    });
  g.append("g")
    .attr("class", "y-axis")
    .call(yAxisCall);


  // Build rectangles
  var rects = g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", function(d) {
      return y(d.revenue);
    })
    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("width", x.bandwidth)
    .attr("height", function(d) {
      return height - y(d.revenue);
    })
    .attr("fill", function(d) {
      return "grey";
    });

}).catch(function(error) {
  console.log(error);
})
