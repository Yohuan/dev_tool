/* eslint-disable no-console */
const chalk = require('chalk');
const chokidar = require('chokidar');

const displayDiffInfo = (numModifiedFile, numModifiedLine, numMaxFile, numMaxLine) => {
  if (numModifiedFile < numMaxFile) {
    console.log(chalk.green(`${numModifiedFile} files are modified.`));
  } else {
    console.log(chalk.red(`${numModifiedFile} files are modified.`));
  }
  if (numModifiedLine < numMaxLine) {
    console.log(chalk.green(`${numModifiedLine} lines are modified.`));
  } else {
    console.log(chalk.red(`${numModifiedLine} lines are modified.`));
  }
};

const GitMonitor = (git, workingDir) => {
  const _git = git;
  const _workingDir = workingDir;

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
        const { numModifiedFile, numModifiedLine } = await _parseBranchDiff(targetBranch);
        console.clear();
        displayDiffInfo(numModifiedFile, numModifiedLine, numMaxFile, numMaxLine);
      });
  };

  return {
    parseBranchDiff: _parseBranchDiff,
    watchBranchDiff: _watchBranchDiff,
  };
};

module.exports = { GitMonitor, displayDiffInfo };
