var app = module.exports = require('http').createServer(function handler (req, res) {
  res.writeHead(200)
  res.end('hi')
}, { serveClient: false })

if (require.main === module) {
  app.listen(3728, function () {
    console.log('running on 3728')
  })
}

var io = require('socket.io')(app)

io.on('connection', function (socket) {
  if (process.platform === 'linux') {
    var GPIO = require('onoff').Gpio
    var button = new GPIO(22, 'in', 'both')
    var up = new GPIO(17, 'in', 'both')
    var down = new GPIO(13, 'in', 'both')
    var left = new GPIO(19, 'in', 'both')
    var right = new GPIO(26, 'in', 'both')

    button.watch(function (err, value) {
      socket.emit('button', !!value)
    })

    up.watch(function (err, value) {
      socket.emit('up', !!value)
    })

    down.watch(function (err, value) {
      socket.emit('down', !!value)
    })

    left.watch(function (err, value) {
      socket.emit('left', !!value)
    })

    right.watch(function (err, value) {
      socket.emit('right', !!value)
    })
  }
})
