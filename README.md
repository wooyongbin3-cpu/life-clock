# 生命时钟 · Life Clock

> **Android APK 已可安装** · 支持最高 **120Hz** 流畅刷新  
> 仓库：https://github.com/wooyongbin3-cpu/life-clock

从你的**出生年月日**起，实时显示已经活了多久——年、月、日、时、分、秒（含毫秒级滚动），以及累计时长与人生里程碑。

纯前端单页 + Capacitor Android 包装，打开即可用，无需服务器、无需账号。

## 文档导航

| 角色 | 从这里开始 |
|------|------------|
| 👤 用户 / 安装 APK | [快速开始](#快速开始) · [下载安装](#android-apk) |
| 🛠️ 开发者 | [开发与构建](#开发与构建) · [docs/](docs/README.md) |
| 🤖 AI Agent | [README_AGENT.md](README_AGENT.md) |
| 📋 交接 / 备份 | [HANDOFF.md](HANDOFF.md) · [docs/backup/](docs/backup/) |
| 📦 发布说明 | [RELEASE_NOTES.md](RELEASE_NOTES.md) |

## 功能

- **自定义出生时间**：日期必填，出生时刻可选（默认 `00:00:00`）
- **主时钟**：年 / 月 / 日 / 时 / 分 / **秒.毫秒**（随屏幕刷新率滚动，最高约 120fps）
- **累计时长**：总天 / 小时 / 分钟 / 秒 / 周，以及可调 bpm 估算的心跳次数
- **人生里程碑**：一万天、十亿秒、18 / 30 / 50 / 80 岁等，带进度与剩余倒计时
- **生命章节 / 进度环**：童年→期颐章节；今日 / 今年 / 至 80 岁进度（每帧平滑更新）
- **三套主题**：暖光 · 暮色 · 墨蓝
- **本地缓存**：出生时间、主题、称呼、心率、显示偏好写入 `localStorage`
- **Android 高刷**：优先请求设备最高刷新率（同分辨率下），WebView 硬件加速

## 快速开始

### 网页版

```bash
git clone https://github.com/wooyongbin3-cpu/life-clock.git
cd life-clock
```

直接用浏览器打开 `index.html`，或：

```bash
python -m http.server 5500
# 访问 http://127.0.0.1:5500
```

选择出生年月日 → **开始计时**。

### Android APK

1. 下载仓库根目录的 [`app-debug.apk`](app-debug.apk)，或从 [GitHub Releases](https://github.com/wooyongbin3-cpu/life-clock/releases) 获取  
2. 在手机上允许「未知来源」安装  
3. 安装后打开，输入出生日期即可  

```bash
adb install app-debug.apk
```

> 120Hz 需要手机面板与系统高刷模式支持；60Hz 屏最高仍为 60fps。

## 开发与构建

### 环境要求

- Node.js 18+
- JDK **17+**（本机构建使用过 JDK 21）
- Android SDK（通过 Android Studio 安装即可）

### 常用命令

```bash
npm install
npm test                 # 体积 / 缓存 / 时间计算校验
npm run sync             # npx cap sync android
cd android
.\gradlew.bat assembleDebug
# 输出: android/app/build/outputs/apk/debug/app-debug.apk
```

也可使用根目录 `build-apk.bat`。

### 120Hz / 流畅更新说明

| 层 | 改动 |
|----|------|
| Android | `MainActivity` 选择最高刷新 Display Mode；`preferredRefreshRate`；硬件加速 WebView |
| Web | `requestAnimationFrame` 快路径（分数秒 + 进度环）/ 慢路径（累计与里程碑） |
| CSS | 去掉进度环 0.6s 过渡，避免拖影；`will-change: stroke-dashoffset` |

详细备份说明见 [docs/backup/SESSION_2026-07-16_120hz.md](docs/backup/SESSION_2026-07-16_120hz.md)。

## 测试

```bash
npm test                 # 不需浏览器
npm run test:browser     # 可选：Playwright 冒烟
```

## 文件结构

```text
life-clock/
├── index.html                 # 主应用（HTML + CSS + JS）
├── dist/                      # 同步到 Android 的 Web 资源
├── android/                   # Capacitor Android 工程
├── app-debug.apk              # 调试版 APK（备份产物）
├── assets/ornament.svg
├── docs/                      # 文档索引与 session 备份
│   ├── README.md
│   └── backup/
├── tests/                     # 校验脚本
├── HANDOFF.md / README_AGENT.md / RELEASE_NOTES.md
├── FREE_RELEASE_QUICKSTART.md / GITHUB_RELEASE_GUIDE.md
├── GOOGLE_PLAY_GUIDE.md / AFTER_ANDROID_STUDIO.md
├── package.json
└── scripts/bootstrap-github.ps1
```

## 技术说明

| 项 | 说明 |
|----|------|
| 运行环境 | 现代浏览器；Android 5.0+（API 21） |
| 包名 | `com.wooyongbin.lifeclock` |
| 版本 | 1.2.0 |
| 依赖 | Capacitor 8（Android）；Web 端无构建步骤 |
| 字体 | Google Fonts（需联网；离线时回退系统字体） |
| 隐私 | 数据仅存本机，不上传 |
| 时间计算 | 日历感知的 年/月/日 差分 + 时间戳累计 |

## 部署

- **GitHub Pages**：Settings → Pages → `main` / root  
- Netlify / Vercel / Cloudflare Pages：导入本仓库  
- **免费分发 APK**：见 [FREE_RELEASE_QUICKSTART.md](FREE_RELEASE_QUICKSTART.md)  
- **Play 商店（可选）**：见 [GOOGLE_PLAY_GUIDE.md](GOOGLE_PLAY_GUIDE.md)

## License

MIT
