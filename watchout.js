// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 3,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var updateScore = function() {
  d3.select('.current span').text(gameStats.score.toString());
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
    d3.select('.high span').text(gameStats.bestScore.toString());
  }
  d3.select('.collisions span').text(gameStats.collisions.toString());
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

var dragMove = function(d){
  d3.select(this)
    .attr('cy', d3.event.y)
    .attr('cx', d3.event.x);
};

var drag = d3.behavior.drag().on('drag', dragMove);

var player = function(){
  var player = gameBoard.append('svg:circle')
                .attr('class', 'player')
                .attr('cx', axes.x(50))//use this
                .attr('cy', axes.y(50))
                .attr('r',10)
                .style('fill', '#fa5c4f')
                .call(drag);
};



  // enemies.each(function(enemy){
  //   var self = this;
  //   collision(enemy, d3.select('.player'));
  // });
var render = function(enemyData){
  var enemies = gameBoard.selectAll('circle.enemy')
                .data(enemyData, function(d){
                  return d.id;
                });
  var collision = function(enemy, player){
    var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.r);
    var xDiff = parseFloat(enemy.attr('cx') - player.cx);
    var yDiff = parseFloat(enemy.attr('cy') - player.cy);

    var seperation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    if (seperation < radiusSum) {
      gameStats.collisions++;
      gameStats.score = 0;
    }
  };

  var onCollision = function() {
    gameStats.collisions++;
    gameStats.score = 0;
    return updateScore();
  };

  enemies.enter().append('svg:circle')
         .attr('class', 'enemy')
         .attr('cx', function(enemy) {
            return axes.x(enemy.x);
          }).attr('cy', function(enemy) {
            return axes.y(enemy.y);
          }).attr('r', 0);
  enemies.exit().remove();
  enemies.transition().duration(500)
            .attr('r', 10)
          .transition().duration(1000)
          .tween('custom', function(newEnemy){
            var enemy = d3.select(this);
            startPos = {
              x: parseFloat(enemy.attr('cx')),
              y: parseFloat(enemy.attr('cy'))
            };
            endPos = {
              x: axes.x(newEnemy.x),
              y: axes.y(newEnemy.y)
            };
            return function(t) {
              collision(enemy, onCollision);
              enemyNextPos = {
                x: startPos.x + (endPos.x - startPos.x) * t,
                y: startPos.y + (endPos.y - startPos.y) * t
              };
              return enemy.attr('cx', enemyNextPos.x)
                          .attr('cy', enemyNextPos.y);
            };
          });
};

//Collision function



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

  player();
  gameTurn();
  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 50);
};

play();
























