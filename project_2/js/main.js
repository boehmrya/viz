/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var margin = { left:100, right:100, top:20, bottom: 100 };

var width = 1000 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var flag = true;

var year = 0;

var yearText = year + 1800;

var t = d3.transition().duration(500);

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

// X Scale - income per capita
var x = d3.scaleLog()
	.domain([300, 150000])
  .range([0, width])
  .base(10);

// Y Scale - life expectancy
var y = d3.scaleLinear()
	.domain([0, 90])
  .range([height, 0]);

// Color Scale for continents
var color = d3.scaleOrdinal()
  .domain(["africa","americas","europe", "asia", "australasia"])
  .range(["red", "orange", "yellow", "green", "indigo"]);

// X Label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

// Y Label
var yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)");

// Bind data
d3.json("data/data.json").then(function(data){

  // X Axis
  var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat( function(d) { return "$" + d; });
  xAxisGroup.transition(t).call(xAxisCall);

  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .tickFormat( function(d) { return d; });
  yAxisGroup.transition(t).call(yAxisCall);

  // Text for the year
  g.append("text")
    .attr("class", "year")
    .attr("fill", "#aaa")
    .attr("x", width - 100)
    .attr("y", height - 30)
    .attr("font-size", "40px")
    .text(yearText.toString());

  // continually run update function
  d3.interval( function() {
    update(data);
    year += 1;
    yearText += 1;
  }, 100);

  // run the viz for the first time
  update(data);
});


function update(data) {
  // select all countries for the current year
  dataset = data[year]['countries'];

  // filter out any countries with any null values from the array for the selected year.
  dataset = dataset.filter(function (el) {
    return el.country != null && el.income != null && el.population != null & el.life_exp != null;
  });

  // Size of circle
  var size = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.population; })])
    .range([5, 25]);

  // JOIN new data with old elements
  var circles = g.selectAll("circle")
    .data(dataset, function(d) { return d.country; }); //join);

  // EXIT old elements not present in new data.
  circles.exit().remove();

  // Update old elements still present in new data.
  circles.attr("cy", function(d) { return y(d.life_exp) })
    .attr("cx", function(d) { return x(d.income) })
    .attr("r", function(d) { return size(d.population) });

  // ENTER new elements present in new data.
  circles.enter()
    .append("circle")
      .attr("fill", function(d) { return color(d.continent)})
      .attr("cy", function(d) { return y(d.life_exp) })
      .attr("cx", function(d) { return x(d.income) })
      .attr("r", function(d) { return size(d.population) })
      .append("title")
      .text(function(d) {
        return d.country;
      });

  // update the year
  g.selectAll("text.year").text(yearText.toString());

}
