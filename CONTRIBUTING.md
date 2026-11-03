# Contributing to squatch.js
Contributions to squatch.js are encouraged, but please have a look through this document before raising issues or writing code.

We thank you in advance for considering contributing to the official Referral SaaSquatch Javascript SDK.

If you have support questions, send an email to [support@saasqt.ch](mailto:support@saasqt.ch). The issue tracker is reserved for reporting bugs, requesting new features and submitting pull requests.

## Local Development

* Install  [node](https://nodejs.org)
* run `npm install`

* `npm run watch` to start Webpack in watch mode - will recompile when you change a file.
* open `index.html` in a browser.
* Reload the browser when you have made a change.

## Pull Requests
Please review [these guidelines](https://github.com/blog/1943-how-to-write-the-perfect-pull-request) before starting to work on the project.

Guidelines for submitting a pull request:
- Create an issue first and/or discuss it with a team member
- Update docs where necessary. We use [JSDoc](http://usejsdoc.org/about-getting-started.html)
- Please make commits in logical sections with clear messages

Please run through all testing steps before asking for a review, and follow the template below.
```md
## Description of PR (how it affects users, related tickets, etc)

## What are the necessary tests?

Test the following:
- [ ] Code compiles without warnings (shell and console)
- [ ] All tests pass
- [ ] UI looks exactly as expected (in every supported browser, including mobile)
- [ ] If the feature makes requests from the browser, web inspector looks as expected (parameters, headers, etc)
- [ ] If the feature saves data, confirm the data is indeed created.
- [ ] Code follows the Style Guide
```

## Releasing

Releases go through [Changesets](https://github.com/changesets/changesets) and the [Release workflow](.github/workflows/release.yml). They publish from CI with npm trusted publishing (OIDC) and provenance, never from a laptop.

1. **Add a changeset to your PR.** Run `npm run changeset`, pick the bump type, and write the note customers will read in the changelog. Commit the generated `.changeset/*.md` file with your code. Changes that don't need a release (docs, tests, CI) don't need one.
2. **Merging to `master` updates the "Version Packages" PR.** It bumps `package.json`, writes `CHANGELOG.md` and deletes the consumed changesets. Keep merging feature PRs; it updates itself.
3. **Merging the Version Packages PR publishes.** The workflow publishes the new version to npm under `latest`, pushes the `v<version>` tag and creates the GitHub release.

Pick the bump with the CDN in mind. Customers load `https://fast.ssqt.io/squatch-js@2`, so a `major` bump ships to nobody until they change their script tag.

### Pre-releases

Run the Release workflow manually (**Actions → Release → Run workflow**) and pick a branch with pending changesets. It publishes `<next version>-next-<datetime>` under the `next` dist-tag, which you can load from `https://fast.ssqt.io/squatch-js@next`. Nothing is committed or tagged.

## Reporting Issues
Detailed bug reports are greatly appreciated.

Guidelines for reporting issues:
- Check the issue search to see if it has already been reported
- Provide a demonstration of the bug with [JSFiddle](https://jsfiddle.net/) or [Codepen](http://codepen.io/).
- Please include a description of the issue and any additional details that might be relevant. For example, if the bug is browser specific, provide the browser version and OS where that's happening.

## License
By contributing your code, you agree to license your contribution under the [MIT license](https://github.com/saasquatch/squatch-js/blob/master/LICENSE).
