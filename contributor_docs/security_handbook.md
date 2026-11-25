# Security Handbook

The p5.js project spans three pieces of software: the library, the website, and the editor. In practice, most users and contributors approach these as the same project, although from the perspective of security vulnerabilities they are very different. But because of the perceived interconnection, including a shared responsible disclosure email, policy, and response team/roles, the threat model document is shared.

To report a vulnerability, or to read about our incident response process, see [SECURITY.md](https://github.com/processing/p5.js/blob/main/SECURITY.md).

## Inspiration

Inspiration: the [Pillow security handbook](https://pillow.readthedocs.io/en/latest/handbook/security.html), because it includes:

- Clear, outward-facing security guidance that includes a procedure for reporting and advice for users
- A very short summary of the “primary attack surface” — though we should not lead with very technical terms, this type of summary at the top of SECURITY.md would be good
- A breakdown of security advice and types of problems for each of the STRIDE steps

We are different from Pillow because:

- Users of the p5.js library should still exercise good judgment when running others’ code and using external assets, but to a large extent browser sandboxing prevents significant harm (DoS, for example)
- The main attack surface is the p5.js Editor app, where users manage their accounts
- Although we haven't seen it happen, there's also the p5.js website as a different surface

## Threat Model

— Below is a WIP/draft, input welcome —

**Summary:** The library runs in your browser sandbox, so most harm is limited; running or reviewing others' code always requires user judgment. Sketch authors should only use trusted external assets, and consider the resources of the sketch viewers: a sketch embedded on your page will run code in your visitors' browsers and make network requests that you, as the sketch author, are responsible for. The main focus of the p5.js security review and response is on the p5.js Editor, which is the primary attack surface.

### Spoofing

#### S-1 — Account takeover via credential reuse

Users who reuse a password from another site that suffers a breach can have their p5.js Editor accounts accessed through credential stuffing.

**Mitigation:** Never reuse passwords; use a password manager.

#### S-2 — Phishing sites imitating the editor/website

A lookalike domain can capture login credentials, or provide misleading or harmful content.

**Mitigation:** Only sign in via bookmarks or links from the “p5js.org” domain; we will never email you asking for your password; report suspicious sites to responsible.disclosure@processingfoundation.org.

### Tampering

#### T-1 — Malicious code in sketches

Sketch code executed from editor.p5js.org cannot access your p5.js Editor account. However, the sketch may still use your camera/mic if you allowed it.

**Mitigation:** Always review the code you are running, the assets you are using, and the permissions you give the browser tab.

#### T-2 — Malicious p5.js forks/CDN links

Tutorial code loading p5.js from an unofficial CDN or a forked copy may deliver modified code.

**Mitigation:** Load the library only from official sources (the p5.js Editor version switcher, or the CDN links shown on https://p5js.org/download/).

### Repudiation

#### R-1 — Harmful behavior that can't be substantiated after the fact

Sketches, comments, or messages containing harassment or Code of Conduct violations may be deleted or edited by their author before anyone reviews a report.

**Mitigation:** If you experience or witness harmful behavior, capture evidence when it happens (a screenshot including the username, URL, and date, or an archive of the page) and report it promptly and privately (not in public), by messaging or tagging moderators in online community spaces (like Discord or Discourse) or emailing hello@p5js.org.

### Information Disclosure

#### I-1 — Secrets accidentally published inside sketches

API keys, tokens, or personal data committed into sketches that are public.

**Mitigation:** Never paste API keys into a sketch; if you did, treat them as compromised and rotate (update) them immediately — removing them from the current version doesn't undo the public exposure of the key, as there may have been a copy.

#### I-2 — Personal information in sketch comments and metadata

Names, emails, or identifying details included in code comments or project descriptions.

**Mitigation:** Review your sketch contents before making it public; assume anything published is permanent (caches, forks, scrapers).

#### I-3 — Sketch network requests and harmful/misleading external assets

Sketches fetch external assets (images, JSON, fonts), which sends the viewer's IP address and referrer to third parties. External assets may have filenames that mislead about the nature or function of the asset.

**Mitigation:** When creating sketches, use assets from sources you trust; when viewing others' sketches, be aware they may load remote content.

**Mitigation (embedding):** Serve embedded sketches from a separate origin, or sandbox the iframe. Be aware that remote assets your embedded sketches load expose your visitors' IP addresses and referrers to those third parties — the same trust question you'd apply to any third-party tag on your page.

#### I-4 — Project visibility misconfiguration

Private sketches marked public, or default-public settings, expose unfinished or personal work.

**Mitigation:** After creating a sketch or changing settings, confirm its visibility badge actually reads Private; periodically review your project list; remember anything public can be copied.

### Denial of Service

#### D-1 — Resource-exhausting sketches

A sketch with an infinite loop, an enormous canvas, or recursive drawing can freeze the browser tab.

**Mitigation:** Browser sandboxing confines this to the affected tab, so closing the tab stops the problem.

**Mitigation (embedding):** Sandbox the iframe, lazy-load heavy sketches so one bad sketch can't take down your whole page, test on different devices before publishing, reduce framerate, pixel density, or size, and ensure there are no unbounded or infinite loops.

### Elevation of Privilege

#### E-1 — Authorization flaws in the editor

A crafted request editing or reading a project owned by another account would be a serious vulnerability — including drafts of private sketches.

**Mitigation:** Server-side authorization checks on every project/account operation. If you find an exploitable vulnerability, please report it immediately using a GitHub Security Advisory (GHSA) or responsible.disclosure@processingfoundation.org — never in public.
