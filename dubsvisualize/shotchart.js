import * as d3 from 'd3';
import * as scale from 'd3-scale';

d3.csv('./data/warriors_2016_2017.csv', function(data) {

  var xScale = d3.scaleLinear()
    .domain([-248, 246])
    .range([1, 100]);

  var yScale = d3.scaleLinear()
    .domain([-40, 743])
    .range([1, 100]);

  var shots = d3.select('svg')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
      .attr('class', 'shot')
      .attr('transform', function(d) {
        return "translate(" + xScale(d.x) * 7 + "," + yScale(d.y) * 7 + ")";
      })
    .on('mouseover', function(d) {
        d3.select(this).raise()
          .append('text')
          .attr('class', 'playerName')
          .text(d.name);
        d3.select(this).raise()
          .append('text')
          .attr('class', 'shotType')
          .text(d.action_type);
    })
    .on('mouseout', function(d) {
        d3.selectAll('text.playerName').remove();
        d3.selectAll('text.shotType').remove();
    });

  shots.append("circle")
    .attr('r', 5)
    .attr('fill', function(d) {
      if (d.shot_made_flag == 1) {
        return 'green';
      } else {
        return 'red';
      }
    });
});
