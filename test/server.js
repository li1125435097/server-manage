const { Server } = require('../index')


let server =  new Server(12345,'udp6')

setInterval(() => {
  server.cmda('ls',0,(body,header) => {
    l(body.stdout,'1111111111111111')
    l(server.getClients())
  })
}, 5e3);

// setTimeout(() => {
//   server.cmda('ls',0,(body,header) => {
//     l(body.stdout,'---------')
//   })
// }, 10e3);