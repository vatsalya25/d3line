'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.D3lineDirective = D3lineDirective;

function D3lineDirective($window, $log) {
  'ngInject';

  var directive = {
    restrict: 'E',
    scope: {
      data: '=',
      width: '=',
      height: '='
    },
    template: '<div class="chart-container"></div>',
    link: linkFunc
  };

  return directive;

  function linkFunc(scope, el) {
    var data = scope.data,
      padding = 20;
    var xScale, yScale, xAxisGen, yAxisGen, lineFun, svg;
    var margin = {
      top: 20,
      right: 30,
      bottom: 20,
      left: 30
    };
    var colors = ['steelblue', 'green', 'red', 'purple', 'yellow', 'cyan', 'magenta', 'violet', 'indigo', 'orange'];

    var width = scope.width - margin.left - margin.right;
    var height = scope.height - margin.top - margin.bottom;
    var d3 = $window.d3;
    var rawContainer = el.find('.chart-container');
    var container = d3.select(rawContainer[0]);

    var dataGroup = d3.nest()
      .key(function(d) {
        return d.series;
      })
      .entries(data);

    var xMin = d3.min(data, function(d) {
        return d.x;
      }),
      xMax = d3.max(data, function(d) {
        return d.x;
      }),
      yMin = d3.min(data, function(d) {
        return d.y;
      }),
      yMax = d3.max(data, function(d) {
        return d.y;
      });

    var setChartParameters = function setChartParameters() {
      svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xScale = d3.scale.linear()
        .domain([xMin, xMax])
        .range([padding, width - padding]);

      yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height + padding, 0]);

      xAxisGen = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

      yAxisGen = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

      lineFun = d3.svg.line()
        .x(function(d) {
          return xScale(d.x);
        })
        .y(function(d) {
          return yScale(d.y);
        })
        .interpolate("basis");
    };

    var drawLineChart = function drawLineChart() {
      setChartParameters();
      var colorCounter = 0;

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + margin.top) + ")")
        .call(xAxisGen);

      svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxisGen);

      dataGroup.forEach(function(d, i) {
        svg.append('path')
          .attr('d', lineFun(d.values))
          .attr('stroke', function(d, j) {
            return colors[colorCounter++];
          })
          .attr('stroke-width', 2)
          .attr('fill', 'none');

        if(colorCounter > 9) {
          colorCounter = 0;
        }
      });
    };
    drawLineChart();
  }
}
