const { ArgumentParser } = require('argparse');

const { GitMonitorFactory, displayBranchInfo, displayDiffInfo } = require('../lib/git-monitor');

const _createArgParser = () => {
  const parser = new ArgumentParser({
    description: 'This is a monitor of branch difference',
  });
  parser.addArgument(
    ['-d', '--git-working-dir'],
    {
      help: 'The directory of git project',
      dest: 'workingDir',
      type: 'string',
      required: true,
    },
  );
  parser.addArgument(
    ['-tb', '--target-branch'],
    {
      help: 'The target compared branch',
      dest: 'targetBranch',
      type: 'string',
      defaultValue: 'master',
    },
  );
  parser.addArgument(
    ['-mf', '--max-diff-files'],
    {
      help: 'The maximum number of allowed modified files',
      dest: 'numMaxFile',
      type: 'int',
      defaultValue: 10,
    },
  );
  parser.addArgument(
    ['-ml', '--max-diff-lines'],
    {
      help: 'The maximum number of allowed modified lines',
      dest: 'numMaxLine',
      type: 'int',
      defaultValue: 50,
    },
  );
  return parser;
};

const main = async () => {
  const parser = _createArgParser();
  const args = parser.parseArgs();
  const {
    workingDir, targetBranch, numMaxFile, numMaxLine,
  } = args;
  const gitMonitor = await GitMonitorFactory.createGitMonitor(workingDir);
  const currentBranch = await gitMonitor.getCurrentBranch();
  const { numModifiedFile, numModifiedLine } = await gitMonitor.parseBranchDiff(targetBranch);
  console.clear();
  displayBranchInfo(currentBranch, targetBranch);
  displayDiffInfo(numModifiedFile, numModifiedLine, numMaxFile, numMaxLine);
  gitMonitor.watchBranchDiff(targetBranch, numMaxFile, numMaxLine);
};

main();
