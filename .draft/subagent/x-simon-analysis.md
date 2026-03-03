# Cursor Subagents 技术博客文章：Problem Space 深度分析

> **方法论**：Herbert Simon 问题表征方法论
> **输出**：x-simon 综合分析（Phase 1 表征构建 + Phase 2 三路并行委派 + Phase 3 结构性验证综合）
> **日期**：2026.03.03

---

## 0. 元判断：三路委派的收敛与分歧

三个 agent（x-claude, x-gemini, x-gpt）收到同一份 Problem Blueprint，返回了以下结构性差异：

| 维度 | x-claude | x-gemini | x-gpt |
|------|----------|----------|-------|
| **表征批评** | 7 步太多，约束满足对部分特性不诚实（Markdown 不是唯一解） | 缺底层动力学引擎（"为什么需要约束"） | 约束链缺少不变量锚点，容易变成"伪装的功能列表" |
| **核心提议** | 约束 + 最简原则双引擎，压缩到 4 步 | Context Economics / Attention Dilution 作为第一性原理 | 二元不变量（Routing + Isolation）+ 约束推导混合表征 |
| **文章步数** | 4 章 | 5 章 | 7 约束 + 8 章 |
| **钩子** | "简单到可疑" | "Context 悖论：2M context 却犯低级错误" | "让 AI 变'更笨'反而更可靠" |
| **核心类比** | HR 系统 / Org Chart | Unix 哲学 + HR / OOP for attention | OS 进程隔离 + 岗位说明书 |

**收敛点**（三路一致 → 高置信度）：
1. "重新发明"叙事是正确的基本结构
2. Context overflow 是启动痛点
3. "Job description = interface" 是核心洞察
4. 组织类比（org chart）是表征变换的主载体
5. 最大风险：重新发明退化成换皮教程

**分歧点**（需要裁决）：
1. 步数：4 vs 5 vs 7 → 下文分析
2. 底层原理：最简原则 vs context economics vs routing+isolation → 下文分析
3. 钩子选择 → 下文分析

---

## 1. Problem Space 构建

### 1.1 初始状态 S₀

| 状态变量 | 已知赋值 |
|---------|---------|
| 读者技能 | 基本 Cursor 用法，用过单 agent |
| 读者心智模型 | "AI 助手 = 我对话的单一实体" |
| 读者未命名痛点 | context 溢出、顺序执行瓶颈、单 agent 认知干扰 |
| 读者对 multi-agent 的认知 | 零。可能听过概念但没有操作经验 |
| 读者对组织管理的认知 | 有（所有人都有管理/被管理的经验）← **这是关键的已有资源** |

### 1.2 目标状态 S*

| Goal Test | 判定方式 |
|-----------|---------|
| **能做（Practical）** | 给定一个项目需求，读者能创建 `.cursor/agents/*.md` 定义文件 |
| **能解释（Conceptual）** | 读者能说出每个 frontmatter 字段解决什么失败模式 |
| **能设计（Generative）** | 给定一个新项目，读者能独立架构 agent 团队，而非照搬模板 |

第三层（Generative）是核心——前两层任何教程都能做到。文章的差异化价值在于第三层。

### 1.3 约束集合

**Hard constraints**:
- H1: 技术准确（Cursor subagent 的真实机制）
- H2: 中文行文，英文技术术语
- H3: 渐进深度揭示（作者风格核心特征）
- H4: 不是步骤教程（参考文章的明确弱点）

**Soft constraints**:
- S1: 包含 SVG/ASCII 图解
- S2: 反直觉钩子开场
- S3: 2000-4000 字当量（4-6 个主章节最佳节奏）
- S4: 至少一个可直接复制使用的完整 agent 定义示例

### 1.4 关键未知项

| 未知项 | 影响 | 最小假设 |
|--------|------|---------|
| Cursor 是否支持 `.cursor/agents/` 子目录递归加载 | 影响"文件夹=团队"的字面准确度 | 假设不支持子目录；用命名空间约定（`frontend-review.md`）替代 |
| `description-based delegation` 的稳定性 | 影响隐式路由能否作为核心论点 | 假设基本稳定但有边界；把显式 `/agent-name` 作为主线，隐式作为"可选加速器" |
| 并行执行的真实触发条件 | 影响并行叙事的准确度 | 假设通过 description 匹配可触发多个 subagent 并行 |

---

## 2. 表征分析与选择

### 2.1 三种候选表征

