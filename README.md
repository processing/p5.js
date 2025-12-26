[![npm version](https://badge.fury.io/js/p5.svg)](https://www.npmjs.com/package/p5)
[![All Contributors](https://img.shields.io/github/all-contributors/processing/p5.js?color=ee8449)](#contributors)
[![Total Downloads](https://img.shields.io/npm/dt/p5)](https://www.npmjs.com/package/p5)

# [p5.js](https://p5js.org)

Welcome! 👋👋🏿👋🏽👋🏻👋🏾👋🏼

p5.js is a free and open-source JavaScript library for [accessible](https://p5js.org/contribute/access) creative coding. It is a nurturing community, an approachable language, an exploratory tool, an accessible environment, an inclusive platform, welcoming and playful for artists, designers, educators, beginners, and anyone else!

<table>
<tr>
<td>

```js
function setup() {
  createCanvas(400, 400);
  background(255);
}

function draw() {
  circle(mouseX, mouseY, 80);
}
```

</td>
<td>

<img src="./contributor_docs/images/p5-readme-sketch.png" width="200" height="200" />

</td>
</tr>
</table>

[Get Started](https://p5js.org/tutorials/get-started/) — [Reference](https://p5js.org/reference) — [Tutorials](https://p5js.org/tutorials) — [Examples](https://p5js.org/examples/) — [Libraries](https://p5js.org/libraries) — [Forum](https://discourse.processing.org/c/p5js) — [Discord](https://discord.gg/SHQ8dH25r9)

## About

p5.js is built and organized to prioritize [accessibility, inclusivity, community, and joy](https://p5js.org/community). Similar to sketching, p5.js has a full set of tools to draw. It also supports creating audio-visual, interactive, experimental, and generative works for the web. p5.js enables thinking of a web page as your sketch. p5.js is accessible in multiple languages and has an expansive [documentation](https://p5js.org/reference/) with visual examples. You can find [tutorials](https://p5js.org/tutorials/) on the p5.js website and start coding right now in the [p5.js web editor](https://editor.p5js.org/). You can extend p5.js with many community-created [libraries](https://p5js.org/libraries/) that bring different capabilities. Its community provides endless inspiration and support for creators.

p5.js encourages iterative and exploratory code for creative expression. Its friendly, diverse community shares art, code, and learning resources to help elevate all voices. We share our values in open source and access for all, to learn, create, imagine, design, share and code freely.

## Community

The p5.js community shares an interest in exploring the creation of art and design with technology. We are a community of, and in solidarity with, people from every gender identity and expression, sexual orientation, race, ethnicity, language, neuro-type, size, disability, class, caste, religion, culture, subculture, immigration status, age, skill level, occupation, and background. We stand in solidarity with justice and liberation movements. We work to acknowledge, dismantle, and prevent barriers to access p5.js code and the p5.js community.

Learn more about [our community](https://p5js.org/community/) and read our community statement and [code of conduct](https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md). You can directly support our work with p5.js by donating to [the Processing Foundation](https://processingfoundation.org/support).

## 🌼 p5.js 2.0 Now Available for Community Testing & Development!

We are releasing p5.js 2.0 to the community for testing and development! Here’s what you need to know.

* For **reference**: p5.js 1.x reference will stay on [https://p5js.org/](https://p5js.org/), and p5.js 2.x documentation will be on [https://beta.p5js.org/](https://beta.p5js.org/)
* In the p5.js Editor: the **default will continue to be 1.x** until at least August 2026 - more information and discussion on timeline can be found on [this Discourse thread](https://discourse.processing.org/t/dev-updates-p5-js-2-0-you-are-here/46130) or [this GitHub thread](https://github.com/processing/p5.js/issues/7488)
* For updating sketches and add-on libraries: check out [the compatibility add-on libraries and guides](https://github.com/processing/p5.js-compatibility)
* For **contribution**: `npm latest` will default to 2.x, but the git branches are still separated with `main` on 1.x and `dev-2.0` on 2.x. We will switch the branches when we have updated all automations (including deploying updated documentation to the website). Want to contribute ideas or implementation? Check the [2.x project board](https://github.com/orgs/processing/projects/21/views/8) for an overview of what still needs discussion, and what’s ready for work!

## Issues

If you have found a bug in the p5.js library or want to request new features, feel free to file an issue! See our [contributor guidelines](https://p5js.org/contribute/contributor_guidelines) for a full reference of our contribution process. A set of templates for reporting issues and requesting features are provided to assist you (and us!). Different parts of p5.js are in different repositories. You can open an issue on each of them through these links:

[p5.js](https://github.com/processing/p5.js/issues) — [p5.js website](https://github.com/processing/p5.js-website/issues) —- [p5.js web editor](https://github.com/processing/p5.js-web-editor/issues)

p5.js is maintained mostly by volunteers, so we thank you for your patience as we try to address your issues as soon as we can.

## Get Started for Contributors

p5.js is a collaborative project with many contributors, mostly volunteers, and you are invited to help. All types of involvement are welcome. See the [contribute](https://p5js.org/contribute) for more in-depth details about contributing to different areas of the project, including code, bug fixes, documentation, discussion, and more.

A quick Getting Started with the Build and setting up the repository could be found [here](https://p5js.org/contribute/contributor_guidelines/#quick-get-started-for-developers).

## AI Usage Policy
This project does *not* accept fully AI-generated contributions. AI tools may be used assistively only. As a contributor, you should be able to understand and take responsibility for changes you make to the codebase.

More details can be found in our [AI Usage Policy](./AI_USAGE_POLICY.md) and [AGENTS.md](./AGENTS.md).

## Stewards

Stewards are contributors who are particularly involved, familiar, or responsive to certain areas of the project. Their role is to help provide context and guidance to others working on p5.js. If you have a question about contributing to a particular area, you can tag the listed steward in an issue or pull request. They may also weigh in on feature requests and guide the overall direction of their area, with the input of the community. You can read more about the organization of the project in our p5.js [Contributor Guidelines](https://p5js.org/contribute/contributor_guidelines) and p5.js [Steward Guidelines](https://p5js.org/contribute/steward_guidelines).

Anyone interested can volunteer to be a steward! There are no specific requirements for expertise, just an interest in actively learning and participating. If you’re familiar with or interested in actively learning and participating in some of the p5.js areas below, please reply to [this issue](https://github.com/processing/p5.js/issues/5719) mentioning which area(s) you are interested in volunteering as a steward! 👋👋👋

p5.js was created by [Lauren Lee McCarthy](https://github.com/lmccart) in 2013 as a new interpretation of Processing for the context of the web. Since then we have allowed ourselves space to deviate and grow, while drawing inspiration from Processing and our shared community. p5.js is sustained by a community of contributors, with support from the Processing Foundation. p5.js follows a rotating leadership model started in 2020, and [Qianqian Ye](https://github.com/qianqianye) has been leading p5.js since 2021. Learn more about the [people](https://p5js.org/people/) behind p5.js.

Current Lead/Mentor
* [@ksen0](https://github.com/ksen0) - p5.js Lead，2024-present
* [@limzykenneth](https://github.com/limzykenneth) - p5.js Mentor，2023-present

Lead/Mentor Alumni
* [@lmccart](https://github.com/lmccart) - p5.js Creator
* [@qianqianye](https://github.com/qianqianye) - p5.js Lead，2021-present (on leave)
* [@outofambit](https://github.com/outofambit) - p5.js Co-Lead 2021-22, Mentor 2022-2023
* [@mcturner1995](https://github.com/mcturner1995) - p5.js Lead 2020


<!-- STEWARDS-LIST:START - Do not remove or modify this section -->
| Area | Steward(s) |
|------|-------------|
| Maintainers | [@davepagurek](https://github.com/davepagurek), [@ksen0](https://github.com/ksen0), [@limzykenneth](https://github.com/limzykenneth), [@perminder-17](https://github.com/perminder-17), [@qianqianye](https://github.com/qianqianye) |
| Accessibility | [@calebfoss](https://github.com/calebfoss) |
| Accessibility (p5.js-website) | [@coseeian](https://github.com/coseeian) |
| Color | [@limzykenneth](https://github.com/limzykenneth) |
| Core | [@davepagurek](https://github.com/davepagurek) |
| DevOps | [@Vaivaswat2244](https://github.com/Vaivaswat2244), [@error-four-o-four](https://github.com/error-four-o-four), [@limzykenneth](https://github.com/limzykenneth), [@lirenjie95](https://github.com/lirenjie95) |
| Documentation | [@VANSH3104](https://github.com/VANSH3104), [@limzykenneth](https://github.com/limzykenneth), [@perminder-17](https://github.com/perminder-17) |
| Friendly Errors | [@IIITM-Jay](https://github.com/IIITM-Jay) |
| Graphics (p5.strands) | [@lukeplowden](https://github.com/lukeplowden) |
| Graphics (WebGL) | [@RandomGamingDev](https://github.com/RandomGamingDev), [@aferriss](https://github.com/aferriss), [@davepagurek](https://github.com/davepagurek), [@lukeplowden](https://github.com/lukeplowden), [@perminder-17](https://github.com/perminder-17) |
| i18n (es) | [@marioguzzzman](https://github.com/marioguzzzman) |
| i18n (hi) | [@Divyansh013](https://github.com/Divyansh013), [@takshittt](https://github.com/takshittt) |
| i18n (ko) | [@hana-cho](https://github.com/hana-cho) |
| i18n (zh) | [@limzykenneth](https://github.com/limzykenneth), [@lirenjie95](https://github.com/lirenjie95) |
| Math | [@GregStanton](https://github.com/GregStanton), [@holomorfo](https://github.com/holomorfo) |
| p5.js-website | [@clairep94](https://github.com/clairep94), [@ksen0](https://github.com/ksen0) |
| p5.sound.js | [@ogbabydiesal](https://github.com/ogbabydiesal) |
| Shapes | [@GregStanton](https://github.com/GregStanton) |
| Typography | [@dhowe](https://github.com/dhowe) |
<!-- STEWARDS-LIST:END -->

## Contributors

We recognize all types of contributions. This project follows the [all-contributors specification](https://github.com/all-contributors/all-contributors) and the [Emoji Key](https://github.com/all-contributors/all-contributors/blob/master/docs/emoji-key.md) ✨ for contribution types. Instructions to add yourself or add contribution emojis to your name are [here](https://github.com/processing/p5.js/issues/2309). You can also post an issue or comment on a pull request with the text: `@all-contributors please add @YOUR-USERNAME for THINGS` (where `THINGS` is a comma-separated list of entries from the [list of possible contribution types](https://github.com/all-contributors/all-contributors/blob/master/docs/emoji-key.md)) and our nice bot will add you to [CONTRIBUTORS.md](./CONTRIBUTORS.md) automatically!

Thanks to all the wonderful contributors! 💓
