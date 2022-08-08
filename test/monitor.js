const { monitor } = require('../index')

// mo.cmd('uptime:loadavg top -bn 1 -i -c')
// mo.getClients()

async function main(){
  let getData = monitor(12355,'10.1.24.37')
  let cs = await getData('cmd','ls').catch((err)=>{l(err)})
  let gc = await getData('gc','ls').catch((err)=>{l(err)})
  let cl = await getData('cmdl','ls').catch((err)=>{l(err)})
  l(cl)
  // l(gc)
}
main()






