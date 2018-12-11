/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:100, right:10, top:10, bottom:150 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

var g = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + ","
        + margin.top + ")");


var xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0, " + height + ")");


var yAxisGroup = g.append("g")
  .attr("class", "y-axis");


// X Scale
var x = d3.scaleBand()
  .range([0,width])
  .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
  .range([height,0]);


// X Label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month");

// Y Label
var yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");


// load revenue data
d3.json("data/revenues.json").then(function(data) {

  // convert revenue data to integers
  data.forEach(function(d) {
    d.revenue = parseFloat(d.revenue);
    d.profit = parseFloat(d.profit);
  });

  d3.interval( function() {
    var newData = flag ? data : data.slice(1);

    update(newData);
    flag = !flag;
  }, 1000);

  // run the vis for the first time
  update(data);

}).catch(function(error) {
  console.log(error);
})


function update(data) {
  var value = flag ? "revenue" : "profit";

  // update domains
  x.domain(data.map( function(d) { return d.month; }));
  y.domain([0, d3.max(data, function(d) { return d[value]; })]);

  // X Axis
  var xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);

  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .tickFormat( function(d) { return "$" + d; });
  yAxisGroup.transition(t).call(yAxisCall);

  // JOIN new data with old elements
  var circles = g.selectAll("circle")
    .data(data, function(d) {
      return d.month;
    });


  // EXIT old elements not present in new data.
  circles.exit()
    .attr("fill", "red")
  .transition(t)
    .attr("cy", y(0))
    .remove();


  // ENTER new elements present in new data.
  circles.enter()
    .append("circle")
      .attr("fill", function(d) { return color(d.continent)})
      .attr("cy", y(0))
      .attr("cx", function(d) { return x(d.month) })
      .attr("r", 5)
      // AND UPDATE old elements present in new data.
      .merge(circles)
      .transition(t)
        .attr("cx", function(d) { return x(d.month) })
        .attr("cy", function(d) { return y(d[value]); })

  var label = flag ? "Revenue" : "Profit";
  yLabel.text(label);
}
