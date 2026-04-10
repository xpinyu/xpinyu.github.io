---
title: "Dedao Continuation Runbook"
course: "万维钢·现代思维工具100讲"
last_verified: "2026-04-10"
type: "agent-runbook"
---

# Dedao Continuation Runbook

## 目的

给下一位 agent 一个**最短可执行路径**，继续把这门课后续讲次整理成当前目录下同风格的学习版 `markdown`。

不要重新研究：

- 登录怎么恢复
- 哪个页面更稳
- 哪些选择器最靠谱
- 为什么 `networkidle` 会卡

直接按下面做。

## 已知边界

- 当前目录里，`00-23` 已完成。
- 已排除：`特别放送｜来领取你的《现代思维工具词典》`
- 已纳入正式编号：`特别放送：基本世界观模块答疑直播笔记`，对应 `13-special-qa-notes.md`
- `2026-04-10` 这次最后验证时，网页实际可见正式讲次只到 `23`。如果未来网页已更新到 `24+`，直接从本 runbook 继续。

## 输出约束

- 最终产物是**高保真学习版笔记**，不是原文全文转存。
- 默认目标是**信息损失最小**，不是篇幅最短。
- 优先保全：`事实 -> 观点 -> 逻辑 -> 例子`，其中**例子尤其不要丢**。
- 如果“更短”和“更完整”冲突，优先选更完整。
- 原始正文只能临时落到 `.draft/.dedao-tmp/`。
- 如果要在学习笔记末尾加“附录”，附录只能是**结构化附录**，不能是整篇 raw 正文。
- 新文件命名继续沿用当前风格：`NN-short-slug.md`
- 更新 `index.md`
- 不要发明还没出现在网页里的讲次

## 最短路径

### 1. 只用这个本地浏览器工具

```sh
B="/Users/pinyu/.cursor/skills/gstack/browse/dist/browse"
```

### 2. 每次开始前先恢复登录态

浏览器服务一重启，session 可能丢。

先跑：

```sh
"$B" cookie-import-browser chrome --domain www.dedao.cn
"$B" cookie-import-browser chrome --domain .dedao.cn
"$B" goto "https://www.dedao.cn/course/detail?id=eN7ndm2ploEVb1aHm9KA48zLBYG1vq"
"$B" text
```

成功标志：页面文本里出现这些词即可继续：

- `退出登录`
- `继续学习`
- `万维钢·现代思维⼯具100讲`

如果没恢复成功，不要瞎试文章页。直接：

```sh
"$B" cookie-import-browser
```

然后让用户在浏览器里勾选 **所有 `dedao` 相关域名**。

## 3. 永远从课程详情页起步，不要直接裸开文章页

直接 `goto /course/article?...` 在 session 不稳时很容易掉到登录页。

稳定路径是：

1. 先到课程详情页
2. 切到 `课程内容`
3. 展开列表
4. 从详情页点标题进文章页

## 4. 详情页拿可见标题列表的最短方法

```sh
"$B" js "(() => { const tab = Array.from(document.querySelectorAll('*')).find(el => (el.innerText || '').trim() === '课程内容'); if (tab) tab.click(); return true; })()"
sleep 2
"$B" js "(() => { const btn = Array.from(document.querySelectorAll('*')).find(el => (el.innerText || '').trim() === '展开全部'); if (btn) btn.click(); return true; })()"
sleep 2
"$B" js "JSON.stringify(Array.from(document.querySelectorAll('.lesson-title')).map(el => el.innerText.trim()), null, 2)"
```

这是当前最稳的“已更新讲次列表”入口。

### 说明

- `课程内容` 页里，课程标题节点是 `.lesson-title`
- 不要依赖之前探索时那些脆弱的 `nth-of-type` 折叠面板选择器
- 以后继续拿新讲次，优先按**标题精确匹配**

## 5. 从详情页点开第一篇目标讲次

按**标题文本精确匹配**点击，不要猜编号位置。

```sh
TITLE="身份认同：元认知黑魔法"
"$B" js "(() => { const el = Array.from(document.querySelectorAll('.lesson-title')).find(x => (x.innerText || '').trim() === '$TITLE'); if (!el) return 'NO_EL'; el.click(); return 'OK'; })()"
```

## 6. 文章页不要等 `networkidle`，直接轮询正文标题

文章页会有持续打点，`wait --networkidle` 经常超时。

正确做法：

```sh
for i in 1 2 3 4 5 6 7 8 9 10; do
  ok=$("$B" js "document.querySelector('.article-body') ? document.querySelector('.article-body').innerText.startsWith('$TITLE') : false")
  case "$ok" in *true*) break;; esac
  sleep 1
done
```

然后再抓正文：

```sh
"$B" js "document.querySelector('.article-body') ? document.querySelector('.article-body').innerText : ''" > ".draft/.dedao-tmp/24-some-slug.txt"
```

## 7. 进入文章页后，后续讲次直接点侧边栏标题

文章页里最稳的入口是侧边栏 `.course-nav .article-list-title`。

不要再回详情页一篇篇找。

### 点击下一篇的最短写法

```sh
NEXT_TITLE="安全感：人需要有所依靠"
"$B" js "(() => { const el = Array.from(document.querySelectorAll('.course-nav .article-list-title')).find(x => (x.innerText || '').trim() === '$NEXT_TITLE'); if (!el) return 'NO_EL'; el.click(); return 'OK'; })()"
```

然后仍然用第 6 步的标题轮询法，确认 `.article-body` 第一行已经切到目标讲次，再保存正文。

