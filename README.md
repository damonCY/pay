# upay-admin-front
> 统一收银台后台管理系统

![upay preview](http://git.n.xiaomi.com/mix/upay-admin-front/raw/master/preview.png)

staging环境访问地址：
[http://staging.ucashier.cash.payment.pt.xiaomi.com/](http://staging.ucashier.cash.payment.pt.xiaomi.com/)
注：如果没有访问权限，请联系 [韩建坡](mailto:hanjianpo@xiaomi.com) 申请访问权限

## 开发方式
该系统前端采用fis + angular + modjs 构建，开发方式具有如下特点(优点)：

* 模块开发，所有业务代码存在在/app/module/目录下开发，一个view作为一个module开发。
* 按需加载，用户操作按功能需求加载相关代码，并且只在首次使用时加载。
* 自动依赖，得力于fis这款构建工具实现了资源的自动依赖。
* 资源定位，无需关心项目开发目录结构，通过配置总能编译输出你想要的目录/路径 规范。
* 自动刷新，开发代码时通过浏览器实时自动刷新页面效果。
* 打包合并，fis内建了文件打包合并功能。
* 添加md5戳，再也不用担心项目上线后静态资源被缓存。

## 本地开发

**安装nodejs环境**
访问[nodejs](https://nodejs.org/)官网，或者参考我之前写的一篇文章[Centos编译安装nodejs](https://sobird.me/centos-compile-and-install-nodejs.htm)，大家都懂的。

	$ cd ~
	$ wget https://nodejs.org/dist/v0.12.9/node-v0.12.9.tar.gz
	$ tar -zxvf node-v0.12.9.tar.gz
	$ cd node-v0.12.9
	$ ./configure
	$ make
	$ make install

**安装jello前端构建工具**

	$ npm install jello -g

**启动本地server**
启动一个本地服务，便于本地开发调试并实时预览页面

	$ cd project/path
	$ jello server start
	$ jello release -wcL

**本地预览**
打开浏览器访问：[http://127.0.0.1:8080/](http://127.0.0.1:8080/)

### 编译部署
运行：

	sh ./build.sh

会在项目目录下，产出一份output目录，该目录下即为项目产出目录。

### 部署front.sh
请将该项目下的`front.sh`文件拷贝到`upay-admin-new`项目根目录下, 并将该脚本加入到build.sh脚本文件中(mvn执行之前的位置)

运行 `sh front.sh` 会把upay-admin-new项目的前端代码编译部署到`src/main/webapp`目录下

***预告：即将升级fis编译工具到[mix](https://www.npmjs.com/package/mix-cli)***

## 上线部署
> 前端代码已经支持独立部署，具体部署方式如下：

1. 登录 http://deploy.pt.xiaomi.com/ 
2. 在发起任务里查询`upay-admin-front`关键字，将会过滤出该项目的部署job
3. 选择相应的部署job(staging, c3, lg)，点击发起进行部署
4. 确认选择部署的分支和目录是否正确，提交部署任务
5. 等待部署完成...... 大功告成，so easy~~

## 技术支持
[杨军龙](mailto:yangjunlong@xiaomi.com)
[韩建坡](mailto:hanjianpo@xiaomi.com)

## 参考
* [mix-dashboard](http://git.n.xiaomi.com/mix/mix-dashboard)
* [fis2](http://fex.baidu.com/fis-site/index.html)
* [统一收银台后台（一期）产品文档](http://wiki.n.miui.com/pages/viewpage.action?pageId=23125243)
* [统一收银台后台 接口API文档](http://wiki.n.miui.com/pages/viewpage.action?pageId=25040700)
