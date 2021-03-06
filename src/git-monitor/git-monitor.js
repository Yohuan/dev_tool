/* eslint-disable no-console */
const chalk = require('chalk');
const chokidar = require('chokidar');

const displayBranchInfo = (currentBranch, targetBranch, console) => {
  console.log(`${currentBranch} -> ${targetBranch}`);
};

const displayDiffInfo = (
  numModifiedFile,
  numModifiedLine,
  numMaxFile,
  numMaxLine,
  console,
) => {
  const norm = chalk.green;
  const warn = chalk.red;
  if (numModifiedFile <= numMaxFile) {
    console.log(norm(`${numModifiedFile} files are modified.`));
  } else {
    console.log(warn(`${numModifiedFile} files are modified.`));
  }
  if (numModifiedLine <= numMaxLine) {
    console.log(norm(`${numModifiedLine} lines are modified.`));
  } else {
    console.log(warn(`${numModifiedLine} lines are modified.`));
  }
};

const GitMonitor = (git, workingDir, fileWatcher = chokidar) => {
  const _git = git;
  const _workingDir = workingDir;
  const _fileWatcher = fileWatcher;

  const getCurrentBranch = async () => _git.revparse(['--abbrev-ref', 'HEAD']);

  const parseBranchDiff = async (targetBranch) => {
    const diff = await _git.diffSummary([targetBranch]);
    return {
      numModifiedFile: diff.changed,
      numModifiedLine: diff.insertions + diff.deletions,
    };
  };

  const watchBranchDiff = (targetBranch, numMaxFile, numMaxLine, console) => {
    const handleChange = async () => {
      const currentBranch = await getCurrentBranch();
      const { numModifiedFile, numModifiedLine } = await parseBranchDiff(targetBranch);
      console.clear();
      displayBranchInfo(currentBranch, targetBranch, console);
      displayDiffInfo(numModifiedFile, numModifiedLine, numMaxFile, numMaxLine, console);
    };

    _fileWatcher
      .watch(_workingDir, { persistent: true })
      .on('all', handleChange);
  };

  return {
    getCurrentBranch,
    parseBranchDiff,
    watchBranchDiff,
  };
};

module.exports = {
  GitMonitor,
  displayBranchInfo,
  displayDiffInfo,
};