**表征 A：「重新发明作为纯约束满足」（原始方案）**
- 结构：每步添加一个约束 → 唯一解浮现
- 优点：统一 how 和 why；读者有"自己推导出来"的成就感
- 致命缺陷（x-claude 指出）：**对部分特性，约束不真正收敛到唯一解**。Markdown 是设计偏好，不是约束推导。7 步在 3000 字内无法充分展开。

**表征 B：「Context Economics 驱动的组织重构」（x-gemini 提议）**
- 结构：以 Attention Dilution 为第一性原理，推导出"上下文隔离比全知更重要"
- 优点：有理论根基；"Context 悖论"钩子冲击力强
- 风险（x-gpt 暗示）：Attention Dilution 虽然直觉正确，但缺乏可引用的硬数据支撑。如果未来模型解决了 long-context attention 问题，论点会过期。

**表征 C：「二元不变量 + 约束推导」（x-gpt 提议，x-claude 修正）**
- 结构：以 Routing（把任务送到对的角色）和 Isolation（让角色互不干扰）为两个不变量，每章回扣
- 优点：读者离开文章时带走的是可迁移的设计原则，不是 Cursor 特定的功能列表
- 风险：过于抽象可能让新手迷路

### 2.2 综合裁决：选定表征

**选定：「约束 + 最简原则」双引擎 + Routing/Isolation 不变量框架**

具体操作化：
1. **叙事引擎** = 约束 + 最简原则（x-claude）。每步的结构是：
   - 约束收窄可行解空间（排除不可行方案）
   - 最简原则在可行方案中选出最自然的那个
   - 读者感受到：「对，如果是我也会这么选」
2. **深层锚点** = Routing + Isolation 不变量（x-gpt）。文章结尾的 Takeaway 将所有机制归结为这两个可迁移原则
3. **理论基础** = Context Economics（x-gemini），但降级为"动机层"而非"证明层"——用它解释 *为什么需要分工*，但不把整篇文章的论证建立在"attention dilution 是数学事实"之上
4. **步数** = 4-5 个主章节（x-claude 的节奏判断，符合作者已有文章的最佳实践）

**为什么这个组合优于任何单一提议**：
- 纯约束满足（A）在 Markdown/YAML 处不诚实 → 双引擎修正
- 纯 Context Economics（B）依赖可能过期的技术前提 → 降级为动机
- 纯不变量框架（C）过于抽象 → 作为总结框架而非叙事主线

### 2.3 表征的外化检验

表征中可被编译为非自然语言可验证制品的要素：

| 要素 | 外化制品 |
|------|---------|
| S₀ → S* 的差异 | 可执行的 goal test（给读者一个项目需求，看能否独立设计 agent 团队） |
| 约束链 | 每步的"删掉会怎样"可在 Cursor 中实际演示 |
| Agent 定义 | 可直接复制到 `.cursor/agents/` 的 Markdown 文件 |
| 并行 vs 串行 | 可用时间线对比图形式化 |

满足外化检查。表征不退化。

---

## 3. 近分解性分析

### 3.1 子系统识别

```
文章 = Module A × Module B × Module C × Module D

A: 动机层（为什么需要 subagent？）
B: 重新发明层（如何从痛点推导出每个设计决策？）
C: 实战层（最小可行团队 + 可复制定义）
D: 升华层（从工具到组织原理的表征变换）
```

### 3.2 耦合分析

```
A ──→ B ──→ C
       │         
       └──→ D
```

- **A → B**（强耦合）：动机直接驱动重新发明序列的起点
- **B → C**（中耦合）：重新发明的产物 = 实战层的输入
- **B → D**（中耦合）：重新发明过程中逐步积累的洞察在 D 中收束
- **C 与 D**（弱耦合）：可独立打磨

### 3.3 求解顺序

1. **先解 A + B**（load-bearing）：动机和重新发明序列一旦锁定，C 和 D 几乎自动生成
2. **再解 D**：升华需要 B 的所有洞察作为输入
3. **最后解 C**：实战例子是 B 的具象化，可以独立迭代

---

## 4. 差异分析（S₀ → S*）

### 4.1 差异枚举

