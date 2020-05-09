git reset --hard origin/master
git clean -f
git pull
npm install
npm run build
 
echo ‘build end'
