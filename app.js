
const http = require('http')
const spawn = require('child_process').spawn
const createHandler = require('github-webhook-handler')
const handler = createHandler({
  path: '/',
  secret: '123456'
})
 
http.createServer((req, res) => {
  handler(req, res, function(err) {
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
  } catch (e) {}
})


// const s = spawn('sh', ['../node-server-auto-pull-git/build.sh'], {
//   cwd: `../qq_kandian_H5_11`
// })

// s.stdout.on('data', (data) => {
//   console.log(`qq_kandian_H5_11: ${data}`);
// })
// s.stderr.on('data', (data) => {
//   console.log(`qq_kandian_H5_11: ${data}`);
// });
// console.log("qq_kandian_H5_11", 'has rebuild');