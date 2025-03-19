import { PrepareContext, PublishContext } from 'semantic-release';
import signale from 'signale';

export const publishContext: PublishContext = {
  logger: new signale.Signale(),
  commits: [],
  branch: {
    name: 'master',
    channel: '',
    prerelease: false,
    range: '',
  },
  branches: [],
  env: {},
  envCi: {
    isCi: false,
    branch: 'master',
    commit: 'h1',
  },
  releases: [],
  lastRelease: undefined,
  nextRelease: {
    name: 'v1.0.0',
    version: '1.0.0',
    type: 'minor',
    channel: '',
    gitTag: 'v1.0.0',
    gitHead: 'h1',
  },
  stdout: process.stdout,
  stderr: process.stderr,
};

export const prepareContext: PrepareContext = {
  logger: new signale.Signale(),
  commits: [],
  branch: {
    name: 'master',
    channel: '',
    prerelease: false,
    range: '',
  },
  branches: [],
  env: {},
  envCi: {
    isCi: false,
    branch: 'master',
    commit: 'h1',
  },
  releases: [],
  lastRelease: undefined,
  nextRelease: {
    name: 'v1.0.0',
    version: '1.0.0',
    type: 'minor',
    channel: '',
    gitTag: 'v1.0.0',
    gitHead: 'h1',
    notes: `## [3.3.0-alpha.1](https://github.com/epicwp/polylang-automatic-ai-translation/compare/v3.2.9...v3.3.0-alpha.1) (2025-03-19)

### ⚠ BREAKING CHANGES

* **CI:** Breaks everything

### :sparkles: Features

* **CI:** Implemented semantic-release ([e3d7e8b](https://github.com/epicwp/polylang-automatic-ai-translation/commit/e3d7e8bee01774119389c6dc076ce3750c983c50))

### :bug: Bug Fixes

* **CI:** Added perms to github token ([529bbf9](https://github.com/epicwp/polylang-automatic-ai-translation/commit/529bbf9e3bfd051a616825568db43e7ecb4914a6))
* **CI:** Added perms to github token ([79d0b59](https://github.com/epicwp/polylang-automatic-ai-translation/commit/79d0b590503dd1b0726a0cbba7b17ed324c039c5))

### :art: Code style

* Styled and documented exception ([499ee93](https://github.com/epicwp/polylang-automatic-ai-translation/commit/499ee936f0178205d574f6ff5d066e9ed6598a52))

### :wrench: Maintenance

* **CI:** Tweaked release workflow ([c286e11](https://github.com/epicwp/polylang-automatic-ai-translation/commit/c286e110ddea05a09595e8e07e64520c737dbc34))`,
  },
  stdout: process.stdout,
  stderr: process.stderr,
};
