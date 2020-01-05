# Organizing Contributions

Keeping the repository organized ensures that it is always clear which discussions and tasks are the most important. This helps everyone from maintainers to new contributors navigate the repository without getting overwhelmed. To help with this, we have a set of guidelines for how to organize issues, work, and pull requests.

Helping with organization can be a great way to contribute. If a bug report is missing information such as example code, feel free to chime in and ask for the missing info. If an issue with an assignee has seen no activity for 60 days, it can be helpful to comment on the issue to check in with the assignee to see if they still want to work on the issue. Whenever you are helping with organizational tasks, make sure to be kind and always keep the community guidelines in mind. 

# Guidelines for Organization

## Issues
- **All bug reports must include sample code**
  - This can be in the form of code posted in the body of the issue, or it can be a link to an online example of the code preferably in [the online editor](editor.p5js.org)
- **All issues must have at least 2 labels**
  - This makes it much easier to navigate the issues.
  - Try adding a label for the area (webgl, core, image, etc)
- **Issue assignment is first-come, first-serve**
  - If a bug has been reproduced, or a feature request/enhancement has been agreed upon by the community, it becomes available for assignment. When this happens the first contributor to request assignment by saying something like "I'd like to work on this issue!" will be assigned.
  - Do not request to be assigned to an issue if it is unclear whether the bug is reproducible or the feature request/enhancement has been agreed upon.

## Pull Requests
- **All pull requests must be associated with an issue**
  - If you want to fix a bug or add a feature, start by opening an issue so the community can discuss it.
  - If a pull request is opened without an associated issue, comment and ask the contributor to open a pull request.

# Guidelines for Decision-Making

p5 aspires to make its decision-making process as transparent and horizontal as possible. To do this, p5 uses an informal consensus-seeking model for decision-making. This means that we prefer to reach community consensus on any and all decisions. If this fails, then a vote will take place instead
Core maintainers have the ability to veto proposals. This will happen when a proposal doesn't align with the mission or community guidelines.

To propose a change, open an issue. If it is a large change or a change that necessitates significant design consideration, add a 'discussion' label to the issue. Interested community members will chime in with their thoughts. After a significant period has passed (30 days unless urgent), maintainers will try to discern whether there is significant interest and whether consensus has been reached about the best approach. At this point, maintainers will either request a vote, close the issue, or open up the issue for pull requests. Pull requests submitted before a discussion has concluded will be ignored.

> In the future it would be great to automate the above organization and decision-making processes.

> If you have an idea for how to automate any of the above with a bot or github action feel free to open an issue with your proposal!