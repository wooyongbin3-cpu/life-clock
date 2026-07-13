<#
.SYNOPSIS
  一键：初始化 git → 创建 GitHub 私有/公开仓库 → push → 批量开 Issues

.DESCRIPTION
  依赖：git + GitHub CLI (gh)
  使用前：gh auth login

.EXAMPLE
  .\scripts\bootstrap-github.ps1
  .\scripts\bootstrap-github.ps1 -RepoName life-clock -Public
  .\scripts\bootstrap-github.ps1 -SkipIssues
#>
[CmdletBinding()]
param(
  [string]$RepoName = "life-clock",
  [string]$Description = "生命时钟：从出生日期实时显示已活多久（年/月/日/时/分/秒）",
  [switch]$Public,
  [switch]$SkipIssues,
  [switch]$SkipPush
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Assert-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "未找到命令 '$Name'。请先安装：git 与 GitHub CLI (https://cli.github.com/)"
  }
}

Assert-Command git
Assert-Command gh

Write-Host "==> 检查 GitHub 登录状态..." -ForegroundColor Cyan
$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host $auth
  Write-Host "请先运行: gh auth login" -ForegroundColor Yellow
  exit 1
}

# --- git init / commit ---
if (-not (Test-Path (Join-Path $Root ".git"))) {
  Write-Host "==> git init" -ForegroundColor Cyan
  git init
  git branch -M main
}

$status = git status --porcelain
if ($status) {
  Write-Host "==> 提交本地文件" -ForegroundColor Cyan
  git add .
  git commit -m "chore: initial life-clock project (app + README + bootstrap)"
} else {
  Write-Host "==> 工作区干净，跳过 commit" -ForegroundColor DarkGray
}

# --- create repo ---
$visibility = if ($Public) { "--public" } else { "--private" }
$remote = $null
try {
  $remote = git remote get-url origin 2>$null
} catch { $remote = $null }

if (-not $remote) {
  Write-Host "==> 创建 GitHub 仓库: $RepoName ($visibility)" -ForegroundColor Cyan
  gh repo create $RepoName `
    $visibility `
    --source=. `
    --remote=origin `
    --description $Description `
    --push:$(-not $SkipPush)
  if ($LASTEXITCODE -ne 0) {
    # older gh: --push is flag only
    gh repo create $RepoName $visibility --source=. --remote=origin --description $Description
    if (-not $SkipPush) {
      git push -u origin main
    }
  }
} else {
  Write-Host "==> 已有 origin: $remote" -ForegroundColor DarkGray
  if (-not $SkipPush) {
    Write-Host "==> push main" -ForegroundColor Cyan
    git push -u origin main
  }
}

if ($SkipIssues) {
  Write-Host "==> 跳过 Issues" -ForegroundColor DarkGray
  gh repo view --web
  exit 0
}

# --- issues ---
$issues = @(
  @{
    Title = "docs: 补充 GitHub Pages 部署步骤"
    Body  = @"
## 目标
让用户一键把生命时钟挂到 GitHub Pages。

## 任务
- [ ] README 增加 Pages 截图/开关说明
- [ ] 确认 ``index.html`` 在仓库根目录可直接部署
- [ ] 可选：加 ``.nojekyll``

## 验收
从 Pages 链接打开后，计时功能正常。
"@
  },
  @{
    Title = "feat: 英文界面（i18n）"
    Body  = @"
## 目标
支持中/英切换，默认跟随浏览器语言。

## 任务
- [ ] 抽出 UI 文案字典
- [ ] 增加语言切换按钮
- [ ] localStorage 记住偏好

## 验收
切换语言后主时钟、累计、里程碑文案同步更新。
"@
  },
  @{
    Title = "feat: 分享卡片（已活秒数 / 天数）"
    Body  = @"
## 目标
生成可下载或可分享的「已活多久」卡片图。

## 任务
- [ ] Canvas / SVG 导出 PNG
- [ ] 含出生日期、总天数、总秒数
- [ ] 移动端可用

## 验收
点击分享可下载图片，数字与当前时钟一致。
"@
  },
  @{
    Title = "feat: PWA（可安装到桌面）"
    Body  = @"
## 目标
支持「添加到主屏幕 / 安装应用」。

## 任务
- [ ] ``manifest.webmanifest``
- [ ] Service Worker 离线缓存 ``index.html``
- [ ] 图标 192 / 512

## 验收
Chrome 可安装；断网后仍能打开并计时（字体可降级）。
"@
  },
  @{
    Title = "feat: 可选农历 / 星座显示"
    Body  = @"
## 目标
在出生信息旁可选显示农历生日与星座。

## 任务
- [ ] 引入轻量农历库或自写换算
- [ ] 星座按月日规则
- [ ] 设置项可开关

## 验收
开关打开后信息正确；关闭后界面无多余元素。
"@
  }
)

Write-Host "==> 创建 Issues ($($issues.Count))" -ForegroundColor Cyan
foreach ($issue in $issues) {
  Write-Host "  - $($issue.Title)"
  gh issue create --title $issue.Title --body $issue.Body | Out-Host
}

Write-Host ""
Write-Host "完成。" -ForegroundColor Green
gh repo view --json url,nameWithOwner -q "\"\(.nameWithOwner)  \(.url)\""
Write-Host "Issues: " -NoNewline
gh repo view --json url -q .url
Write-Host "/issues"
