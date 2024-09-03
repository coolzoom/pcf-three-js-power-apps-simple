# debug
- dotnet tool install --global Microsoft.Powerapps.CLI.Tool

如果速度较慢
// 全局安装cnpm (mac需要加上sudo)
npm install cnpm -g --registry=https://registry.npmmirror.com 
// 成功后使用cnpm install安装
cnpm install

或者
npm install express --registry=https://mirrors.huaweicloud.com/repository/npm/

加上 -d显示进度
或者npm install --verbose

debug 可用
- cnpm start

build
- cnpm run build

code 安装    
Power Platform Tools
进去左边选add auth profile

- 使用临时solution发布
pac pcf push --publisher-prefix msl


# 自己创建solution
https://learn.microsoft.com/en-us/training/modules/build-power-apps-component/package-code-component

mkdir Solution
cd Solution
pac solution init --publisher-name mslearn --publisher-prefix msl
pac solution add-reference Z:\Documents\GitHub\pcf-three-js-power-apps-simple
msbuild /t:build /restore
msbuild /p:configureation=Release

enable powerapps comp framework
https://admin.powerplatform.microsoft.com/
environment，settings，product，feaures, Power Apps component framework for canvas apps

# 导入
将生成后的zip导入
powerapps
solution->import solution 完成后即可看到

# 使用
老版本 powerapp-》insert-》custom
新版本，在左边点加号Insert，选search下面小图标get more component -》 code

