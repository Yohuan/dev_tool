const fs = require('fs');

const simpleGit = require('simple-git/promise');

const { GitMonitor } = require('./git-monitor');

const _createGitMonitor = async (workingDir, createGit, FileSystem, GitMonitorConstructor) => {
  if (!FileSystem.existsSync(workingDir) || !FileSystem.statSync(workingDir).isDirectory()) {
    throw new Error(`${workingDir} is not a valid directory.`);
  }
  const git = createGit(workingDir);
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error(`${workingDir} is not under a git project.`);
  }
  return GitMonitorConstructor(git, workingDir);
};

const createGitMonitor = async (workingDir) => _createGitMonitor(workingDir, simpleGit, fs, GitMonitor);

const GitMonitorFactory = {
  createGitMonitor,
};

module.exports = {
  GitMonitorFactory,
  _createGitMonitor, // for testing
};
