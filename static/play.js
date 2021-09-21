var socket = io()
var $startForm = $('#start')
var $nameField = $('#name')
var $panel = $('#panel')
var $buzzButton = $('#buzz')
var $state = $('#state')
var $buzzes = $('#buzzes')
var data = {
  room: window.location.pathname.split('/')[1], // get the first path
  name: null
}

$('body').addClass('center')

var count = 0
$score = $('#score')

$startForm.on('submit', function(event) {
  event.preventDefault()
  data.name = $nameField.val()
  socket.emit('namespace', data)
})

$buzzButton.on('click', function(event) {
  event.preventDefault()
  socket.emit('buzz', data)
  $buzzButton.hide()
  $state.show()
})

socket.on('namespace', function(canJoin) {
  if (canJoin) {
    $startForm.hide()
    $panel.show()
    $nameField.blur()
  }
  else {
    alert('Pick a different name!')
  }
})

socket.on('buzz', function(buzzData) {
  count++
  
  if (data.name === buzzData.name) {
    $state.text('Number ' + count)
  }
})

socket.on('score', function(scoreData) {
  var my_score = scoreData.leaderboard[$nameField.val()]
  $score.html(`${my_score} (${Object.values(scoreData.leaderboard).sort().pop() - my_score} to lead)`)
})

socket.on('reset', function(resetData) {
  count = 0
  $buzzButton.hide()
  let res = resetData.res
  // $state.show().text('Waiting...')
  $state.show().html(`
    <li class="paragraph">
      <b>QUESTION</b>
      <br>
      <br>
      📙 <span class="li">Category &mdash; ${res.results[0].category}</span>
      💯 <span class="li">Points &mdash; 100</span>
      🕵️ <span class="li">Question &mdash; ${res.results[0].question}</span>
    </li>
  `)
})

socket.on('begin', function() {
  $buzzButton.show()
  // $state.hide()
})