/* eslint-disable no-console */
const chalk = require('chalk');
const chokidar = require('chokidar');

const displayDiffInfo = (
  currentBranch,
  targetBranch,
  numModifiedFile,
  numModifiedLine,
  numMaxFile,
  numMaxLine,
) => {
  const norm = chalk.green;
  const warn = chalk.red;

  console.clear();
  console.log(`${currentBranch} -> ${targetBranch}`);
  if (numModifiedFile < numMaxFile) {
    console.log(norm(`${numModifiedFile} files are modified.`));
  } else {
    console.log(warn(`${numModifiedFile} files are modified.`));
  }
  if (numModifiedLine < numMaxLine) {
    console.log(norm(`${numModifiedLine} lines are modified.`));
  } else {
    console.log(warn(`${numModifiedLine} lines are modified.`));
  }
};

const GitMonitor = (git, workingDir) => {
  const _git = git;
  const _workingDir = workingDir;

  const getCurrentBranch = async () => _git.revparse(['--abbrev-ref', 'HEAD']);

  const parseBranchDiff = async (targetBranch) => {
    const diff = await _git.diffSummary([targetBranch]);
    return {
      numModifiedFile: diff.changed,
      numModifiedLine: diff.insertions + diff.deletions,
    };
  };

  const watchBranchDiff = (targetBranch, numMaxFile, numMaxLine) => {
    const handleChange = async () => {
      const currentBranch = await getCurrentBranch();
      const { numModifiedFile, numModifiedLine } = await parseBranchDiff(targetBranch);
      displayDiffInfo(currentBranch, targetBranch, numModifiedFile, numModifiedLine, numMaxFile, numMaxLine);
    };

    chokidar
      .watch(_workingDir, { persistent: true })
      .on('all', handleChange);
  };

  return {
    getCurrentBranch,
    parseBranchDiff,
    watchBranchDiff,
  };
};

module.exports = { GitMonitor, displayDiffInfo };