| # | 差异 | 类型 | Load-bearing? |
|---|------|------|---------------|
| Δ1 | 读者不知道为什么需要 multi-agent | 动机缺失 | **是** — 解决后 Δ2-Δ6 才有意义 |
| Δ2 | 读者不知道 subagent 的定义格式 | 知识缺失 | 否 — 展示即可 |
| Δ3 | 读者不理解每个 frontmatter 字段的设计理由 | 理解缺失 | **是** — 这是"能解释"层的核心 |
| Δ4 | 读者没有"路由"和"隔离"的设计直觉 | 心智模型缺失 | **是** — 这是"能设计"层的前提 |
| Δ5 | 读者没有可参考的完整例子 | 实战缺失 | 否 — 提供即可 |
| Δ6 | 读者仍将 subagent 视为"工具"而非"组织原理" | 表征未变换 | **是** — 文章的终极目标 |

### 4.2 依赖排序

```
Δ1（动机）→ Δ3（设计理由）→ Δ4（设计直觉）→ Δ6（表征变换）
              ↓
            Δ2（格式知识）→ Δ5（完整例子）
```

Δ1 是根节点。文章如果在 Δ1 上失败（读者不认同痛点），后续全部失效。

### 4.3 距离度量

文章的每一章应该可观测地缩小以下指标之一：
- 读者能命名的痛点数量（0 → 3）
- 读者能解释的 frontmatter 字段数量（0 → 5）
- 读者能独立设计的 agent 角色数量（0 → 4+）

---

## 5. "重新发明"叙事的精确设计

### 5.1 起点问题（场景化痛点）

> 你让 Cursor agent 重构一个项目的 auth 模块。你说"先读完相关文件理解架构，然后重构"。Agent 花了 30 轮读文件、分析依赖。你说"好，开始重构吧"——
>
> 它开始写代码，但不断犯低级错误：使用已删除的函数名、忽略它 10 轮前刚分析出的依赖关系、甚至在同一段 trace 中前后矛盾。
>
> 它不是不聪明。它是**失忆了**——前 30 轮的分析挤满了 context window，新的代码任务被推到了注意力的边缘。
>
> 你的直觉反应不是"我需要更聪明的 AI"。而是——**"这个活不应该是同一个人做的。"**

### 5.2 推导步骤

**压力点 ①：Context 溢出 → 发明"分工"**

| 维度 | 内容 |
|------|------|
| 子问题 | 怎么让"找线索"不污染"写改动"？ |
| 约束 | 单一 context window 的物理极限 |
| 发明 | Subagent = 独立的执行单元，自带独立 context |
| 「嘿」时刻 | "分工不是 Cursor 的功能——是信息处理系统的基本需求。人类在一万年前就想到了。" |
| 反证（删掉会怎样） | 回到单 agent 的 context 混汤状态 |

**压力点 ②：角色需要持久化定义 → 发明"Markdown + YAML"**

| 维度 | 内容 |
|------|------|
| 子问题 | 怎么把角色的"性格"和"规矩"固定下来，不用每次重写？ |
| 约束 1 | 必须持久化（文件）、可复用、可版本控制 |
| 约束 2 | 必须人可读写（排除 JSON/protobuf → Markdown） |
| 约束 3 | 需要机器可读的结构化元数据（YAML frontmatter） |
| 最简原则 | Markdown + YAML frontmatter 是每个代码项目都已有的惯例（README.md, Jekyll, Hugo...） |
| 发明 | `.cursor/agents/*.md` = 岗位说明书 |
| 「嘿」时刻 | "这不就是一份 job description 吗？`name` = 职位名，`description` = 一句话职责，`model` = 资质要求，`readonly` = 权限等级，prompt = 详细 SOP" |
| 反证（删掉会怎样） | 每次聊天都要重新描述角色，无法沉淀团队能力 |

**压力点 ③：需要并行 → 发现"隔离是并行的前提"**

| 维度 | 内容 |
|------|------|
| 子问题 | 三个 agent 能同时工作吗？ |
| 约束 | 共享 context = 互相干扰 → 必须隔离 |
| 悖论洞察 | **隔离不是限制——是并行的前提。** 进程之所以能在多核上并行，恰恰因为不共享内存。你必须先分开它们，才能让它们同时工作 |
| 发明 | Context isolation → parallel execution |
| 延伸 | `is_background: true` = 这个人去做调研，你自己先推进别的 |
| 反证（删掉会怎样） | "三个人共用一张办公桌" → 互相覆盖、被迫排队 |

**压力点 ④：需要层级 + 组织 → 发明"递归委派 + 文件夹 = 团队"**

