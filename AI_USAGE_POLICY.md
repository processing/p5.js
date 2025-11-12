> [!IMPORTANT]
> This project does not accept fully AI-generated pull requests. AI tools may be used assistively only. You must understand and take responsibility for every change you submit.
>
> Read and follow:
> • [AGENTS.md](./AGENTS.md)
> • [CONTRIBUTING.md](./CONTRIBUTING.md)
> • [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

# AI Usage Policy

## Our Rule

**All contributions must come from humans who understand and can take full responsibility for their code.**

Large language models (LLMs) make mistakes and cannot be held accountable for their outputs. This is why we require human understanding and ownership of all submitted work. 

> [!WARNING]
> Maintainers may close PRs that appear to be fully or largely AI-generated.

## Getting Help

**We understand that asking questions can feel intimidating.** You might worry about looking inexperienced or bothering maintainers with "basic" questions. AI tools can feel like a safer and less judgmental first step. However, LLMs often provide incorrect or incomplete answers, and they may create a false sense of understanding.

Before asking AI, we encourage you to talk to us in the [Discord #contribute-to-p5 channel](https://discord.gg/x7kU7k5HM3) or in the relevant issue thread.

Please know: **there are no silly questions, and we genuinely want to help you.** You won't be judged for not knowing something. In fact, we are grateful for your questions as they help us improve our documentation and make the project more welcoming for everyone who comes after you.

If you do end up using AI tools, we ask that you only do so **assistively** (like a reference or tutor) and not **generatively** (having the tool write code for you).

## Guidelines for Using AI Tools

1. **Understand fully:** You must be able to explain every line of code you submit
2. **Test thoroughly:** Review and test all code before submission
3. **Take responsibility:** You are accountable for bugs, issues, or problems with your contribution
4. **Disclose usage:** Note which AI tools you used in your PR description
5. **Follow guidelines:** Comply with all rules in [AGENTS.md](./AGENTS.md) and [CONTRIBUTING.md](./CONTRIBUTING.md)

### Example disclosure
> I used Claude to help debug a test failure. I reviewed the suggested fix, tested it locally, and verified it solves the issue without side effects.

> I used ChatGPT to help me understand an error message and suggest debugging steps. I implemented the fix myself after verifying it.

## What AI Tools Can Do

✅ **Allowed (assistive use):**
- Explain concepts or existing code
- Suggest debugging approaches
- Help you understand error messages
- Run tests and analyze results
- Review your code for potential issues
- Guide you through the contribution process

## What AI Tools Cannot Do

❌ **Not allowed (generative use):**
- Write entire PRs or large code blocks
- Make implementation decisions for you
- Submit code you don't understand
- Generate documentation or comments without your review
- Automate the submission of code changes

## Why do we have this policy?
AI-based coding assistants are increasingly enabled by default at every step of the contribution process, and new contributors are bound to encounter them and use them in good faith.

While these tools can help newcomers navigate the codebase, they often generate well-meaning but unhelpful submissions. 

There are also ethical and legal considerations around authorship, licensing, and environmental impact.

We believe that learning to code and contributing to open source are deeply human endeavors that requires curiosity, slowness, and community.

## About AGENTS.md

The [AGENTS.md](./AGENTS.md) file contains instructions for AI coding assistants to prompt them to act more like guides than code generators. When someone uses an assistant to contribute, the tool will be prompted to explain the code, point to our documentation, and suggest asking questions in the community channels, rather than writing code directly.

Note that [AGENTS.md](./AGENTS.md) is intentionally structured so that large language models (LLMs) can better comply with the guidelines. This explains why certain sections may seem redundant, overly directive or repetitive.

This is not a perfect solution. Agents may ignore it or be convinced to generate code anyway. However, this is our best effort to guide their behavior and encourage responsible use. 

We are continuously looking for ways to improve our approach and may have to change our policies as AI tools evolve. We welcome feedback and suggestions from the community.

> [!NOTE]
> Including this [AGENTS.md](./AGENTS.md) does not imply endorsement by p5.js, the p5.js contributors, or the Processing Foundation of any specific AI tool or service, or encourage their use.

## Questions?

If you're unsure whether your use of AI tools complies with this policy, ask in the [Discord #contribute-to-p5 channel](https://discord.gg/x7kU7k5HM3) or in the relevant issue thread. We're here to help!

## AI Disclosure

This policy was created with the assistance of AI tools, including ChatGPT and Claude. It was thoroughly reviewed and edited by human contributors to ensure clarity and accuracy.