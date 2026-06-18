# 华为生态与智能汽车行业周报看板

一个基于 React + TypeScript + Vite + Tailwind CSS 构建的行业情报周报网站。项目通过 Node.js 脚本调用真实新闻搜索 API 与 OpenAI API，对最近 7 天内的华为生态与智能汽车相关新闻进行抓取、筛选、摘要、归类、校验与归档，并自动部署到 GitHub Pages。

## 功能说明

- 每周五中国时间 17:00 自动运行 GitHub Actions
- 抓取最近 7 天真实、可访问、可追溯的新闻来源
- 聚焦固定覆盖范围内的企业与品牌
- 通过 OpenAI 对新闻进行去重、筛选、结构化整理
- 自动生成最新周报 `public/data/latest-report.json`
- 自动归档历史周报到 `public/data/history/YYYY-MM-DD.json`
- 自动更新历史索引 `public/data/history/index.json`
- 前端支持查看最新周报与历史周报
- 支持复制单条新闻 Markdown、复制完整周报 Markdown
- 支持导出 Markdown、CSV、PDF、PNG 长图
- 当没有真实数据时展示空状态，而不是使用 mock 新闻

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui 风格组件
- lucide-react
- Node.js scripts
- OpenAI API
- GitHub Actions
- GitHub Pages

## 项目结构

```text
.github/
  workflows/
    weekly-news.yml
scripts/
  fetchWeeklyNews.ts
  generateWeeklyReport.ts
  updateHistoryIndex.ts
  validateReport.ts
  shared.ts
public/
  data/
    latest-report.json
    history/
      index.json
src/
  components/
  lib/
  types/
  App.tsx
  index.css
  main.tsx
package.json
vite.config.ts
tsconfig.json
tailwind.config.js
postcss.config.js
index.html
```

## 本地安装

```bash
npm install
```

## 本地运行

启动前端：

```bash
npm run dev
```

手动执行一次周报数据更新：

```bash
export OPENAI_API_KEY="your-openai-key"
export NEWS_SEARCH_API_KEY="your-news-api-key"
export NEWS_SEARCH_ENDPOINT="https://example-news-api.com/search?q={query}&from={from}&to={to}&apiKey={apiKey}"

npm run report:update
```

仅校验当前最新周报：

```bash
npm run report:validate
```

## 环境变量与 GitHub Secrets

请在 GitHub 仓库 Secrets 中配置：

- `OPENAI_API_KEY`
- `NEWS_SEARCH_API_KEY`
- `NEWS_SEARCH_ENDPOINT`

说明：

- `OPENAI_API_KEY` 只在 Node.js 脚本里使用，前端不会暴露。
- `NEWS_SEARCH_ENDPOINT` 支持两种形式：
  - 模板 URL：`https://api.example.com/search?q={query}&from={from}&to={to}&apiKey={apiKey}`
  - 标准 GET 接口：脚本会自动追加 `q`、`query`、`from`、`to`、`pageSize`、`language`、`sortBy`、`apiKey` 等参数。

如果你的新闻搜索服务返回字段名与常见结构差异较大，请修改 `scripts/fetchWeeklyNews.ts` 中的 `normalizeResponse`。

## GitHub Actions 定时任务说明

工作流文件： `.github/workflows/weekly-news.yml`

已配置：

- 每周五 UTC 09:00 定时运行，对应中国时间每周五 17:00
- 支持 `workflow_dispatch` 手动触发
- 分为两个 job：
  - `generate-report`：抓取新闻、调用 AI、写入数据、提交更新
  - `deploy`：构建前端并部署到 GitHub Pages

commit message 固定为：

```text
chore: update weekly news report
```

## GitHub Pages 部署说明

1. 将仓库默认分支设置为 `main`
2. 在 GitHub 仓库 Settings -> Pages 中启用 GitHub Pages
3. Pages Source 选择 `GitHub Actions`
4. 推送代码后，或手动触发 `Weekly Huawei News Report` workflow

Vite 构建时会自动根据 `GITHUB_REPOSITORY` 推导仓库子路径，也可以通过 `VITE_BASE_PATH` 手动覆盖。

## 如何手动触发周报更新

1. 打开 GitHub 仓库的 `Actions`
2. 选择 `Weekly Huawei News Report`
3. 点击 `Run workflow`

## 如何替换新闻搜索 API

1. 修改 GitHub Secret `NEWS_SEARCH_ENDPOINT`
2. 如果新服务的返回结构不同，调整 `scripts/fetchWeeklyNews.ts`：
   - `buildRequestUrl`
   - `normalizeResponse`
   - 需要时再补充鉴权 Header

脚本已经内置这些基础过滤：

- 必须有标题
- 必须有 URL
- 必须有发布时间
- 发布时间必须在最近 7 天
- URL 不能命中禁止域名
- 标题或摘要必须命中配置关键词

## 如何修改企业/品牌范围

修改 `scripts/shared.ts` 中的：

- `REPORT_SECTION_TARGETS`
- `HOT_TOPIC_TARGETS`
- `BANNED_DOMAINS`

这会同时影响抓取关键词、关键词命中规则和热点兜底逻辑。

## 如何查看历史周报

- 前端页面点击“查看历史”
- 抽屉会读取 `public/data/history/index.json`
- 选择某一期即可切换到对应历史版本

## 常见问题

### 1. 页面显示“暂无可用周报数据”

这通常意味着：

- GitHub Actions 尚未成功运行
- 新闻搜索 API 没有返回符合规则的结果
- OpenAI 生成结果未通过校验，因而没有写入 `latest-report.json`

### 2. 为什么没有使用 mock 数据？

这个项目明确禁止使用 mock 新闻替代真实新闻。初始仓库会带一个空的 `latest-report.json`，页面因此会显示空状态，直到首次真实数据生成成功。

### 3. 如果本周某个品牌没有新闻怎么办？

会直接跳过，不显示空标题。

### 4. 如果固定覆盖范围完全没有新闻怎么办？

脚本会尝试启用“车圈行业热点板块”兜底；如果连兜底新闻都不满足规则，工作流会失败，并保留线上旧版 `latest-report.json`。

### 5. 已有其他 GitHub Pages 站点怎么办？

GitHub Pages 每个仓库通常只对应一个对外站点。如果当前仓库已经通过其他 workflow 在发布 Pages，新 workflow 可能会覆盖已有站点。更稳妥的做法是为本项目使用独立仓库。
