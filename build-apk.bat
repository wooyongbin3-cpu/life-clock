@echo off
REM Life Clock - APK 构建脚本（Windows）

echo ========================================
echo  生命时钟 APK 构建工具
echo ========================================
echo.

REM 检查 Android SDK
if not defined ANDROID_HOME (
    echo ❌ 错误: ANDROID_HOME 环境变量未设置
    echo.
    echo 请按以下步骤配置：
    echo 1. 安装 Android Studio: https://developer.android.com/studio
    echo 2. 在系统环境变量中设置 ANDROID_HOME
    echo    例如: C:\Users\YourName\AppData\Local\Android\Sdk
    echo 3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✓ Android SDK 找到：%ANDROID_HOME%
echo.

REM 同步最新代码
echo 📱 同步最新代码到 Android 项目...
call npx cap sync android
if errorlevel 1 (
    echo ❌ 同步失败
    pause
    exit /b 1
)
echo ✓ 同步完成
echo.

REM 构建 APK
echo 🔨 构建 APK...
cd android
call gradlew.bat assembleDebug

if errorlevel 1 (
    echo ❌ 构建失败
    echo.
    echo 可能的原因：
    echo • 未安装 Android SDK
    echo • 未安装 Java JDK
    echo • gradle 配置问题
    echo.
    echo 请参考: GOOGLE_PLAY_GUIDE.md
    cd ..
    pause
    exit /b 1
)

cd ..
echo ✓ APK 构建完成
echo.

REM 查找生成的 APK
for /f "delims=" %%i in ('dir /b /s "android\app\build\outputs\apk\debug\*.apk" 2^>nul') do (
    set APK_FILE=%%i
)

if defined APK_FILE (
    echo 📦 APK 文件：%APK_FILE%
    echo.
    echo ✓ 构建成功！
    echo.
    echo 下一步：
    echo 1. 复制 APK 到项目根目录
    echo 2. 上传到 GitHub Releases
    echo.
    
    REM 复制到项目根目录
    copy "%APK_FILE%" "app-debug.apk"
    echo ✓ 已复制到: app-debug.apk
) else (
    echo ❌ 找不到生成的 APK 文件
)

echo.
pause
