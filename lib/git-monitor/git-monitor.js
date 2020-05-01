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

  const _getCurrentBranch = async () => _git.revparse(['--abbrev-ref', 'HEAD']);

  const _parseBranchDiff = async (targetBranch) => {
    const diff = await _git.diffSummary([targetBranch]);
    return {
      numModifiedFile: diff.changed,
      numModifiedLine: diff.insertions + diff.deletions,
    };
  };

  const _watchBranchDiff = (targetBranch, numMaxFile, numMaxLine) => {
    chokidar
      .watch(_workingDir, { persistent: true })
      // eslint-disable-next-line no-unused-vars
      .on('all', async (event, path) => {
        const currentBranch = await _getCurrentBranch();
        const { numModifiedFile, numModifiedLine } = await _parseBranchDiff(targetBranch);
        console.clear();
        displayDiffInfo(currentBranch, targetBranch, numModifiedFile, numModifiedLine, numMaxFile, numMaxLine);
      });
  };

  return {
    getCurrentBranch: _getCurrentBranch,
    parseBranchDiff: _parseBranchDiff,
    watchBranchDiff: _watchBranchDiff,
  };
};

module.exports = { GitMonitor, displayDiffInfo };
