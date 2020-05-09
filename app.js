
const http = require('http')
const spawn = require('child_process').spawn
const createHandler = require('github-webhook-handler')
const express = require('express');
const history = require(`connect-history-api-fallback`);
const {createProxyMiddleware } = require("http-proxy-middleware");

var apiPath = "/api/";//目标后端服务地址(反向代理指向地址)
var proxyPath = "http://116.62.197.100:1337/";//目标后端服务地址(反向代理指向地址)
var proxyOption ={
  target:proxyPath,
  changeOrigoin:true,
  pathRewrite: function (path) { return path.replace(`${apiPath}`, '/') }
};

var app = express();

const handler = createHandler({
  path: '/',
  secret: '123456'
})

//监听7777接口 为github webhook 做相应，触发自动构建
http.createServer((req, res) => {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', err => {
  console.error('Error:', err.message)
})

handler.on('push', e => {
  try {
    const s = spawn('sh', ['../node-server-auto-pull-git/build.sh'], {
      cwd: `../${e.payload.repository.name}`
    })
    s.stdout.on('data', (data) => {
      console.log(`${e.payload.repository.name}: ${data}`);
    })
    s.stderr.on('data', (data) => {
      console.log(`${e.payload.repository.name}: ${data}`);
    });
    console.log(e.payload.repository.name, 'has rebuild');

    app.use('/api/', createProxyMiddleware(proxyOption));

    app.use(history()); 
  
    app.use(express.static(`../${e.payload.repository.name}/dist`))

  } catch (e) { }


})



app.listen(8080, () => {
  console.log(`App listening at port 8080`)
})