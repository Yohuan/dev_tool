const { _createGitMonitor } = require('./git-monitor-factory');

describe('_createGitMonitor', () => {
  it('throws error with non-existing directory', async () => {
    const workingDir = 'non-existing directory';
    const errorMsg = /not a valid directory/;
    const FileSystem = {
      existsSync: jest.fn(() => false),
    };
    await expect(_createGitMonitor(workingDir, null, FileSystem, null)).rejects.toThrow(errorMsg);
    expect(FileSystem.existsSync).toBeCalledWith(workingDir);
  });
  it('throws error with non-directory', async () => {
    const workingDir = 'a file';
    const errorMsg = /not a valid directory/;
    const FileSystem = {
      existsSync: () => true,
      statSync: jest.fn(() => ({
        isDirectory: () => false,
      })),
    };
    await expect(_createGitMonitor(workingDir, null, FileSystem, null)).rejects.toThrow(errorMsg);
    expect(FileSystem.statSync).toBeCalledWith(workingDir);
  });
  it('throws error with non-git repository', async () => {
    const workingDir = 'not a git repo';
    const errorMsg = /not under a git project/;
    const FileSystem = {
      existsSync: () => true,
      statSync: () => ({
        isDirectory: () => true,
      }),
    };
    const createGit = jest.fn(() => ({
      checkIsRepo: () => Promise.resolve(false),
    }));
    await expect(_createGitMonitor(workingDir, createGit, FileSystem, null)).rejects.toThrow(errorMsg);
    expect(createGit).toBeCalledWith(workingDir);
  });
  it('calls the constructor with proper ars', async () => {
    const workingDir = 'a git repo';
    const FileSystem = {
      existsSync: () => true,
      statSync: () => ({
        isDirectory: () => true,
      }),
    };
    const git = { checkIsRepo: () => Promise.resolve(true) };
    const createGit = () => git;
    const gitMonitor = {};
    const GitMonitorConstructor = jest.fn(() => gitMonitor);
    const createdGotMonitor = await _createGitMonitor(workingDir, createGit, FileSystem, GitMonitorConstructor);
    expect(GitMonitorConstructor.mock.calls[0]).toEqual([git, workingDir]);
    expect(createdGotMonitor).toBe(gitMonitor);
  });
});
