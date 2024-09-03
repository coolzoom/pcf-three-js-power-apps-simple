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

- 使用临时solution发布， having issue with mac, need to run on windows
pac pcf push --publisher-prefix msl

临时solution发布后会从environment自动删除


# 自己创建solution 非必须
https://learn.microsoft.com/en-us/training/modules/build-power-apps-component/package-code-component

mkdir Solution
cd Solution
pac solution init --publisher-name mslearn --publisher-prefix msl
pac solution add-reference --path Z:\Documents\GitHub\pcf-three-js-power-apps-simple
msbuild /t:build /restore
msbuild /p:configureation=Release

enable powerapps comp framework
https://admin.powerplatform.microsoft.com/
environment，settings，product，feaures, Power Apps component framework for canvas apps

# 导入- 不需要导入solution
将生成后的zip导入
powerapps
solution->import solution 完成后即可看到

# 使用
老版本 powerapp-》insert-》custom
新版本，在左边点加号Insert，选search下面小图标get more component -》 code


测试控件更新
修改后重新导入，重新删除和加入控件均还是第一次的样子。

# 更新

需要先修改controlmanifest.input.xml里面版本constructor="My3DViewerControl" version="0.0.12" 
pac pcf push --publisher-prefix msl

即可，不需要导入solution
powerapp刷新编辑窗口，会提示有控件需要更新