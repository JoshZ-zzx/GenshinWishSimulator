# 原神祈愿模拟器

从 [JoshZ-zzx/ToolBox](https://github.com/JoshZ-zzx/ToolBox) 的图片预览版独立，保留单抽、十连、大小保底、捕获明光、资源回收预测、自定义卡池与统计。

## 新增能力

- 多个 UP 五星目标：命座或依次抽取角色，最多额外 14 个 UP。
- 预算内成功率、50% / 90% / 95% 所需抽数、原石等值和预算缺口。
- 多目标模拟在 Web Worker 中运行，可随时取消；结果显示初始状态与抽样误差。
- 导入和导出完整持久存档：保底、累计统计、自定义角色与武器列表、元素和卡池设置。导入前自动保留一份本地旧存档（键名后缀 `-before-import`）。
- 内置全部 116 名角色头像、31 张武器图及 7 张元素图，统一压缩为 WebP 并封装为独立 SVG 图片文件，总计约 2.6 MiB（未计传输压缩）。图片与页面同站加载，按需请求、异步解码，不再从外部图片站逐张加载。
- 样式、界面逻辑、卡池数据、图片映射和概率引擎分文件维护，无需安装前端依赖。

在“资源规划与出金预测”中切换“单个 UP / 多个 UP”。两个模式共用顶部的起始祈愿状态，切换时保留填写内容。多目标规划使用其中的五星垫数、大小保底和连续歪次数。1 表示额外一个 UP；从未持有到满命填 7。不同角色按同类角色活动祈愿、保底连续继承计算，不含跨卡池类型、不含武器定轨、不计未来收入和资源回收。需要星辉星尘回收时使用原有的单 UP 资源预测。

## 设置分类

右上角齿轮内分为当期 UP、保底与统计、池内范围、角色与武器、存档与迁移五类。桌面为左侧菜单，手机为横向菜单。分类切换保留未保存内容，点击“保存全部配置”统一生效；导入导出使用已保存的数据。

## 从旧版迁移

1. 在以前使用模拟器的相同浏览器、相同域名打开 [ToolBox 存档迁移页](https://joshzhangzzx.top/GenshinMigration.html)。
2. 按旧版类型导出普通 v2 或图片版 JSON。两种存档相互独立，请分别保留。
3. 打开本项目站点，在右上角设置 → “存档与迁移”导入。导入会替换当前站点存档，建议先备份。

旧版并未持久保存逐抽历史，因此迁移只覆盖旧版实际保存的配置、状态和累计统计。CSV 预测结果不是可恢复存档。浏览器本地数据不能跨域名自动读取，切换到自定义域名前请再导出一次。

## 本地运行与测试

```sh
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
node --test tests/*.test.cjs
```

无需构建即可发布。通过 HTTP 访问以支持 Web Worker；直接双击 HTML 不作为完整功能的运行方式。

## GitHub Pages 与域名

可先通过 `https://joshz-zzx.github.io/GenshinWishSimulator/` 访问。所有站内资源均使用相对路径，兼容仓库子目录和未来的子域名根目录。

若要绑定 `ys.joshzhangzzx.top`：

1. 到本仓库 Settings → Pages，把 Custom domain 设为 `ys.joshzhangzzx.top`。
2. 域名服务商添加 CNAME：主机记录 `ys`，值 `joshz-zzx.github.io`（不加协议和仓库名）。
3. 等待 DNS 与证书准备好，开启 Enforce HTTPS。

本项目初次发布不预置 CNAME，以免 DNS 尚未配置时影响默认地址访问。域名配置不会修改 ToolBox 主域名。官方说明：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 概率模型与素材

当前模型完整沿用 ToolBox 源码，不声明为游戏服务器的精确实现。逐抽软保底曲线及捕获明光的部分行为属于原工具采用的拟合假设。卡池默认配置为项目预设，不会自动获取最新游戏卡池。结果仅供概率体验和资源规划，不能预测真实账号。

图片清单继承自原版；全部内置角色、武器与元素图已下载至 `assets/`，角色与武器缩放至不超过 192×192，元素图不超过 64×64，保留透明背景并编码为 WebP，随后内嵌到独立 SVG 图片中。每个 SVG 都自包含，没有远程图片引用；这种纯文本封装便于批量维护和提交，无需运行时额外解包。页面只引用本仓库图片，图片损坏或自定义角色没有对应图时保留名称与占位符，不会再向外部图片源发起兜底请求。

元数据原始注释指向 theBowja/genshin-db（5.2.14），来源包括 HoYoLAB、Enka.Network、FylzX/genshinpull 和 Genshin wiki。`assets/manifest.json` 记录每张图片的原始 URL、尺寸、字节数与 SHA-256，以及内嵌 WebP 的大小和校验值；`data/image-sources.json` 保存候选源清单。游戏角色、名称与素材相关权利属于其权利人，源码许可证不代表对这些素材的额外授权，本项目为非官方工具。

更新素材可安装 Pillow 后执行 `python3 scripts/sync-assets.py`，然后按清单检查下载结果。平时运行网站不需要 Python 或图片库。

源码沿用原仓库 GPL-3.0 许可，见 LICENSE。

## 文件结构

- `index.html`：页面结构
- `css/style.css`：响应式样式
- `data/catalog.js`：角色、武器、元素与默认卡池配置
- `data/images.js`：站内图片路径映射
- `assets/`：角色、武器与元素图片及来源清单
- `scripts/sync-assets.py`：维护素材下载与压缩
- `js/engine.js`：共享概率与资源回收逻辑
- `js/app.js`：交互、渲染和存档
- `js/planner-worker.js`：多目标后台模拟
- `tests/engine.test.cjs`：概率边界与规划测试
