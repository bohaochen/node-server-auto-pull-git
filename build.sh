git reset --hard origin/master
git clean -f
git pull
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install --global http-server
cnpm install
cnpm run build

cd ../dist

http-server ./dist -g -p 9999 --proxy http://116.62.197.100:1337/
 
echo 'build end'