## 8. 推荐的串行提取模式

不要并行点。浏览器是单会话有状态的，并行点击会互相覆盖。

正确模式：

1. 点击目标标题
2. 轮询 `.article-body` 第一行是否等于目标标题
3. 保存正文到临时文件
4. 再点下一篇

## 9. 临时目录与清理

开始前：

```sh
mkdir -p "/Users/pinyu/pinyu/xpinyu.github.io/.draft/.dedao-tmp"
```

结束后：

- 删除本批次 `.txt`
- 删除空的 `.draft/.dedao-tmp`

不要把原始全文长期留在 repo。

## 10. 笔记格式不要重新设计

直接跟当前目录已有文件保持一致，参考：

- `20-identity.md`
- `21-security.md`
- `22-track-selection.md`
- `23-field.md`

保持：

- frontmatter
- `# 标题`
- `## 三句摘要`
- 后续用同样密度的“诊断 / 工具 / 论证链 / 关键例子 / 反直觉点 / 给自己的应用版本 / 可继续追问的问题 / 复习卡”
- 如用户明确要求，可在文末追加 `## 附录`

不用逐字复制原文，但要保留：

- 明确事实
- 作者的判断和立场
- 关键例子
- 核心论证链
- 关键限定词与边界条件
- 重要概念之间的关系

### 高保真优先级

写的时候按下面顺序保真，不要为了“好看”过度压缩：

1. `事实层`：人物、研究、实验、案例、结论、数字、条件
2. `观点层`：作者明确赞成什么、反对什么、纠正了什么误解
3. `逻辑层`：前提是什么，推导怎么走，结论为什么成立
4. `例子层`：具体故事、类比、历史案例、现实场景，尤其不要只留结论不留例子
5. `边界层`：例外、 caveat、限制、风险、反直觉点
6. `术语层`：概念名、学者名、理论名、关键英文词

### 高保真写法

- 宁可把一讲拆成更多小节，也不要把多段论证压成一句空话
- 问答讲要尽量保留 `问题 -> 回答 -> 更底层原则`
- 工具讲要尽量保留 `问题场景 -> 工具定义 -> 工作机制 -> 应用场景`
- 如果原文里有强例子，正文中至少保留一个完整版本，附录里再补例子索引
- 不要把“作者的结论”写得比原文更温和、更中性或更像百科词条
- 不要为了追求整齐，把原文里明显重要的反例、保留意见、限定语抹平
- 如果不确定该删什么，默认**少删**

### 附录怎么写

如果用户要求在学习笔记最后放“附录”，使用下面这种**非全文**格式：

- `原文结构附录`：按原文推进顺序列 5-12 个段落级提纲
- `事实清单`：列出本讲出现的关键事实、研究、数字、人物和实验
- `观点与判断清单`：列出作者明确主张、反对、纠正的点
- `论证骨架`：把前提、转折、结论按顺序列出
- `关键短摘`：只保留短句或很短的关键表述，不拼成长段连续原文
- `术语与人物`：列出本讲出现的核心概念、学者、案例
- `例子索引`：列出本讲最关键的例子及其作用

不要做：

- 不要把 `.article-body` 全文直接贴进最终 `md`
- 不要把连续大段原文作为“附录”
- 不要用“附录”这个名字重新包装全文转存

## 11. 更新目录的规则

每次补新讲次时，同时更新：

- `index.md` 的 frontmatter 标题范围
- “当前已整理范围”
- “学习顺序”
- “贯穿线索”

如果网页仍然只显示到某个讲次，就在 `index.md` 里明确写边界说明，不要假装后面已经可得。

## 12. 已验证有效的标题抓取/点击策略

### 详情页标题列表

```js
Array.from(document.querySelectorAll('.lesson-title')).map(el => el.innerText.trim())
```

### 文章页侧边栏标题列表

```js
Array.from(document.querySelectorAll('.course-nav .article-list-title')).map(el => el.innerText.trim())
```

### 当前文章正文标题

```js
document.querySelector('.article-body')?.innerText?.split('\n')[0] || ''
```

这三个足够应付继续整理。

## 13. 你最容易浪费时间的坑

- 坑 1：直接开文章页，结果掉登录页  
  解决：先导 cookie，再从课程详情页进入

- 坑 2：依赖 `wait --networkidle`  
  解决：永远轮询 `.article-body` 第一行

- 坑 3：并行点击多篇  
  解决：只能串行

- 坑 4：重新研究 DOM 折叠面板  
  解决：直接用 `.lesson-title` 和 `.course-nav .article-list-title`

- 坑 5：把原始全文留在 repo  
  解决：临时文件写完就删

- 坑 6：把全文换个标题叫“附录”继续落地  
  解决：附录只能放结构化提纲、关键短摘和索引，不放整篇正文

- 坑 7：为了简洁把事实、例子和推理链压没了  
  解决：默认高保真优先，先保 `事实 / 观点 / 逻辑 / 例子`

## 14. 一句话版

先导入 `www.dedao.cn` 和 `.dedao.cn` 的 Chrome cookie，从课程详情页进入 `课程内容`，用 `.lesson-title` 精确匹配打开第一篇，再在文章页用 `.course-nav .article-list-title` 精确匹配切下一篇；每次都轮询 `.article-body` 第一行确认标题后再保存正文，最后按现有模板写**高保真**学习版笔记，优先保全 `事实 / 观点 / 逻辑 / 例子`，如需附录只放结构化补充，并清理临时全文。
