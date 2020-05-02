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
});
