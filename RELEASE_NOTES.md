# Life Clock 发布说明

## 🌟 功能特性

生命时钟是一款温柔而深情的时间应用。它不会催促任何人，只是温柔地帮助你看见时间的流逝。

### ✨ 核心功能

- **精确计时**：从出生至今的年月日时分秒（秒支持毫秒滚动）
- **人生里程碑**：10,000 天、1 亿秒、30 岁、50 岁等
- **生命章节**：童年 → 少年 → 青春期 → 而立 → 不惑 → 花甲 → 期颐
- **进度可视化**：今日 / 今年 / 至 80 岁进度环（高刷平滑）
- **诗句轮播**：约每 12 秒更新
- **心跳计数**：按自定义心率估算
- **三套主题**：暖光、暮色、墨蓝
- **高刷新率**：Android 请求设备最高刷新率（最高约 120Hz）

### 🔒 隐私保护

- ✅ 完全本地存储  
- ✅ 无后端 / 无追踪 / 无广告  
- ✅ 离线可用  

## 📥 安装方式

### 方式 1: 直接安装（推荐）

1. 下载 `app-debug.apk`  
2. 允许未知来源后安装  

### 方式 2: adb

```bash
adb install app-debug.apk
```

## 📋 版本信息

- **版本**：1.2.0  
- **包名**：`com.wooyongbin.lifeclock`  
- **最小 Android**：5.0+（API 21）  
- **构建日期**：2026-07-16  
- **源码**：https://github.com/wooyongbin3-cpu/life-clock  

## 🔄 更新说明

### v1.2.0 (2026-07-16)

- ✨ Android 高刷：优先同分辨率最高 Display Mode，请求最高约 120Hz  
- ✨ 流畅更新：`requestAnimationFrame` 快路径（分数秒 + 进度环）/ 慢路径（累计与故事）  
- ✨ 秒显示支持毫秒级滚动（`SS.mmm`）  
- ⚡ 去掉进度环 0.6s CSS 过渡，减少拖影；DOM 脏检查降低无效写入  
- 📚 新增 `docs/` 备份资料目录，更新 README / HANDOFF  

### v1.1.0 (2026-07-15)

- ✨ Capacitor Android 集成  
- ✨ PWA Manifest + Service Worker  
- 🐛 小屏显示优化  

### v1.0.0

- 🎉 完整生命时钟 Web 版  
- 🎨 三套主题、本地缓存、响应式布局  

## 📞 支持

- Issues：https://github.com/wooyongbin3-cpu/life-clock/issues  
- 源码：https://github.com/wooyongbin3-cpu/life-clock  

## 📄 许可证

MIT License

---

**祝你在生命的每一刻都能看见美。** ✨
