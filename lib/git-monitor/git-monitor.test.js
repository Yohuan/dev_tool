const chalk = require('chalk');

const { GitMonitor } = require('./git-monitor');

describe('GitMonitor', () => {
  const workingDir = 'working directory';
  const mockGit = {
    revparse: jest.fn().mockResolvedValue('current branch'),
    diffSummary: jest.fn().mockResolvedValue({
      changed: 3,
      insertions: 5,
      deletions: 7,
    }),
  };

  describe('getCurrentBranch', () => {
    it('gets current branch name', async () => {
      const gitMonitor = GitMonitor(mockGit, workingDir);
      const currentBranch = await gitMonitor.getCurrentBranch();
      expect(currentBranch).toBe('current branch');
      expect(mockGit.revparse).toBeCalledWith(['--abbrev-ref', 'HEAD']);
    });
  });
  describe('parseBranchDiff', () => {
    it('parses number of modified files and lines for target branch', async () => {
      const gitMonitor = GitMonitor(mockGit, workingDir);
      const branchDiff = await gitMonitor.parseBranchDiff('target branch');
      expect(branchDiff).toEqual({
        numModifiedFile: 3,
        numModifiedLine: 5 + 7,
      });
    });
  });
  describe('watchBranchDiff', () => {
    it('should log on change', async () => {
      let handler;
      const mockFileWatcher = {
        watch: jest.fn().mockReturnThis(),
        on: jest.fn((eventType, eventHandler) => {
          handler = eventHandler;
        }),
      };
      const mockConsole = {
        clear: jest.fn(),
        log: jest.fn(),
      };
      const gitMonitor = GitMonitor(mockGit, workingDir, mockFileWatcher);
      gitMonitor.watchBranchDiff('target branch', 10, 10, mockConsole);
      await handler();
      expect(mockFileWatcher.watch).toBeCalledWith(workingDir, { persistent: true });
      expect(mockFileWatcher.on.mock.calls[0][0]).toBe('all');
      expect(mockConsole.clear).toBeCalled();
      expect(mockConsole.log).toHaveBeenNthCalledWith(1, 'current branch -> target branch');
      expect(mockConsole.log).toHaveBeenNthCalledWith(2, chalk.green('3 files are modified.'));
      expect(mockConsole.log).toHaveBeenNthCalledWith(3, chalk.red('12 lines are modified.'));
    });
  });
});
