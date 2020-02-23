const fs = require('fs');

const { ArgumentParser } = require('argparse');
const simpleGit = require('simple-git/promise');

const _createArgParser = () => {
  const parser = new ArgumentParser({
    description: 'This is a monitor of branch difference',
  });
  parser.addArgument(
    ['-d', '--git-project-dir'],
    {
      help: 'The directory of git project',
      dest: 'projectDir',
      type: 'string',
      required: true,
    },
  );
  parser.addArgument(
    ['-tb', '--target-branch'],
    {
      help: 'The target branch',
      dest: 'targetBranch',
      type: 'string',
      required: true,
    },
  );
  parser.addArgument(
    ['-cb', '--compared-branch'],
    {
      help: 'The compared branch',
      dest: 'comparedBranch',
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

const _createGit = async (projectDir) => {
  if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
    throw new Error(`${projectDir} is not a valid directory.`);
  }
  const git = simpleGit(projectDir);
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error(`${projectDir} is not under a git project.`);
  }
  return git;
};

const main = async () => {
  const parser = _createArgParser();
  const args = parser.parseArgs();
  const { projectDir } = args;
  const git = await _createGit(projectDir);
};

main();
