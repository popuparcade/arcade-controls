var GPIO = require('onoff').Gpio

var app = require('http').createServer(function handler (req, res) {
  console.log(req.method, req.url)
  res.writeHead(200)
  res.end('hi')
}, { serveClient: false })

var io = require('socket.io')(app)
app.listen(3728, function () {
  console.log('running on 3728')
})

io.on('connection', function (socket) {
  socket.emit('hi', { message: 'hey' })
  socket.on('wat', function (data) {
    console.log(data)
  })

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
})
