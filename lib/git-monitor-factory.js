const fs = require('fs');

const simpleGit = require('simple-git/promise');

const { GitMonitor } = require('./git-monitor');

const createGitMonitor = async (workingDir) => {
  if (!fs.existsSync(workingDir) || !fs.statSync(workingDir).isDirectory()) {
    throw new Error(`${workingDir} is not a valid directory.`);
  }
  const git = simpleGit(workingDir);
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error(`${workingDir} is not under a git project.`);
  }
  return GitMonitor(git);
};

module.exports = { createGitMonitor };
