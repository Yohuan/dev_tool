/* eslint-disable no-console */
const chalk = require('chalk');

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

const GitMonitor = (git) => {
  const _git = git;

  const _parseBranchDiff = async (targetBranch) => {
    const diff = await _git.diffSummary([targetBranch]);
    return {
      numModifiedFile: diff.changed,
      numModifiedLine: diff.insertions + diff.deletions,
    };
  };

  return {
    parseBranchDiff: _parseBranchDiff,
  };
};

module.exports = { GitMonitor, displayDiffInfo };