| 维度 | 内容 |
|------|------|
| 子问题 | 真正复杂的项目需要层级结构——一个 agent 能不能派遣另一个 agent？ |
| 约束 | 单层分工不够 → 需要递归 + 组合 |
| 发明 | 递归委派（agents call agents）+ 文件夹组织 |
| 「嘿」时刻 | **"一个 Markdown 就是一个 agent，一个文件夹就是一个团队。"** |
| 表征变换高潮 | 把 `.cursor/agents/` 文件夹和真实团队 org chart 并排展示——1:1 映射 |
| 反证（删掉会怎样） | 所有 agent 平铺 → 谁也不知道谁负责什么 → 任务冲突 |

### 5.3 终点揭示

当读者走完 4 步，回头看 `.cursor/agents/` 文件夹时，它不再是"Cursor 的一个配置目录"——它是一份 org chart：

```
.cursor/agents/
├── architect.md        ← 技术主管：分析需求 → 拆分任务 → 分派
├── frontend.md         ← 前端专家：React/CSS/UI
├── backend.md          ← 后端专家：API/数据库
├── code-reviewer.md    ← 代码审查员（readonly）
└── test-writer.md      ← 测试工程师
```

每个 `.md` 文件是一位团队成员的角色说明书。YAML frontmatter 是 HR 系统里的权限配置。文件夹结构是组织架构。

这个揭示的力量在于：**读者不需要学习新概念。他们已经知道如何管理人。现在只需要把同样的直觉应用到 agents 上。**

---

## 6. 表征变换策略

### 6.1 变换目标

| 维度 | 变换前 | 变换后 |
|------|--------|--------|
| 框架 | 工具 / API | 组织设计原理 |
| 心智模型 | "我调用一个函数" | "我设计一个团队" |
| 学习模式 | 程序性（步骤） | 设计性（原则） |
| 迁移能力 | 只能复制模板 | 能为新问题设计新团队 |

### 6.2 三个锚点

**锚点 1 · 类比：`.cursor/agents/` ↔ HR 系统**

在 §01（压力点 ②）中直接展示 1:1 映射表，让读者自己得出结论：

| `.cursor/agents/` | 创业团队 |
|---|---|
| 一个 `.md` 文件 | 一个岗位 |
| `name` | 职位名 |
| `description` | 招聘帖标题（一句话职责） |
| `model` | 资质要求（初级 / 高级） |
| `readonly` | 权限等级（只读 / 可写） |
| prompt 正文 | 详细 SOP / 员工手册 |
| `/agent-name` | 直接点名 |
| auto-delegation | 项目经理分配任务 |

**锚点 2 · 对比：Cursor Subagents vs 传统 Multi-Agent 框架**

| Cursor Subagents | 传统框架（LangGraph / CrewAI） |
|---|---|
| 接口 = 自然语言 | 接口 = Python API |
| 定义 = Markdown | 定义 = 代码 |
| 编排 = description-based routing | 编排 = 显式状态机 / DAG |
| 学习成本 ≈ 写 README | 学习成本 ≈ 学新框架 |

核心设计选择：**把编排复杂度从用户侧推到系统侧**。你声明你要什么（description），系统决定怎么做（routing）。这和 SQL 的设计哲学一样。

**锚点 3 · 反证法：每个字段的"删掉会怎样"**

这是 x-gpt 贡献的最强反教程机制——不是告诉读者每个字段"是什么"，而是问"如果没有它，系统会怎样失败"：

- 删 `description` → router 失明，自动委派退化为全靠手动
- 删 `readonly` → 探索角色也能改代码，破坏面扩张
- 删 isolation → 并行变成"多人共用一个大脑"，互相覆盖记忆
- 删 `is_background` → 所有任务串行，主线阻塞

---

## 7. 最优文章结构

### 7.1 Meta 信息

- **英文标题**：*The Markdown Org Chart*（或 *Hiring Your AI Team*）
- **中文副标题**：一个 Markdown 就是一个 agent，一个文件夹就是一个团队
- **Eyebrow**：Multi-Agent × Organizational Design

### 7.2 钩子设计

**综合裁决**：采用 x-gemini 的 "Context 悖论" + x-gpt 的 "让 AI 变笨反而更可靠" 的混合版：

> 你可能以为 multi-agent 协作需要复杂的编排框架。Cursor 把全部定义压缩成了一个 Markdown 文件。
>
> 更反直觉的是：让每个 agent **知道更少**（上下文隔离），反而让整个系统**犯更少的错**。
>
> 一个 Markdown 就是一个 agent。一个文件夹就是一个团队。这听起来简单到可疑——但恰恰是这种"可疑的简单"背后，藏着一条精心推导过的设计决策链。

### 7.3 章节结构

