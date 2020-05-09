# node-server-auto-pull-git

# 简单配置完成自动部署，基于nodejs+express+gitHub_Webhooks

使用方法 

1.打开你要配置自动部署的github项目，进入settings

2.点开webhooks配置页 

    设置Payload URL（git事件通知地址，例http://123.123.123.123:8888）
    设置Content type（application/json）
    设置Secret（123456）

3.进入服务器，拉取本项目并安装依赖 npm install (建议 cnpm install)

4.拉取要自动部署的项目，跟本项目处于同一文件夹内

5.然后启动服务 
    cd ./node-server-auto-pull-git
    node app.js

6.注意事项
    1.具体的build操作，修改 build.sh里面的配置
    2.反向代理 以及单页spa应用指向问题  在app.js解决
    3.对应的监听webhooks请求的端口，要跟webhooks配置中Payload URL保持一致
    4.对外暴露的页面端口默认为8080，想修改的话 在app.js解决

