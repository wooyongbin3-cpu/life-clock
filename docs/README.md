# Life Clock · 文档索引（备份资料目录）

本目录集中存放**可复用文档索引**与 **session 备份**，方便 Git 仓库备份与后续 Agent 接手。

根目录仍保留主要入口文档（README / HANDOFF 等），避免旧链接断裂。

## 入口

| 文档 | 说明 |
|------|------|
| [../README.md](../README.md) | 用户与开发者主 README |
| [../HANDOFF.md](../HANDOFF.md) | 当前 session 交接状态 |
| [../README_AGENT.md](../README_AGENT.md) | Agent 30 秒上下文 |
| [../RELEASE_NOTES.md](../RELEASE_NOTES.md) | 版本发布说明 |
| [../FREE_RELEASE_QUICKSTART.md](../FREE_RELEASE_QUICKSTART.md) | 免费 APK 发布 |
| [../GITHUB_RELEASE_GUIDE.md](../GITHUB_RELEASE_GUIDE.md) | GitHub Release 步骤 |
| [../AFTER_ANDROID_STUDIO.md](../AFTER_ANDROID_STUDIO.md) | Android Studio 后续 |
| [../GOOGLE_PLAY_GUIDE.md](../GOOGLE_PLAY_GUIDE.md) | Play 商店（可选） |

## Session 备份

| 备份 | 日期 | 内容 |
|------|------|------|
| [backup/SESSION_2026-07-16_120hz.md](backup/SESSION_2026-07-16_120hz.md) | 2026-07-16 | 120Hz + 流畅 RAF 更新、APK 重建、推送说明 |
| [backup/PROJECT_SNAPSHOT.md](backup/PROJECT_SNAPSHOT.md) | 2026-07-16 | 仓库结构、构建产物、环境要点快照 |

## 构建产物（仓库根目录）

| 文件 | 说明 |
|------|------|
| `app-debug.apk` | Debug 安装包（约 4MB），含 120Hz / 流畅计时逻辑 |
| `android/app/build/outputs/apk/debug/app-debug.apk` | Gradle 输出路径（可能被 local ignore） |

## 本机构建提示

```text
JDK: 17+（推荐 21）
不要把个人路径写入 org.gradle.java.home 并提交
请用环境变量 JAVA_HOME，或本机未跟踪的 gradle 覆盖配置
```
