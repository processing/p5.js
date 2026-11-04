# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities by emailing: responsible.disclosure@processingfoundation.org

### Reporting Channels

1. Security Advisories in a specific repository are received by p5.js admins/maintainers
2. Responsible Disclosure email reports are received by Processing Foundation staff

## What to Expect

- We will acknowledge your email within 72 hours
- We will provide regular updates about our progress
- Once the issue is confirmed and fixed, we may ask you to verify the solution

## Disclosure Policy

- Please do not disclose the vulnerability publicly until we have had a chance to address it
- We do not offer bounties as we are a non-profit organization
- We appreciate your efforts to responsibly disclose your findings

## Scope

You can use the above email to report vulnerabilities in p5.js and related repositories managed by the processing org, including the reference website.

## Accidental Disclosure: Never Share Vulnerabilities Publicly!

Please do not report security vulnerabilities in a public channel. If you notice a vulnerability being disclosed in a public channel (whether on Discord, the forum, GitHub, or other platforms), please flag it to a moderator immediately.

If any moderator in our online community spaces notices something that is plausibly a security vulnerability disclosure (you don’t need to verify deeply at this stage, false positive is OK), they should:

1. screenshot and send to responsible.disclosure@processingfoundation.org
2. delete the public content if possible
3. reach out to the poster with a link to SECURITY.md in the correct project and a brief explanation that the content was taken down for security reasons

## Incident Response Process

Who handles incoming reports of security vulnerabilities? Who responds to security incidents? A mix of Processing Foundation staff, current p5.js maintainers, and p5.js contributors, taking on the following roles and responsibilities:

| Role              | Responsibility                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Finder / Reporter | Credited when all reporter expectations (below) are met.                                                                                                                                   |
| Incident Lead     | First responder; owns the report end-to-end. By default, this is the Project Lead. Handoffs only with a written status summary. Owns advisory publication, and reporter notification. |
| Implementer(s)    | Develops the fix; may be a maintainer or contributor nominated by Incident Lead or maintainer(s).                                                                                          |
| Reviewer(s)       | At least one other maintainer reviews in the private fork before release.                                                                                                                  |
| Merge and Deploy  | Deploys the updated/patched version.                                                                                                                                                       |

Whoever is available to claim the Incident Lead role starts as soon as they can with Phase 0.

### Phase 0 — Intake

Incident Lead:

- Notifies relevant people per project, to see which potential implementers are available
- Moves the conversation into a GitHub Security Advisory, if it is not already on there.

### Phase 1 — Triage & Classification

Acknowledge receipt to the reporter within **72H**, along with triage & classification (below).

Reproduce the issue, potentially iterating with the reporter for more information.

Notify along private maintainer chat channels.

Is something a security vulnerability or incident? Use CIA (Confidentiality, Integrity, Availability):

- (0) Not a problem: cannot reproduce, or behavior already documented as accepted risk in the threat model. Close with explanation.

- (1) Public bug: problem is real but no CIA impact. Respond to the reporter with explanation, but fix openly in a normal PR.

  _Example: [decompression bomb patch](https://github.com/processing/p5.js/releases#release-v2.3.3) added in p5.js 2.3.3_

- (2) Vulnerability: impacts CIA (confirmed or plausibly demonstrated), but no evidence of exploitation. Move on to Phase 3 (Fix)

- (3) Incident, including a High-Severity Vulnerability without logs to rule out past exploit: Move on to Phase 2 (Expedited Report) and then 3 (Fix)

  _Example: [account takeover vulnerability](https://github.com/processing/p5.js-web-editor/security/advisories/GHSA-p4fp-294x-r7cw) fixed in p5.js Editor 2.22.8_

### Phase 2 — (Incidents Only) Expedited Report

In case of an incident, we have some specific reporting responsibilities, which are also fulfilled within **72H** from the initial report.

### Phase 3 — Private Fix

The GitHub Security Advisory (GHSA) thread is the main place for technical discussion, and enables working on a fix in a private repository with a specific set of collaborators. In the GHSA workflow, there is a severity scoring tool that uses CVSS.

Timing of the fix depends on the CVSS score:

1. Critical: act immediately, as soon as possible
2. High/medium: target patch completion or release within about a week
3. Low: batch into routine releases

### Phase 4 — Release & Disclosure

- Merge + deploy the fix, verify it is patched on production
- Publish advisory and describe patch in release notes
- Notify the reporter(s) and everyone who worked on the fix

## Reporter Expectations

Reporters are offered credit in GHSA if their GitHub username is known and if their report:

- Contains a brief and useful summary, plus clear steps to reproduce
- Focuses on one report per defect, and avoids spurious LLM-generated reports
- Is supportive of the community
