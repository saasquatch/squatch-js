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
- Update docs where necessary. We use (JSDoc)[http://usejsdoc.org/about-getting-started.html]
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

## Reporting Issues
Detailed bug reports are greatly appreciated.

Guidelines for reporting issues:
- Check the issue search to see if it has already been reported
- Provide a demonstration of the bug with [JSFiddle](https://jsfiddle.net/) or [Codepen](http://codepen.io/).
- Please include a description of the issue and any additional details that might be relevant. For example, if the bug is browser specific, provide the browser version and OS where that's happening.

## License
By contributing your code, you agree to license your contribution under the [MIT license](https://github.com/saasquatch/squatch-js/blob/master/LICENSE).
