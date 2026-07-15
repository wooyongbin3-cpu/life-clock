# 生命时钟 · Life Clock

> **🚀 免费 Android App 即将发布！** 请查看 [免费发布指南](FREE_RELEASE_QUICKSTART.md)
>
> **文档导航：** 
> - 👤 用户？→ [快速开始](#快速开始)
> - 🛠️ 开发者？→ [开发指南](#开发)
> - 🤖 AI Agent？→ [README_AGENT.md](README_AGENT.md) 
> - 📋 交接事项？→ [HANDOFF.md](HANDOFF.md)

从你的**出生年月日**起，实时显示已经活了多久——年、月、日、时、分、秒，以及累计时长与人生里程碑。

纯前端单页应用，打开即可用，无需服务器、无需账号。

## 功能

- **自定义出生时间**：日期必填，出生时刻可选（默认 `00:00:00`）
- **主时钟**：年 / 月 / 日 / 时 / 分 / 秒，与系统时间每秒同步
- **累计时长**：总天 / 小时 / 分钟 / 秒 / 周，以及可调 bpm 估算的心跳次数（秒级更新）
- **人生里程碑**：一万天、十亿秒、18 / 30 / 50 / 80 岁等，带进度与剩余倒计时
- **生命章节 / 进度环**：童年→期颐章节，以及今日 / 今年 / 至 80 岁进度
- **三套主题**：暖光 · 暮色 · 墨蓝（Claude 式安静纸感与景深）
- **本地缓存**：出生时间、主题、称呼、心率、显示偏好写入 `localStorage`，下次打开自动恢复

## 快速开始

1. 克隆仓库：

```bash
git clone https://github.com/<YOUR_USER>/life-clock.git
cd life-clock
```

2. 用浏览器直接打开：

```text
index.html
```

或起一个本地静态服务（可选）：

```bash
# Python
python -m http.server 5500

# Node
npx --yes serve .
```

然后访问 `http://127.0.0.1:5500`。

3. 选择出生年月日 → 点 **开始计时**。

## 测试

```bash
npm test                 # 体积 / 缓存往返 / 时间计算（不需浏览器）
npm run test:browser     # 可选：Playwright 冒烟（需本机 playwright + chromium）
```

## 文件结构

```text
life-clock/
├── index.html          # 完整应用（HTML + CSS + JS）
├── assets/ornament.svg # 第一方装饰插画
├── tests/              # 校验脚本
├── README.md
├── LICENSE
├── .gitignore
└── scripts/
    └── bootstrap-github.ps1   # 一键：建 GitHub repo + push + 开 issues
```

## 技术说明

| 项 | 说明 |
|----|------|
| 运行环境 | 现代浏览器（Chrome / Edge / Firefox / Safari） |
| 依赖 | 无构建步骤；字体来自 Google Fonts（需联网） |
| 隐私 | 数据仅存本机浏览器，不上传 |
| 时间计算 | 日历感知的 年/月/日 差分 + 同一时间戳驱动的累计秒数 |

## 部署

静态托管均可，例如：

- **GitHub Pages**：仓库 Settings → Pages → Deploy from branch `main` / root
- Netlify / Vercel / Cloudflare Pages：直接导入本仓库

## 开发计划（Issues）

建议用 Issues 跟踪后续改进，例如：

1. GitHub Pages 一键发布文档
2. 多语言（EN）
3. 导出 / 分享「已活秒数」卡片
4. PWA / 桌面小组件
5. 农历 / 星座可选显示

可用 `scripts/bootstrap-github.ps1` 自动创建上述 issues。

## License

MIT
