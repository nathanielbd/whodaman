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

var count = 0

$startForm.on('submit', function(event) {
  event.preventDefault()
  data.name = $nameField.val()
  $startForm.hide()
  $panel.show()
  $nameField.blur()
  
  socket.emit('join', data)
})

$buzzButton.on('click', function(event) {
  event.preventDefault()
  socket.emit('buzz', data)
  $buzzButton.hide()
  $state.show()
})

socket.on('buzz', function(buzzData) {
  count++
  
  if (data.name === buzzData.name) {
    $state.text('Number ' + count)
  }
})

socket.on('reset', function() {
  count = 0
  $buzzButton.hide()
  $state.show().text('Waiting...')
})

socket.on('begin', function(data) {
  setTimeout(function() {
    $buzzButton.show()
    $state.hide()
  }, new Date(data.at) - new Date())
  
  setTimeout(function() {
    $state.text('In 3')
  }, new Date(data.at) - new Date() - 3000)
  
  setTimeout(function() {
    $state.text('In 2')
  }, new Date(data.at) - new Date() - 2000)
  
  setTimeout(function() {
    $state.text('In 1')
  }, new Date(data.at) - new Date() - 1000)
})