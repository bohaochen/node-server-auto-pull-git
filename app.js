
const http = require('http')
const spawn = require('child_process').spawn
// github用
// const createHandler = require('github-webhook-handler');
// const handler = createHandler({
//   path: '/webhook',
//   secret: '123456'
// })
// gitee用
const createHandler = require('gitee-webhook-middleware');
const handler = createHandler({ path: '/webhook', token: '123456' });
const express = require('express');
var compression = require('compression')
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

//github
//handler.on('push', e => {
//gitee
handler.on('Push Hook', e => {
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

    app.use(compression());

    app.use('/api/', createProxyMiddleware(proxyOption));

    app.use(history()); 
  
    app.use(express.static(`../${e.payload.repository.name}/dist`))

  } catch (e) { }


})



app.listen(8081, () => {
  console.log(`App listening at port 8081`)
})
