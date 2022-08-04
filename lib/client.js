const {Udp} = require("./udp")
const { defaultExtend } = require("./default_extend")

let callback = (msg,rinfo) => {
  msg = JSON.parse(msg.toString())
  l(123)
  let result = defaultExtend(msg,rinfo)
  if(result) client.send({status:1,msg:'lijinke'},12346,'fe80:0:0:0:0:0:0:1%lo0')
}

const client = new Udp(callback)
client.send({status:1,msg:'lijinke'},12346,'fe80:0:0:0:0:0:0:1%lo0')

