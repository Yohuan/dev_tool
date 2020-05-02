const fs = require('fs');

const chokidar = require('chokidar');
const simpleGit = require('simple-git/promise');

const { GitMonitor } = require('./git-monitor');

const _createGitMonitor = async (
  workingDir,
  fileSystem = fs,
  fileWatcher = chokidar,
  createGit = simpleGit,
  GitMonitorConstructor = GitMonitor,
) => {
  if (!fileSystem.existsSync(workingDir) || !fileSystem.statSync(workingDir).isDirectory()) {
    throw new Error(`${workingDir} is not a valid directory.`);
  }
  const git = createGit(workingDir);
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error(`${workingDir} is not under a git project.`);
  }
  return GitMonitorConstructor(git, workingDir, fileWatcher);
};

const createGitMonitor = async (workingDir) => _createGitMonitor(workingDir);

const GitMonitorFactory = {
  createGitMonitor,
};

module.exports = {
  GitMonitorFactory,
  _createGitMonitor, // for testing
};
