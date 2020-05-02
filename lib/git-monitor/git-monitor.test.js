const chalk = require('chalk');

const { GitMonitor } = require('./git-monitor');

describe('GitMonitor', () => {
  const workingDir = 'working directory';

  describe('getCurrentBranch', () => {
    it('gets current branch name', async () => {
      const git = {
        revparse: jest.fn().mockResolvedValue('current branch'),
      };
      const gitMonitor = GitMonitor(git, workingDir);
      const currentBranch = await gitMonitor.getCurrentBranch();
      expect(currentBranch).toBe('current branch');
      expect(git.revparse).toBeCalledWith(['--abbrev-ref', 'HEAD']);
    });
  });
  describe('parseBranchDiff', () => {
    it('parses number of modified files and lines for target branch', async () => {
      const git = {
        diffSummary: jest.fn().mockResolvedValue({
          changed: 3,
          insertions: 5,
          deletions: 7,
        }),
      };
      const gitMonitor = GitMonitor(git, workingDir);
      const branchDiff = await gitMonitor.parseBranchDiff('target branch');
      expect(branchDiff).toEqual({
        numModifiedFile: 3,
        numModifiedLine: 5 + 7,
      });
    });
  });
  describe('watchBranchDiff', () => {
    it('should log on change', async () => {
      const git = {
        revparse: jest.fn().mockResolvedValue('current branch'),
        diffSummary: jest.fn().mockResolvedValue({
          changed: 3,
          insertions: 5,
          deletions: 7,
        }),
      };
      let _handler;
      const fileWatcher = {
        watch: jest.fn().mockReturnThis(),
        on: jest.fn(async (eventType, handler) => {
          _handler = handler;
        }),
      };
      const mockConsole = {
        clear: jest.fn(),
        log: jest.fn(),
      };
      const gitMonitor = GitMonitor(git, workingDir, fileWatcher);
      gitMonitor.watchBranchDiff('target branch', 10, 10, mockConsole);
      await _handler();
      expect(fileWatcher.watch).toBeCalledWith(workingDir, { persistent: true });
      expect(fileWatcher.on.mock.calls[0][0]).toBe('all');
      expect(mockConsole.clear).toBeCalled();
      expect(mockConsole.log).toHaveBeenNthCalledWith(1, 'current branch -> target branch');
      expect(mockConsole.log).toHaveBeenNthCalledWith(2, chalk.green('3 files are modified.'));
      expect(mockConsole.log).toHaveBeenNthCalledWith(3, chalk.red('12 lines are modified.'));
    });
  });
});
