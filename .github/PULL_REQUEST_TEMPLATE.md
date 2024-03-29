<!-- You can remove tags that do not apply. -->

Connects-to: # <!-- waffle convention to track a PR's status through its connected, open issue -->
See: <url> <!-- Refer to any external resource, like a PR, document or discussion -->
Depends-on: <url> <!-- This change depends on a PR to get merged/deployed first -->
Change-type: major|minor|patch <!-- The change type of this PR -->

---

##### Contributor checklist

<!-- For completed items, change [ ] to [x].  -->

- [ ] I have regenerated jest snapshots for any affected components with `npm run generate-snapshots`

##### Reviewer Guidelines

- When submitting a review, please pick:
  - '_Approve_' if this change would be acceptable in the codebase (even if there are minor or cosmetic tweaks that could be improved).
  - '_Request Changes_' if this change would not be acceptable in our codebase (e.g. bugs, changes that will make development harder in future, security/performance issues, etc).
  - '_Comment_' if you don't feel you have enough information to decide either way (e.g. if you have major questions, or you don't understand the context of the change sufficiently to fully review yourself, but want to make a comment)

---
