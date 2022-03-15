var socket = io()
var $startForm = $('#start')
var $roomField = $('#room')
var $controls = $('#controls')
var $game = $('#game')
var $shareLink = $('#shareLink')
var $roomCount = $('#roomCount')
var data = { room: null, name: null }

var $adminForm = $("#admin")
var $nameField = $("#name")
var $info = $("#info")

var $names = $("#names")

var count = 0
var playerList = []
var playerStats = {}
var order;

var daily;

var $players = $('#players')
var $beginButton = $('#begin')
var $dailyButton = $('#daily')

$roomCount.text('0 players')

$startForm.on('submit', function(event) {
    event.preventDefault()
    data.room = $roomField.val().trim()

    socket.emit('create', data)
})

socket.on('name_taken', function(data) {
    alert(`The name ${data.name} is taken in this room.`)
})

$adminForm.on('submit', function(event) {
  event.preventDefault()
  data.name = $nameField.val()
  socket.emit('join', data)
  $adminForm.hide()
  $nameField.blur()
  $info.show()
})

socket.on('join', function(recData) {
    if (playerList.length === 0 && recData.name !== data.name) {
      socket.emit('empty', recData.room)
      return
    }
    if (playerList.length >= 5) {
      socket.emit('full', recData.room)
      return
    }
    if (playerList.includes(recData.name)) {
      socket.emit('taken', { room: recData.room, name: recData.name })
    } 
    else {
      count++
      $roomCount.text(count === 1 ? count + ' player' : count + ' players')
      $players.append(`<span class="bubble">${recData.name}</span>`)
      $names.append(`<span class="bubble">${recData.name}</span>`)
      playerStats[recData.name] = {fails: 0, time: 0}
      playerList.push(recData.name)
      socket.emit("player_list", { room: recData.room, player_list: playerList })
    }
})

$beginButton.on('click', function() {
    socket.emit('begin', Object.assign({}, data, { rand: Math.random() }))
})

$dailyButton.on('click', function() {
  socket.emit('daily', data)
})

socket.on('create', function(success) {
  if (success) {
    $startForm.hide()
    $controls.show()
    $shareLink.val(window.location.host+'/'+data.room)
  }
  else {
    alert('That room is taken, or the chosen room name is less than 3 characters long.')
  }
})