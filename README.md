# what it shows

S01E03. Ticket #4471 merged every date report into one known issue. This repo files one ticket per problem and adds a page to the support knowledge base.

- Page source: [support-kb/src/routes/kb/incidents/4471/problems/+page.svx](support-kb/src/routes/kb/incidents/4471/problems/+page.svx)
- Page as the desk will see it: [support-kb/rendered/kb/incidents/4471/problems.html](support-kb/rendered/kb/incidents/4471/problems.html)
- Tickets are the GitHub issues in this repo. Each one says how many reports that problem covers.

The counts on the page are computed from the report export, the cause rule, and `desk-notes.json`. They are not typed into the paragraph.
