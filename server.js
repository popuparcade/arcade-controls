var fs = require('fs')
var request = require('request')

module.exports = function (options) {
  var remoteHost = options.remoteHost || 'http://localhost:4444'
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
  var gifManager = require('./gif-manager')()

  io.on('connection', function (socket) {
    if (process.platform === 'linux') {
      var GPIO = require('onoff').Gpio
      var button = new GPIO(22, 'in', 'both')
      var up = new GPIO(17, 'in', 'both')
      var down = new GPIO(13, 'in', 'both')
      var left = new GPIO(19, 'in', 'both')
      var right = new GPIO(26, 'in', 'both')

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

      var gifProcessing = false
      button.watch(function (err, value) {
        if (!gifProcessing && value === 1) {
          gifProcessing = true
          makeGif(!!value)
        }
      })

      function makeGif (value) {
        socket.emit('picture')
        gifManager.takePicture('test1.jpg')
        socket.emit('picture')
        gifManager.takePicture('test2.jpg')
        socket.emit('picture')
        gifManager.takePicture('test3.jpg')
        socket.emit('processing gif')
        var gifURL = gifManager.generateGif(process.env.ARCADE_MACHINE_ID + '-latest.gif')
        socket.emit('gif completed', gifURL)
        gifProcessing = false
        sendGif()
      }

      var tries = 0
      function sendGif () {
        var formData = { file: fs.createReadStream(process.cwd() + '/images/' + process.env.ARCADE_MACHINE_ID + '-latest.gif') }
        request.post({ url: remoteHost + '/gif', formData: formData }, function (err, res, body) {
          if (err) {
            console.error('upload failed. trying again.', err)
            if (tries < 3) {
              tries++
              sendGif()
            } else {
              console.log('not working')
            }
          }
        })
      }
    }
  })

  return app
}