---

**Core Thesis**

> Cursor Subagents 表面上是"把任务派给子进程"的工具特性。但它暗含一个更激进的命题：**自然语言 job description 就是接口，Markdown 就是可执行的员工**。Multi-agent 协作不需要编排框架——它需要组织设计。而组织设计，是每个人都有直觉的领域。

---

**§00 · 一个程序员和他的瓶颈**
- Section-hook: *「你给 AI 的信息越多，它忘记的也越多。」*
- 认知目标：建立痛点共鸣 → context overflow, sequential bottleneck, cognitive interference
- 内容：重构 auth 模块的失忆场景 → "这个活不应该是同一个人做的"
- 转换 → §01：人类解决信息过载的方式 = 分工

**§01 · 简历就是接口**
- Section-hook: *「Cursor 选了程序员最熟悉的格式来定义 agent：README。」*
- 认知目标：理解 subagent 定义的完整结构 + **为什么是这个结构**
- 内容：
  - 约束推导：持久化 → 文件；人可读 → Markdown；结构化元数据 → YAML frontmatter
  - 展示第一个完整定义文件（code-reviewer.md）
  - 核心洞察：job description = interface → 1:1 映射表
  - 调用方式双轨：`/agent-name`（显式）+ description-based（隐式）
- 转换 → §02："一个 agent 搞定了。三个 agent 能同时工作吗？"

**§02 · 隔离不是限制**
- Section-hook: *「你雇了三个人，却只给一张办公桌——这就是共享 context 的 multi-agent。」*
- 认知目标：理解上下文隔离是并行的**前提条件**而非副作用
- 内容：
  - 共享 vs 隔离对比表（Versus box）
  - 核心悖论：**隔离越强，并行越真实**
  - `is_background` = "这个人去做调研，你先推进别的"
  - 类比：操作系统的进程隔离
- 转换 → §03："并行了。但真正复杂的项目需要层级——agent 能不能派遣 agent？"

**§03 · 一个文件夹就是一个团队**
- Section-hook: *「agents compose like functions——但比函数更容易组合，因为接口是自然语言。」*
- 认知目标：递归委派 + 文件夹组织 → 完整的组织设计能力
- 内容：
  - 递归委派：architect → frontend / backend / test-writer
  - `.cursor/agents/` 文件夹结构展示
  - **表征变换高潮**：文件夹 vs org chart 并排展示
  - 核心洞察：**你不是在配置 Cursor，你是在搭建 AI 团队。如果你会管理人，你就会管理 agents。**
- 转换 → §04："好，让我们实际搭一个。"

**§04 · 你的第一支特种部队**
- Section-hook: *「不要写代码，去写'写代码的人'。」*
- 认知目标：从理解到会用的最后一跃
- 内容：
  - 完整场景：Fix a bug + add test + verify + write PR summary
  - 4 个完整 agent 定义（explorer, implementer, verifier, reviewer）
  - 单 agent vs subagents 时间线对比
  - 设计原则提炼：Routing + Isolation

**Takeaway**

> Cursor Subagents 的真正贡献不是"你可以并行运行多个 AI"。而是一个更激进的发现：**multi-agent 协作的最佳接口不是 API，不是 SDK——是自然语言。** 一份 Markdown 是一个角色说明，一个文件夹是一个组织架构，一次 `/agent-name` 调用是一句"帮我找 XX 处理这件事"。
>
> 你要带走的两个不变量：**Routing**（把任务送到对的角色）和 **Isolation**（让角色互不干扰）。掌握这两点，你就能为任何项目设计 agent 团队——不是因为你学会了 Cursor 的功能，而是因为你理解了协作的本质。

---

## 8. 实战例子设计

### 8.1 选择原则

最佳例子必须：
1. 同时包含探索、实现、验证、总结（否则体现不出 Routing/Isolation 价值）
2. 展示显式 `/agent-name` 与隐式 delegation 的互补
3. 任何项目都能套用（不限技术栈）
4. 输出可直接复制到 `.cursor/agents/`

### 8.2 推荐场景

**"Fix one bug + add test + verify + PR summary"**——最通用、最可迁移。

### 8.3 完整 Agent 定义

**explorer.md**
```markdown
---
name: explorer
description: Locate relevant files and explain current behavior with evidence. No edits.
model: fast
readonly: true
---
You are a repository exploration specialist.

Rules:
- Cite exact files and line numbers for every claim
- Output: (1) relevant file paths, (2) what each does, (3) hypotheses, (4) what to inspect next
- Never propose changes. Your job is evidence gathering.
```

