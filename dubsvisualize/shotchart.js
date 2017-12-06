  import * as d3 from 'd3';

  d3.csv('./data/warriors_2016_2017.csv', function(data) {
    var xScale = d3.scaleLinear()
      .domain([-248, 246])
      .range([85, 760]);

    var yScale = d3.scaleLinear()
      .domain([-40, 743])
      .range([95, 1150]);

    var shots = d3.select('#shotchart-canvas')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
        .attr('class', 'shot')
        .attr('transform', function(d) {
          return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
        })
      .on('mouseover', function(d) {
          d3.select(this).raise()
            .append('text')
            .attr('class', 'playerName')
            .text(d.name);
          // d3.select(this).raise()
          //   .append('text')
          //   .attr('class', 'shotType')
          //   .text(d.action_type);
      })
      .on('mouseout', function(d) {
          d3.selectAll('text.playerName').remove();
          // d3.selectAll('text.shotType').remove();
      });

    shots.append("circle")
      .attr('r', 5)
      .attr('fill', function(d) {
        if (d.shot_made_flag == 1) {
          return 'green';
        } else {
          return 'red';
        }})
      .attr('stroke', 'black');

    var players = d3.nest()
      .key(function(d) { return d.name; })
      .rollup(function(arr) { return arr.length; })
      .entries(data);

    players.unshift({'key': 'ALL',
      'value': d3.sum(players, function(d) { return d.value; })
    });

    var selectedPlayer = d3.select('#selected-player');

    selectedPlayer
      .selectAll('option')
      .data(players)
      .enter()
      .append('option')
        .text(function(d) { return d.key + " : " + d.value + ' shots'; })
        .attr('value', function(d) { return d.key; });

    selectedPlayer
      .on('change', function() {
        d3.selectAll(".shot")
          .attr('opacity', 1.0);
        var value = selectedPlayer.property('value');
          if (value != 'ALL') {
            d3.selectAll('.shot')
              .filter(function(d) { return d.name != value; })
              .attr('opacity', 0.0);
          }
      });

      var onlyPlayers = players.slice(1);

      var scaleRadius = d3.scaleLinear()
          .domain([d3.min(onlyPlayers, function(d) { return +d.value; }),
                  d3.max(onlyPlayers, function(d) { return +d.value; })])
          .range([15, 100]);

      var bubbles = d3.select('#bubble-chart-canvas')
        .selectAll('g')
        .data(onlyPlayers)
        .enter()
        .append('g')
        .append('circle')
          .attr('r', function(d) {
            return scaleRadius(d.value);
          })
          .attr('fill', 'blue')
          .attr('stroke', 'black')
          .attr('transform', 'translate(' + [0, 0] + ')')

        .on('mouseover', function(d) {
            d3.select(this).raise()
              .append('text')
              .attr('class', 'playerName')
              .text(d.name);});

      var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(2))
      .force('center', d3.forceCenter(820/ 2, 643 / 2))
      .force('collision', d3.forceCollide(function(d) {
        return scaleRadius(d.value) + 1;
      }));
      // .force("x", d3.forceX(643 / 2).strength(0.05))
      // .force("y", d3.forceY(820/ 2).strength(0.05))
      // .force('collide', d3.forceCollide( function(d) {
      //   return scaleRadius(d.value) + 1;
      // }));
      // .on("tick", ticked);

      function ticked(e) {
        bubbles.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      }


      simulation.nodes(onlyPlayers)
        .on('tick', ticked);

      // var scaleRadius = d3.scaleLinear()
      //     .domain([d3.min(onlyPlayers, function(d) { return +d.value; }),
      //             d3.max(onlyPlayers, function(d) { return +d.value; })])
      //     .range([10,150]);

      // bubbles.append('circle')
      //   .attr('r', function(d) {
      //     return scaleRadius(d.value);
      //   })
      //   .attr('fill', 'blue')
      //   .attr('stroke', 'black')
        // simulation.nodes(onlyPlayers)
        //   .on('tick', 'ticked');






  });
