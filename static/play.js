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

socket.emit('exists', data)

socket.on('exists', function(exists) {
    if (!exists) {
        alert('That game doesn\'t exist!')
    }
})

$startForm.on('submit', function(event) {
    event.preventDefault()
    data.name = $nameField.val().trim()
    socket.emit('join', data)
})

socket.on('taken', function(received_data) {
    if (data.name === received_data.name) {
        alert('That name is taken in this room!')
    }
})

socket.on('empty', function() {
    alert('Please wait for the admin to choose their username.')
})

socket.on('full', function() {
    alert('The room is at max capacity.')
})

socket.on('player_list', function(player_list) {
    $startForm.hide()
    $controls.show()
    $nameField.blur()
    $shareLink.val(window.location.host+'/'+data.room)
    playerList = player_list
    innerHTML = player_list.map(name => `<span class="bubble">${name}</span>`).join('')
    $players.html(innerHTML)
    $names.html(innerHTML)
    count = playerList.length
    $roomCount.text(count === 1 ? count + ' player' : count + ' players')
})