**implementer.md**
```markdown
---
name: implementer
description: Implement minimal, targeted fixes based on evidence from explorer
model: default
---
You are a minimal-change implementer.

Rules:
- Prefer the smallest diff that fixes the root cause
- If adding code, also add the smallest test that would have caught the bug
- State assumptions you are relying on
```

**verifier.md**
```markdown
---
name: verifier
description: Run tests, build, and browser checks to validate changes
model: fast
readonly: true
is_background: true
---
You are a verification specialist.

Rules:
- Do not re-argue the implementation
- Output: commands run, results, remaining risk
- Treat verification as an independent job
```

**reviewer.md**
```markdown
---
name: reviewer
description: Review code for bugs, edge cases, and maintainability
model: default
readonly: true
---
You are a strict code reviewer.

Rules:
- Look for hidden coupling, missing edge cases, unsafe assumptions
- Severity levels: critical / warning / suggestion
- Prefer concrete counterexamples over general advice
```

### 8.4 串行 vs 并行时间线对比（文中 ASCII / SVG 图）

```
单 Agent（串行）:
[===== 探索 =====][===== 实现 =====][=== 测试 ===][= 审查 =]
                                                          ↑ 总时间

Subagents（并行 + 流水线）:
[== 探索 ==]
            [===== 实现 =====]
            [==== 验证(bg) ====]
                                [= 审查 =]
                                          ↑ 总时间（更短）
```

---

## 9. 关键假设与失败模式

### 9.1 关键假设

| 假设 | 若为假的后果 | 缓解策略 |
|------|------------|---------|
| 读者核心障碍是"不理解 why"而非"不知道 how" | 文章缺少基础操作指引 | 在 §01 插入最小可工作示例（30 秒可跟做） |
| description-based delegation 足够稳定 | "组织系统"退化为"手动点名的多分身" | 把显式 `/agent-name` 作为主线，隐式作为"可选加速器" |
| 读者认同 context overflow 是真实痛点 | 动机层（§00）失败 → 后续全部失效 | 用具体场景（非抽象论证）建立共鸣 |
| Cursor 的 subagent 机制在近期不会大幅改变 | 文章技术细节过期 | 把论点建立在设计原则而非实现细节上 |

### 9.2 最可能失败的步骤

**§02（隔离 → 并行）的论证。** 三个 agent 一致指出的风险：读者会问"分出去容易，收回来怎么办"——隔离之后的聚合机制是 subagent 系统中最不透明的部分。

缓解：在 §02 末尾明确说明 merge 机制——主 agent 收到每个 subagent 的返回文本，自行综合。承认这是当前系统的简陋之处，但也是"自然语言接口"哲学的自洽结果——合并也是用语言完成的。

### 9.3 什么会改变结论

如果未来大模型真正解决了 long-context attention 衰减问题（单 prompt 效果 ≥ 多 agent 隔离），那"Context Economics"的动机层会崩塌。此时 subagent 的唯一价值退化为"并行提速"。但在 2026 年的技术现实下，这个框架是坚实的。

### 9.4 表征保险

如果"重新发明作为约束推导"在实际写作中显得太刻意（读者闻到"事后合理化"的味道），候补表征是 **"对比叙事"**：

- 先展示单 agent 的典型失败
- 然后展示同一任务用 subagents 完成的过程
- 从对比中提取设计原则

这个表征更直观但更浅——它能完成 Practical 和 Conceptual 层的 goal test，但 Generative 层（独立设计新团队）会打折扣。

---

## 10. 总结：Solution Blueprint

| 维度 | 决策 |
|------|------|
| **表征** | 约束 + 最简原则双引擎，Routing/Isolation 作为总结不变量 |
| **叙事结构** | 重新发明：4 个压力点 → 4 个设计决策 → 完整系统自然浮现 |
| **章节数** | 5 章（00-04）+ Core Thesis + Takeaway |
| **钩子** | Context 悖论 × "可疑的简单" |
| **核心类比** | `.cursor/agents/` = HR org chart |
| **反教程机制** | 每个字段用"删掉会怎样"来解释，而非"是什么" |
| **实战例子** | Fix bug + test + verify + review（4 个完整 agent 定义） |
| **读者带走的可迁移原则** | Routing + Isolation |
| **最大风险** | 重新发明退化为换皮教程 / merge 机制解释不清 |
| **候补表征** | 对比叙事（单 agent vs subagents） |
