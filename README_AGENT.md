# 🤖 Life Clock - Agent 快速上下文

**项目名：** Life Clock (生命时钟)  
**语言：** JavaScript + Android (Capacitor)  
**状态：** 🟢 APK 已构建；120Hz / 流畅 RAF 已合入  
**最后更新：** 2026-07-16  
**仓库：** https://github.com/wooyongbin3-cpu/life-clock

---

## ⚡ 30 秒速读

```text
What: 温柔的生命时钟（Web + Android APK）
Why:  从出生至今精确计量时间，本地离线
How:  index.html → dist → Capacitor → assembleDebug
Where: GitHub wooyongbin3-cpu/life-clock
When:  v1.2.0 — 120Hz + 毫秒秒 + 平滑进度环
Who:  无后端；数据仅 localStorage
```

---

## 🎯 核心特性

- ✅ 精确时间（年/月/日/时/分/**秒.毫秒**）
- ✅ 里程碑 / 生命章节 / 进度环
- ✅ 三套主题 + 本地缓存
- ✅ PWA + Android
- ✅ 高刷（最高 120Hz 请求）+ 分帧更新路径

---

## 📂 关键路径

```text
index.html                                              # 主应用
dist/index.html                                         # 同步副本
android/.../MainActivity.java                           # 120Hz / WebView GPU
app-debug.apk                                           # 调试包备份
docs/backup/SESSION_2026-07-16_120hz.md                 # 本 session 备份
HANDOFF.md                                              # 交接
```

---

## ✅ 已完成

- [x] Capacitor Android 初始化与 APK 构建
- [x] 120Hz Display Mode + 硬件加速
- [x] RAF 快/慢路径与环无 CSS 拖影
- [x] docs/ 备份资料 + README 更新

## 🔜 可选

- [ ] `gh release create v1.2.0` 上传 APK
- [ ] Release 签名 / Play 上架
- [ ] 产品功能（EN、分享卡片等）

---

## 构建一键

```powershell
cd life-clock
Copy-Item -Force index.html dist\index.html
npx cap sync android
cd android; .\gradlew.bat assembleDebug
```

**JDK：** 17+（勿把个人 `org.gradle.java.home` 提交进仓库）
