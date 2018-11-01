Contributing Guide
==================

Thanks for your interest in contributing to this project! This document aims to
serve as a friendly guide for making your first contribution.

### Cloning the project

```sh
git clone https://github.com/balena-io-modules/rendition.git
cd rendition
```

### Installing npm dependencies

```sh
npm ci
```

### Installing docker

[Docker][Docker] is required to run [visual regresion tests](#visual-testing)
and to generate new screenshots. See the [docker installation
documentation][Docker install] for information on how to install Docker in your
environment.

### Running the storybook

The interactive storybook can be launched by running:

```sh
npm start
```

The storybook can be accessed at http://localhost:6006.

Adding new components
---------------------

Please open an issue to discuss any new components before starting work on
them.

Testing
-------

To run the test suite, run the following command:

```sh
npm test
```

We encourage our contributors to test the library before sending a pull request.

We use [Jest snapshot testing](https://jestjs.io/docs/en/snapshot-testing) to
help prevent regression bugs. If your change affects the html output of
a component you may needs to update a snapshot, you can do this by running the
following command:

```sh
npm run jest -- -u
```

*The test suite is run automatically by CI servers when you send a pull
request.*

Code is automatically linted and formatted by [Husky][husky] as a pre-commit hook.

We make use of [EditorConfig] to communicate indentation, line endings and
other text editing default. We encourage you to install the relevant plugin in
your text editor of choice to avoid having to fix any issues during the review
process.


### Visual testing

You can run a screenshot test using the command:

```
npm run test:local-visual
```

A report will be generated and saved to `visual-testing-report.html`.

If you have made changes to a component that will affect the way it
looks in a story, screenshots should be generated using the command:

```
npm run generate-screenshots
``` 

This command will spawn a docker container, generate screenshots
and copy them back to your local file system.

Visual testing relies on a consistent execution environment, ensuring that
control inputs and fonts are always rendered the same way. To ensure this
happens both screenshot generation and testing steps are run inside a docker
container. 

Screenshots of each story are stored in the `__screenshots__` directory. When
the test suite runs, new screenshots are created and compared against the
existing ones in the `__screenshots__` directory. Any differences will cause the
tests to fail, as it indicates an unexpected visual change to a component.

Updating documentation
----------------------

All components have a corresponding markdown file that documents their API. The
markdown files are found in `src/stories/README/`. The markdown files are
displayed in the interactive storybook and also aggregated into the main README
file. After making any changes to a component, make sure the corresponding
markdown file is up to date and then update the README using the following
command:

```sh
npm run build:docs
```

Commit Guidelines
-----------------

See [COMMIT-GUIDELINES.md][COMMIT-GUIDELINES] for a thorough guide on how to
write commit messages.

Sending a pull request
----------------------

When sending a pull request, consider the following guidelines:

- Write a concise commit message explaining your changes.

- If applies, write more descriptive information in the commit body.

- If your change affects the visuals of the library, consider attaching a
screenshot.

- Refer to the issue/s your pull request fixes, so they're closed automatically
when your pull request is merged.

- Write a descriptive pull request title.

- Squash commits when possible, for example, when committing review changes.

Before your pull request can be merged, the following conditions must hold:

- The linter doesn't throw any warning.

- All the tests pass.

- The coding style aligns with the project's convention.

Don't hesitate to get in touch if you have any questions or need any help!

[COMMIT-GUIDELINES]: COMMIT-GUIDELINES.md
[EditorConfig]: http://editorconfig.org
[Docker]: https://www.docker.com/
[Docker install]: https://docs.docker.com/install/
