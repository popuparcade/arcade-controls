var keycode = require('keycode')
var socketIO = require('socket.io-client')

module.exports = function controls (options) {
  options = options || {}
  var socket = socketIO(options.host || 'http://localhost:3729')

  socket.on('connect', function () {
    console.log('connected')
  })

  socket.on('disconnect', function () {})
  socket.keys = {}

  socket.on('up', function (value) {
    socket.keys.up = value
  })

  socket.on('down', function (value) {
    socket.keys.down = value
  })

  socket.on('left', function (value) {
    socket.keys.left = value
  })

  socket.on('right', function (value) {
    socket.keys.right = value
  })

  if (options.keyboard) {
    document.addEventListener('keydown', function (e) {
      var key = keycode(e)
      if (key === 'space') {
        socket.keys.button = true
      }
      if (key === 'up' || key === 'w') {
        e.preventDefault()
        socket.keys.up = true
      }
      if (key === 'down' || key === 's') {
        e.preventDefault()
        socket.keys.down = true
      }
      if (key === 'left' || key === 'a') {
        e.preventDefault()
        socket.keys.left = true
      }
      if (key === 'right' || key === 'd') {
        e.preventDefault()
        socket.keys.right = true
      }
    }, false)

    document.addEventListener('keyup', function (e) {
      var key = keycode(e)
      if (key === 'space') {
        socket.keys.button = false
      }
      if (key === 'up' || key === 'w') {
        e.preventDefault()
        socket.keys.up = false
      }
      if (key === 'down' || key === 's') {
        e.preventDefault()
        socket.keys.down = false
      }
      if (key === 'left' || key === 'a') {
        e.preventDefault()
        socket.keys.left = false
      }
      if (key === 'right' || key === 'd') {
        e.preventDefault()
        socket.keys.right = false
      }
    }, false)
  }

  socket.on('picture', function () {
    console.log('Let\'s take a picture!!!')
  })

  socket.on('processing gif', function () {
    console.log('processing gif, hold on tight...')
  })

  socket.gifURL = 'images/' + process.env.ARCADE_MACHINE_ID + '-latest.gif'

  socket.on('gif completed', function (gifURL) {
    console.log('gifURL:', gifURL)
    if (gifURL) {
      socket.gifURL = gifURL
    }
    var gif = document.getElementById('player1-gif')
    gif.src = '' + gifURL + '?rand=' + Math.random()
    console.log('browser.js: gif img url set!!!, gif:', gif)
    console.log('Press the button again to re-do your gif')
  })

  socket.on('new-gif', function (gifURL) {
    var gif = document.getElementById('player2-gif')
    gif.src = gifURL
  })

  return socket
}
