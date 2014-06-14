// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var updateScore = function() {
  d3.select('.current').text(gameStats.score.toString());
};

var createEnemies = function(){
  return _.range(0, gameOptions.nEnemies).map(function(i){
    return {
      id:i,
      x: Math.random()*100,
      y: Math.random()*100
    };
  });


};

var render = function(enemyData){
  var enemies = gameBoard.selectAll('circle.enemy')
                .data(enemyData, function(d){
                  return d.id;
                });

  enemies.enter().append('svg:circle')
         .attr('class', 'whatever')
         .attr('cx', function(enemy) {
            return axes.x(enemy.x);
          }).attr('cy', function(enemy) {
            return axes.y(enemy.y);
          }).attr('r', 0);
  enemies.exit().remove();
  enemies.transition().duration(500)
            .attr('r', 10)
          .transition().duration(1000)
            .tween('custom',function(d){
              customTween(d);
            });


  var customTween = function(enemy){
    var newPosition = function(enemy){
      var startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };
      var endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };
      var enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x)*t,
        y: startPos.y + (endPos.y - startPos.y)*t
      };
    };
    newPosition(enemy);
  };
};

var play = function() {
  var gameTurn = function(){
    var newEnemyPositions;
    newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  };
  var increaseScore = function(){
    gameStats.score += 1;
    updateScore();
  };

  gameTurn();
  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 50);
};

play();
























