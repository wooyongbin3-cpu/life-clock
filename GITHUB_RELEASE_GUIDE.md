# 📤 GitHub Releases 发布指南

## 快速发布步骤

### 步骤 1: 生成 APK 文件

**Windows:**
```bash
double-click build-apk.bat
```

**Mac/Linux:**
```bash
npx cap sync android
cd android
./gradlew assembleDebug
cd ..
```

输出文件：`android/app/build/outputs/apk/debug/app-debug.apk`

### 步骤 2: 在 GitHub 上创建 Release

#### 网页方式（最简单）

1. 打开仓库主页：
   ```
   https://github.com/wooyongbin3-cpu/life-clock
   ```

2. 右边栏找 `Releases` → 点击 `Create a new release`

3. 填写信息：
   ```
   Tag version: v1.1.0
   Release title: Life Clock v1.1.0 - 安卓应用
   
   Description:
   
   ## 生命时钟 Android 应用
   
   这是生命时钟的原生 Android 应用版本。
   
   ### 📥 安装方法
   
   1. 下载下方的 `app-debug.apk`
   2. 在 Android 手机上打开
   3. 允许"未知来源应用"安装
   4. 完成！
   
   ### ✨ 功能
   - 从出生至今的精确时间计算
   - 人生里程碑追踪
   - 生命章节划分
   - 今日/今年进度环
   - 三套精美主题
   - 完全本地存储，无隐私忧虑
   - 离线完全可用
   
   ### 📋 版本信息
   - 最小 Android：5.0+ (API 21)
   - 包名：com.wooyongbin.lifeclock
   - 发布日期：2026-07-15
   
   详见 [RELEASE_NOTES.md](RELEASE_NOTES.md)
   ```

4. 点击 `Attach binaries` 或直接拖拽上传：
   - 上传 `app-debug.apk`

5. 选择 `This is a pre-release` 或 `This is a latest release`

6. 点击 `Publish release` ✅

---

## 命令行方式（高级）

如果你已安装 `gh` CLI：

```bash
# 创建 Release
gh release create v1.1.0 \
  --title "Life Clock v1.1.0 - 安卓应用" \
  --notes-file RELEASE_NOTES.md \
  app-debug.apk
```

---

## 发布后的分享链接

Release 创建后，用户可以从以下位置下载：

```
直接下载链接：
https://github.com/wooyongbin3-cpu/life-clock/releases/download/v1.1.0/app-debug.apk

Releases 页面：
https://github.com/wooyongbin3-cpu/life-clock/releases
```

---

## 🔄 更新流程

每次更新应用时：

1. **修改代码**（如果有）
2. **同步到 Android**：`npx cap sync android`
3. **增加版本号**（可选）：`android/app/build.gradle` 中修改 `versionCode`
4. **重新构建**：`build-apk.bat`
5. **创建新 Release**：上传新的 APK

---

## 📊 版本命名规范

推荐使用语义化版本（Semantic Versioning）：

```
v主版本.次版本.修订版本

例如：
v1.0.0 - 首次发布
v1.1.0 - 新功能发布
v1.1.1 - bug 修复
v2.0.0 - 重大更新
```

---

## 💡 最佳实践

- ✅ 每次发布都创建 Git tag
- ✅ 在 Release Notes 中详细描述更改
- ✅ 测试 APK 后再发布
- ✅ 保留旧版本以便用户回滚
- ✅ 标记预发布版本（pre-release）

---

## 🆘 常见问题

### Q: 用户如何安装？
**A:** 
1. 下载 APK
2. 在 Android 手机上打开
3. 允许"来自未知来源的应用"
4. 点击安装

### Q: 如何更新应用？
**A:** 创建新的 Release，用户重新下载安装新 APK。

### Q: 能否像 Google Play 一样自动更新？
**A:** 需要额外配置。简单方案是用户手动下载新版本。

---

## 📞 用户分享

发布后，你可以分享这个链接给用户：

```markdown
🎉 生命时钟 Android 应用已发布！

⬇️ 免费下载：
https://github.com/wooyongbin3-cpu/life-clock/releases

✨ 功能：
• 精确计算从出生至今的时间
• 人生里程碑追踪
• 三套精美主题
• 完全本地存储

🔒 隐私：无后端、无追踪、无广告
```

---

**祝发布顺利！** 🚀
