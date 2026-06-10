<!-- 我们对可及性的承诺对贡献者和库的用户意味着什么。 -->

# 我们关注的重点是可及性

在[ 2019 年贡献者大会](https://p5js.org/community/contributors-conference-2019.html)上，我们承诺只向 p5.js 添加提高可及性（包括包容性和无障碍性）的功能。我们不会接受那些不支持这些努力的功能请求。我们致力于识别、消除和预防与可及性相关的障碍。这意味着要考虑在交叉[^1]体验中可能影响可及性和参与度的多样性方向。这包括了性别、种族、族裔、性别倾向、语言、地理位置等因素的考虑。我们会优先考虑边缘群体的需求，而不是仅维护在 p5.js 社区中特权群体的长期舒适体验。我们正共同探索和研究可及性的含义，并积极学习该如何实践和传授可及性相关的知识。我们选择通过广泛、交叉和联合的框架来思考可及性。这一承诺是我们在[社区声明](https://p5js.org/about/#community-statement)中概述的 p5.js 核心价值观的一部分。

## 可及性的种类

增加可及性并不专注于扩大 p5.js 社区的人数。它是一种持续的承诺，旨在使 p5.js 对因结构性压迫而被排除在 p5.js 社区外的人们更加可用和易于接触。这一承诺扩展到 p5.js 提供的工具和平台。它还包括 p5.js 领导层的组成、决策和行动。我们反对技术文化中对速度、增长和竞争的追求。我们将致力于推行以下互相关照的集体行为：深思熟虑、放慢步调、互相照应和积极负责。

这里的可及性意味着为以下人群改进 p5.js：

- 非英语母语的人
- 黑人、原住民、有色人种以及边缘化民族的人
- 同性恋、双性恋、酷儿、探索中、泛性恋和无性恋的人
- 跨性别、流动性别、无性别、间性人、双精神身份人士、女性以及以及其他性别边缘化的人
- 盲人、聋人[^2]或重听、残疾/有残疾、神经多样性和慢性病[^3]患者
- 收入较低或缺乏经济或文化基础的人
- 几乎没有或很少开源和创意编码经验的人
- 来自多样教育背景的人
- 包括儿童和老年人在内的所有年龄段的人
- 拥有各种技术技能、工具和互联网访问的人
- 来自多样宗教背景的人
- 其他被系统性排除和历史上代表性不足的人
- 及以上所有的交叉复合的人

我们意识到用来描述我们各自身份的术语的复杂性。语言是微妙的、不断发展的，且常常存在争议。这并不是一个详尽的列表。我们努力给予命名，并对我们的承诺及 p5.js 社区的多样需求承担责任。


### 示例
我们认为以下举措有助于增加可及性：

- 将文档和其他资料翻译成更多的语言，从而解构语言帝国主义[^4]（例如，Rolando Vargas 的[用库纳语编程](https://medium.com/@ProcessingOrg/culture-as-translation-processing-in-kuna-language-with-rolando-vargas-and-edinson-izquierdo-8079f14851f7)，Felipe Santos Gomes, Julia Brasil, Katherine Finn Zander, 和 Marcela Mancino 的[为葡萄牙语用户的 Pê Cinco：国际化与普及](https://medium.com/processing-foundation/translating-p5-js-into-portuguese-for-the-brazilian-community-14b969e77ab1)）
- 改进对辅助技术的支持，比如屏幕阅读器（例如，Katie Liu 的[在 p5.js 中添加 Alt 文本](https://medium.com/processing-foundation/adding-alt-text-e2c7684e44f8)，Claire Kearney-Volpe 的[ p5 可及性项目](https://medium.com/processing-foundation/p5-accessibility-115d84535fa8)）
- 遵循我们工具中的[网络内容无障碍指南](https://www.w3.org/TR/WCAG21/)，并致力于让用户在其项目中更轻松地遵守这些准则
- 让 p5.js 的错误信息对使用该工具的人士更为友好和获取更多支持。（例如，[ p5.js 友好错误系统(FES)](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md)）
- 在创意编程和数字艺术领域历史上被排除和边缘化的社区内指导和支持 p5.js 的学习者
- 举办社区活动（例如，[ p5.js 无障碍日 2022](https://p5js.org/community/p5js-access-day-2022.html)，[我们想要的网络：p5.js x W3C TPAC 2020](https://medium.com/processing-foundation/p5-js-x-w3c-tpac-bee4c621a053)），采用以可及为中心的组织策略（例如，美国手语翻译，实时字幕，无障碍场地）
- 支持创建教育资源（例如，Adekemi Sijuwade-Ukadike 的[可及性教学大纲](http://a11ysyllabus.site/)）
- 发布我们的工作文档和报告，遵循 WCAG 指南，使用简明语言，专注于来自多样经历的初学者（例如，[ OSACC p5.js 访问报告](https://github.com/processing/OSACC-p5.js-Access-Report)）



## 维护
我们不接受那些不支持我们增加可及性努力的功能请求。你将在我们的 issue 和 PR 模板中看到这一标准的体现。我们还确认了保持 p5.js 现有功能集的意图。我们愿意修复代码库中任何区域的错误。我们相信工具的一致性将使其对初学者更加易用。提升易用性的功能请求示例包括：
为使用性能较低硬件的人提升性能（例如，支持向帧缓冲区绘制/从帧缓冲区读取）
API 的一致性（例如，添加 arcVertex() 函数以通过 beginShape()/endShape() 创建弧线）

___

请将此视为一份“不断发展中的文档”。我们将持续讨论并优先考虑可及性的含义。我们邀请我们的社区参与讨论这份文档及其所描述的价值观。如果你有任何想法或建议，欢迎通过在 Github 上提交 issue 或通过发送电子邮件至 hello@p5js.org 与我们分享。

这个版本的 p5.js 可及性声明是在2023年开源艺术贡献者大会上，与 Evelyn Masso、Nat Decker、Bobby Joe Smith III、Sammie Veeler、Sonia (Suhyun) Choi、Xin Xin、Kate Hollenbach、Lauren Lee McCarthy、Caroline Sinders、Qianqian Ye、Tristan Jovani Magno Espinoza、Tanvi Sharma、Tsige Tafesse 和 Sarah Ciston 的合作下修订的。它在 Bobby Joe Smith III 和 Nat Decker 的 Processing Foundation 研究奖金支持下完成并发布。

[^1]: Crenshaw, Kimberlé (1989)。"Demarginalizing the intersection of race and sex: a black feminist critique of antidiscrimination doctrine, feminist theory and antiracist politics"。芝加哥大学法律论坛。1989 (1): 139–167。ISSN 0892-5593。全文在 Archive.org。
[^2]: 大写的 ‘D’Deaf 指的是文化上属于 Deaf 社区的人，而小写的 ‘d’deaf 是一个听力学术语，可以描述不与 Deaf 身份相关联的人。
[^3]: 在残疾社区内，对于‘以人为本’与‘以身份为先’语言的偏好存在分歧。阅读[在自闭症社区中关于以人为本与以身份为先语言的辩论解包](https://news.northeastern.edu/2018/07/12/unpacking-the-debate-over-person-first-vs-identity-first-language-in-the-autism-community/) 和[我是残疾人：关于身份先行与人先行语言的讨论](https://thebodyisnotanapology.com/magazine/i-am-disabled-on-identity-first-versus-people-first-language/)。
[^4]: 语言帝国主义或语言霸权，指的是某些语言（如英语）由于帝国扩张和全球化而持续的统治/优先/强加，以牺牲本土语言为代价的现象。
