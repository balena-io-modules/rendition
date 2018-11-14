Commit Guidelines
=================

We enforce certain rules on commits with the following goals in mind:

- Be able to reliably auto-generate the `CHANGELOG.md` *without* any human
intervention.
- Be able to automatically and correctly increment the semver version number
based on what was done since the last release.
- Be able to get a quick overview of what happened to the project by glancing
over the commit history.
- Be able to automatically reference relevant changes from a dependency
upgrade.

Commit structure
----------------

Each commit message consists of a header, a body and a footer. The header has a
special format that includes a type, a scope and a subject.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The subject should not contain more than 70 characters, including the type and
scope, and the body should be wrapped at 72 characters.

Type
----

Must be one of the following:

- `feat`: A new feature.
- `fix`: A bug fix.
- `minifix`: A minimal fix that doesn't warrant an entry in the CHANGELOG.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space,
formatting, missing semi-colons, JSDoc annotations, comments, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries.
- `upgrade`: A version upgrade of a project dependency.

Scope
-----

The scope is required for types that make sense, such as `feat`, `fix`,
`test`, etc. Certain commit types, such as `chore` might not have a clearly
defined scope, in which case its better to omit it.

When it applies, the scope will usually by the name of the component being
changed, e.g `feat(Form): Some great feature.

A commit that changes multiple components, and makes more logical
sense that way, might entirely omit the scope.

Subject
-------

The subject should contain a short description of the change:

- Use the imperative, present tense.
- No dot (.) at the end.

Footer
------

The footer contains extra information about the commit, such as tags.

**Breaking Changes** should start with the word BREAKING CHANGE: with a space
or two newlines. The rest of the commit message is then used for this.

Tags
----

### `See: <url>`/`Link: <url>`

This tag can be used to reference a resource that is relevant to the commit,
and can be repeated multiple times in the same commit.

Resource examples include:

- A link to pull requests.
- A link to a GitHub issue.
- A link to a website providing useful information.
- A commit hash.

Its recommended that you avoid relative URLs, and that you include the whole
commit hash to avoid any potential ambiguity issues in the future.

If the commit type equals `upgrade`, this tag should be present, and should
link to the CHANGELOG section of the dependency describing the changes
introduced from the previously used version.

Examples:

```
See: https://github.com/xxx/yyy/
See: 49d89b4acebd80838303b011d30517cd6229fdbe
Link: https://github.com/xxx/yyy/issues/zzz
```

### `Closes: <url>`/`Fixes: <url>`

This tag is used to make GitHub close the referenced issue automatically when
the commit is merged.

Its recommended that you provide the absolute URL to the GitHub issue rather
than simply writing the ID prefixed by a hash tag for convenience when browsing
the commit history outside the GitHub web interface.

A commit can include multiple instances of this tag.

Examples:

```
Closes: https://github.com/balena-io-modules/rendition/issues/XXX
Fixes: https://github.com/balena-io-modules/rendition/issues/XXX
```

### `Change-type: <type>`

This tag is used to determine the change type that a commit introduces. The
following types are supported:

- `major`
- `minor`
- `patch`

Examples:

```
Change-type: major
Change-type: minor
Change-type: patch
```

See the [Semantic Versioning][semver] specification for a more detailed
explanation of the meaning of these types.

[semver]: http://semver.org
