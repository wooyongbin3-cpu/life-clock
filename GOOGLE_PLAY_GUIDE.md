# 📱 Life Clock - Google Play 发布指南

## ✅ 已完成的配置

- ✅ Capacitor 初始化完成
- ✅ Android 平台集成
- ✅ PWA Manifest 配置
- ✅ Service Worker（离线支持）
- ✅ 项目结构准备就绪

## 🔧 本地开发和测试

### 前置条件
1. **Android Studio** - [下载](https://developer.android.com/studio)
2. **Java JDK 17+** - [下载](https://www.oracle.com/java/technologies/downloads/)
3. **Android SDK** - 通过 Android Studio 安装

### 快速启动

```bash
# 1. 同步最新代码到 Android
npx cap sync android

# 2. 在模拟器或真机上运行
npx cap open android

# 在 Android Studio 中点击"运行"按钮
```

## 📦 打包为 APK（测试）

### 步骤 1: 在 Android Studio 中打开项目
```bash
npx cap open android
```

### 步骤 2: 构建 Debug APK
1. 菜单：`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. 位置：`android/app/build/outputs/apk/debug/app-debug.apk`
3. 可直接在真机或模拟器上测试

### 步骤 3: 在真机上安装
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 发布到 Google Play

### 阶段 1: 生成发布密钥

```bash
# 创建 keystore（一次性）
keytool -genkey -v -keystore my-release-key.keystore ^
  -keyalg RSA -keysize 2048 -validity 10000 ^
  -alias my-key-alias
```

**记住密码和别名，之后无法恢复！**

### 阶段 2: 配置签名

1. 打开 Android Studio
2. 菜单：`Build` → `Generate Signed Bundle / APK`
3. 选择 `Android App Bundle` （推荐用于 Google Play）
4. 选择刚才生成的 keystore 文件
5. 输入密码和别名
6. 选择 Release 构建类型
7. 点击 Finish

**输出文件位置：** `android/app/release/app-release.aab`

---

## 📋 Google Play Console 发布流程

### 第 1 步: 创建 Google Play 开发者账号
- 访问：https://play.google.com/console
- 支付费用：25 USD（一次性）
- 验证身份和银行账户信息

### 第 2 步: 创建应用

1. 点击 `创建应用` (Create App)
2. **应用名称**：`Life Clock` （或 `生命时钟`）
3. **默认语言**：中文（简体）
4. 应用类型：`应用` (App)
5. 是否包含广告：否
6. 点击 `创建`

### 第 3 步: 填写应用信息

#### 应用详情 (App details)
- **应用名称**：生命时钟 · Life Clock
- **简短说明**（80字以内）：
  > 从出生那一刻起，温柔地丈量已经走过的岁月。精美本地单页应用，数据仅保存在本地。

- **完整说明**：
  > 生命时钟是一款简洁而深情的时间应用。它不会催促任何人，只是温柔地帮助你看见时间的流逝。
  >
  > ✨ 功能特性：
  > • 精确计算从出生至今的时间（年月日时分秒）
  > • 人生里程碑追踪（10000天、1亿秒等）
  > • 生命章节划分（童年、少年、青年等）
  > • 今日/今年进度环
  > • 可选的诗句轮播
  > • 三套精心设计的主题（暖光、暮色、墨蓝）
  > • 完全本地存储，无需账号
  > • 离线完全可用
  >
  > 🔒 隐私：
  > • 无后端服务
  > • 无用户追踪
  > • 无广告
  > • 数据仅保存在你的设备上
  >
  > 💡 灵感来源：对时间的温柔思考，设计风格取自 Claude 的克制美学。

- **分类**：`生活方式` 或 `效率工具`

#### 屏幕截图 (Screenshots)
- 需要至少 2 张截图（最多 8 张）
- 尺寸：1080 x 1920px
- 建议内容：
  1. 主时钟界面（显示年月日）
  2. 详情面板（累计时长、里程碑）
  3. 生命章节视图
  4. 主题切换展示

#### 特色图形 (Feature graphic)
- 尺寸：1024 x 500px
- 文案：例如 "从出生到此刻，温柔地丈量时间"

#### 图标 (Icon)
- 尺寸：512 x 512px
- 必须是正方形，圆形会自动裁剪

### 第 4 步: 评级问卷 (Content rating)

1. 点击 `设置内容评级`
2. 填写问卷（大多数选项选"否"）
3. 获得 ESRB 评级（通常为"所有人"）

### 第 5 步: 隐私政策 (Privacy policy)

1. 创建隐私政策网页，例如放在 GitHub：
   ```markdown
   # 隐私政策
   
   生命时钟应用不收集任何用户数据。所有数据仅存储在用户设备的本地存储中。
   我们不使用分析工具、广告服务或任何追踪技术。
   ```

2. 在 Google Play Console 中填入政策链接

### 第 6 步: 上传应用包

1. 左侧菜单：`Release`（版本）
2. 点击 `Create new release`
3. 选择 `Internal testing` → `Create release`
4. 上传 `.aab` 文件（Android App Bundle）
5. 等待审核（通常 1-2 小时）

### 第 7 步: 发布到生产环境

1. 完成 `Internal testing` 后
2. 返回 Release 页面
3. 点击 `Promote release to production`
4. 确认并发布
5. **首次发布需要 Google 审核**（通常 24-48 小时）

---

## 📊 版本管理

### 更新流程
```bash
# 1. 修改代码
# 2. 更新 dist 目录
npx cap sync android

# 3. 在 Android Studio 中增加版本号
# 编辑文件：android/app/build.gradle
# 修改：versionCode 和 versionName
#
# versionCode: 内部版本号（每次必须增加）
# versionName: 用户可见版本号（如 1.1.0）

# 4. 重新打包
# Build → Generate Signed Bundle / APK

# 5. 上传到 Google Play
# Release → Promote to production
```

---

## 📝 文件检查清单

在发布前，确认以下文件已同步到 `android/app/src/main/assets/public/`：

- ✅ index.html
- ✅ manifest.json
- ✅ sw.js
- ✅ assets/ornament.svg
- ✅ package.json

检查命令：
```bash
ls -R android/app/src/main/assets/public/
```

---

## 🐛 常见问题

### Q: APK vs AAB，哪个用于 Google Play？
**A:** AAB（Android App Bundle）- 推荐用于 Google Play，体积更小。

### Q: 如何在多台设备上测试？
**A:** 使用 `Internal testing` 版本，分享链接给测试人员（不需要真机连接）。

### Q: 更新应用时需要多久？
**A:** 首次发布需要人工审核（24-48h），后续更新通常 2-4 小时。

### Q: 如何查看用户反馈？
**A:** Google Play Console → Ratings & reviews

### Q: 如何获取下载统计？
**A:** Google Play Console → Statistics

---

## 🔐 重要提醒

1. **保管好 keystore 文件** - 丢失无法恢复
2. **不要共享密钥** - 只在本机构建
3. **版本号只能递增** - 无法回滚到更低版本
4. **备份 keystore** - 定期备份到安全位置

---

## 📞 支持链接

- [Google Play Console 帮助](https://support.google.com/googleplay/android-developer)
- [Capacitor 文档](https://capacitorjs.com/docs/getting-started)
- [Android 应用签名指南](https://developer.android.com/studio/publish/app-signing)

---

**祝你发布顺利！🚀**
