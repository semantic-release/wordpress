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
  },
  stdout: process.stdout,
  stderr: process.stderr,
};
