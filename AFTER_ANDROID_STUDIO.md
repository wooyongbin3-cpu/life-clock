# ✅ Android Studio 安装完成后的清单

## 🎯 按顺序完成这些步骤

### 步骤 1️⃣：首次启动 Android Studio

1. **打开 Android Studio**
2. 第一次启动会询问配置
3. 选择 `Standard` 安装类型
4. 等待 SDK 下载（可能需要 5-10 分钟）
5. 完成后关闭 Android Studio

### 步骤 2️⃣：配置环境变量（重要！）

**Windows 用户：**

1. 打开 `文件资源管理器`
2. 右键 `此电脑` → `属性`
3. 左边 `高级系统设置`
4. 点击 `环境变量` 按钮
5. 点击 `新建` → 创建：
   ```
   变量名：ANDROID_HOME
   变量值：C:\Users\<你的用户名>\AppData\Local\Android\Sdk
   ```
   （如果不是这个路径，检查 Android Studio 的 Settings → SDK Manager → Android SDK Location）

6. 点击确定保存
7. **重启 Windows 命令窗口/PowerShell**（重要！环境变量才会生效）

### 步骤 3️⃣：验证环境配置

**打开 PowerShell 或命令提示符，运行：**

```bash
echo %ANDROID_HOME%
```

应该输出类似：
```
C:\Users\YourName\AppData\Local\Android\Sdk
```

如果输出为空，说明环境变量未生效，请重启计算机。

### 步骤 4️⃣：生成 APK

**回到项目目录运行：**

```bash
cd C:\Users\TUF GAMING\life-clock

# 同步最新代码到 Android
npx cap sync android

# 方式 A：自动脚本（推荐）
.\build-apk.bat

# 方式 B：手动构建（如果脚本失败）
cd android
.\gradlew.bat assembleDebug
cd ..
```

### 步骤 5️⃣：验证 APK 生成

**构建完成后检查：**

```bash
# 应该看到 app-debug.apk 在项目根目录
ls app-debug.apk

# 或查看完整路径
dir app-debug.apk
```

---

## 🆘 常见问题排查

### ❌ 错误：`ANDROID_HOME is not set`

**解决：**
1. 重新检查环境变量是否正确设置
2. **重启 PowerShell 窗口**（这很重要！）
3. 运行 `echo $env:ANDROID_HOME` 验证

### ❌ 错误：`SDK Platform not found`

**解决：**
1. 打开 Android Studio
2. Tools → SDK Manager
3. 安装 `SDK Platforms` 下的 Android 版本（推荐 Android 11/12/13）
4. 重新运行构建

### ❌ 错误：`gradle: command not found`

**解决：**
1. 确保在项目的 `android` 目录
2. 运行 `.\gradlew.bat assembleDebug`（Windows 用反斜杠）
3. 不要用 `gradlew` 或 `gradle`

### ❌ 构建卡住或超慢

**原因：** 第一次构建会下载很多依赖（可能 10-20 分钟）

**解决：**
- 不要中断
- 保持网络连接
- 有耐心等待 ☕

---

## ✅ 成功标志

```
BUILD SUCCESSFUL
Total time: X.XXs
```

看到这个说明成功！✨

**APK 文件位置：**
```
app-debug.apk
```

或完整路径：
```
android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📋 下一步

APK 生成后：

1. **测试**（可选）：
   ```bash
   adb install app-debug.apk
   ```

2. **上传到 GitHub Release**：
   - 按 GITHUB_RELEASE_GUIDE.md 操作
   - 5 分钟完成发布

3. **分享链接给用户** ✨

---

## 💡 提示

- 第一次构建会很慢（5-20 分钟），以后会快些
- 如果失败，查看终端输出的错误信息
- 可以多试几次，有时是网络问题

---

**有问题随时问！** 🚀
