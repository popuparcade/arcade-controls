var keycode = require('keycode')
var socketIO = require('socket.io-client')

module.exports = function controls (options) {
  options = options || {}
  var socket = socketIO(options.host || 'http://localhost:3729')

  socket.on('connect', function () {
    console.log('connected')
  })

  socket.on('disconnect', function () {})

  if (options.keyboard) {
    document.addEventListener('keydown', function (e) {
      e.preventDefault()
      var key = keycode(e)
      if (key === 'up' || key === 'w') {
        socket.emit('up', true)
      } else if (key === 'down' || key === 's') {
        socket.emit('down', true)
      } else if (key === 'left' || key === 'a') {
        socket.emit('left', true)
      } else if (key === 'right' || key === 'd') {
        socket.emit('right', true)
      }
    }, false)

    document.addEventListener('keyup', function (e) {
      e.preventDefault()
      var key = keycode(e)
      if (key === 'up' || key === 'w') {
        socket.emit('up', false)
      } else if (key === 'down' || key === 's') {
        socket.emit('down', false)
      } else if (key === 'left' || key === 'a') {
        socket.emit('left', false)
      } else if (key === 'right' || key === 'd') {
        socket.emit('right', false)
      }
    }, false)
  }

  return socket
}
