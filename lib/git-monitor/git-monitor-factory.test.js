const { _createGitMonitor } = require('./git-monitor-factory');

describe('_createGitMonitor', () => {
  it('throws error with non-existing directory', async () => {
    const workingDir = 'non-existing directory';
    const errorMsg = /not a valid directory/;
    const fileSystem = {
      existsSync: jest.fn(() => false),
    };
    await expect(_createGitMonitor(workingDir, fileSystem)).rejects.toThrow(errorMsg);
    expect(fileSystem.existsSync).toBeCalledWith(workingDir);
  });
  it('throws error with non-directory', async () => {
    const workingDir = 'a file';
    const errorMsg = /not a valid directory/;
    const fileSystem = {
      existsSync: () => true,
      statSync: jest.fn(() => ({
        isDirectory: () => false,
      })),
    };
    await expect(_createGitMonitor(workingDir, fileSystem)).rejects.toThrow(errorMsg);
    expect(fileSystem.statSync).toBeCalledWith(workingDir);
  });
  it('throws error with non-git repository', async () => {
    const workingDir = 'not a git repo';
    const errorMsg = /not under a git project/;
    const fileSystem = {
      existsSync: () => true,
      statSync: () => ({
        isDirectory: () => true,
      }),
    };
    const createGit = jest.fn(() => ({
      checkIsRepo: () => Promise.resolve(false),
    }));
    await expect(_createGitMonitor(workingDir, fileSystem, null, createGit)).rejects.toThrow(errorMsg);
    expect(createGit).toBeCalledWith(workingDir);
  });
  it('calls the constructor with proper ars', async () => {
    const workingDir = 'a git repo';
    const fileSystem = {
      existsSync: () => true,
      statSync: () => ({
        isDirectory: () => true,
      }),
    };
    const fileWatcher = {};
    const git = { checkIsRepo: () => Promise.resolve(true) };
    const createGit = () => git;
    const gitMonitor = {};
    const GitMonitorConstructor = jest.fn(() => gitMonitor);
    const createdGotMonitor = await _createGitMonitor(
      workingDir, fileSystem, fileWatcher, createGit, GitMonitorConstructor,
    );
    expect(GitMonitorConstructor.mock.calls[0]).toEqual([git, workingDir, fileWatcher]);
    expect(createdGotMonitor).toBe(gitMonitor);
  });
});
