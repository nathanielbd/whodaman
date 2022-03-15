var socket = io()
var $startForm = $("#start")
var $controls = $('#controls')
var $nameField = $('#name')
var $game = $('#game')

var $shareLink = $('#shareLink')
var $roomCount = $('#roomCount')
var data = { 
    room: window.location.pathname.split('/')[1],
    name: null
}

var $names = $("#names")
var $players = $("#players")

var count = 0
var playerList = []
var order;

var $beginButton = null;

var daily;

$roomCount.text('0 players')

$startForm.on('submit', function(event) {
    event.preventDefault()
    data.name = $nameField.val().trim()
    socket.emit('join', data)
})

socket.on('name_taken', function(data) {
    alert(`The name ${data.name} is taken in this room.`)
})

socket.on('join', function(data) {
    count++
    $startForm.hide()
    $controls.show()
    $nameField.blur()
    $shareLink.val(window.location.host+'/'+data.room)
    $roomCount.text(count === 1 ? count + ' player' : count + ' players')
    // $players.append(`<span class="bubble">${data.name}</span>`)
    // $names.append(`<span class="bubble">${data.name}</span>`)
})

socket.on('player_list', function(player_list) {
    playerList = player_list
    innerHTML = player_list.map(name => `<span class="bubble">${name}</span>`).join('')
    $players.html(innerHTML)
    $names.html(innerHTML)
    count = playerList.length
    $roomCount.text(count === 1 ? count + ' player' : count + ' players')
})