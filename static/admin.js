var socket = io()
var $startForm = $('#start')
var $roomField = $('#room')
var $panel = $('#panel')
var $beginButton = $('#begin')
var $resetButton = $('#reset')
var $shareLink = $('#shareLink')
var $buzzes = $('#buzzes')
var $roomCount = $('#roomCount')
var data = { room: null }

var count = 0

var instructions = '<li class="paragraph"><b>INSTRUCTIONS</b><br><br>👫 <span class="li">Share the link in the top right to have people join your game.</span>⏱ <span class="li">Press the "Begin" button to start a 3 second countdown until people can buzz in.</span>🎉 <span class="li">Play your game! </span>🤟 <span class="li">Once you\'re ready for the next round, press the "Reset" button. </span>&mdash;<br>Happy Buzzing 🔔<br></li>'
$buzzes.html(instructions)
$roomCount.text('0 people')

$startForm.on('submit', function(event) {
  event.preventDefault()
  data.room = $roomField.val()
  
  socket.emit('create', data)
})

socket.on('create', function(success) {
  if (success) {
    $startForm.hide()
    $panel.show()
    $shareLink.val(window.location.host+'/'+data.room)
  }
  else {
    alert('That room is taken')
  }
})

$beginButton.on('click', function() {
  socket.emit('begin', { room: data.room, at: new Date(new Date().getTime() + 3500) }) // begin in 3 seconds + .5 seconds for transit
  $beginButton.hide()
  $resetButton.show()
  $buzzes.html('')
})

$resetButton.on('click', function() {
  socket.emit('reset', data)
  $beginButton.show()
  $resetButton.hide()
})

socket.on('buzz', function(data) {
  $buzzes.append('<li>' + data.name + '</li>')
})

socket.on('reset', function() {
  $buzzes.html(instructions)
})

socket.on('leave', function() {
  count--
  $roomCount.text(count === 1 ? count + ' person' : count + ' people')
})

socket.on('join', function() {
  count++
  $roomCount.text(count === 1 ? count + ' person' : count + ' people')
})