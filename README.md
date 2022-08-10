# server-manage
服务器集群管理、监控，线上项目性能测试，为后端提供运维平台

## 一、介绍
- 做服务器管理，分服务端和客户端

## 二、使用
1. 集群部署代码，架构为主从服务器，下边两行代码嵌入项目即可（也可当做独立脚本运行）。判断ip如果serverIp，作为服务端启动，否则作为客户端启动
```javascript
const { server_manage } = require('server-manage')
server_manage(serverIp,serverPort)
```
2. 监控客户端代码，监控客户端可以通过命令获取服务端状态和集群pod状态
```javascript
const { monitor } = require('server-manage')
async function main(){
let getData = monitor(serverPort,serverIp)
  // 获取所有客户端
  let gc = await getData('gc').catch((err)=>{l(err)})                

  // 通过服务端转发到指定客户端运行cmd命令，并返回结果  ip、port可通过上个命令返回结果提取
  let cs = await getData('cmd','ls',ip,port).catch((err)=>{l(err)})  

  // 到服务端运行cmd命令，并返回结果
  let cl = await getData('cmdl','ls').catch((err)=>{l(err)})         
  l(cl,cs,gc)
}
main()
```

## 三、部署
- 部署服务器把集群部署那两行代码加进去就行了，ip和port是服务端的ip和port，这个ip是内网ip，如果服务器不在同一网关下，需通过公网ip通信，要重写getIp方法
- 监控客户端一般做到后台管理系统上，实时拿集群数据渲染到监控图表上


## 四、参数
```javascript
// 支持protocol='udp6',传getIp函数视为重写getIp方法，这个方法返回当前服务器ip的字符串
server_manage(serverIP,serverPort,protocol='udp4',getIp=_getIp) return server      

// protocol要和上边保持一致
monitor(serverPort,serverIp,protocol='udp4') return false     

// type in ['gc','cmd','cmdl','close'], data是type命令的参数   
getData(type,data,ip=clients[0],port=clients[0].port,timeout=1000) return response
```

## 五、系统价值
- 任何条件下都可实时获取服务器各项指标参数，解决部署后云平台服务器参数刷新问题
- 可自由获取服务器任何信息，检测任何你想监控的指标
- 嵌入项目可以获取正在运行的进程的堆栈信息，甚至可以修改正在运行项目的堆栈数据 （这个功能没实现哈）
- 目前这个项目是基于udp通讯的，只支持单数据包发送，如果做文件向集群分发，需要把文件存到服务端，监控端可以调服务器cmd方法，运行scp或者sftp命令把文件传输到集群客户端
