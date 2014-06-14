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

var render = function(enemy_data){
  var enemies = gameBoard.selectAll('circle.enemy')
                .data(enemy_data, function(d){
                  return d.id;
                });

  enemies.enter().append('svg:circle')
         .attr('class', 'enemy')
         .attr('cx', function(enemy) {
            return axes.x(enemy.x);
          }).attr('cy', function(enemy) {
            return axes.y(enemy.y);
          }).attr('r', 10);
  enemies.exit().remove();
};

var play = function() {
  var newEnemyPositions;
  newEnemyPositions = createEnemies();
  return render(newEnemyPositions);
};
play();
