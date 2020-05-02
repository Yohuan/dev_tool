const { _createGitMonitor } = require('./git-monitor-factory');

describe('_createGitMonitor', () => {
  it('throws error with non-existing directory', async () => {
    const workingDir = 'non-existing directory';
    const errorMsg = /not a valid directory/;
    const mockFileSystem = {
      existsSync: jest.fn(() => false),
    };
    await expect(_createGitMonitor(workingDir, mockFileSystem)).rejects.toThrow(errorMsg);
    expect(mockFileSystem.existsSync).toBeCalledWith(workingDir);
  });
  it('throws error with non-directory', async () => {
    const workingDir = 'a file';
    const errorMsg = /not a valid directory/;
    const mockFileSystem = {
      existsSync: () => true,
      statSync: jest.fn(() => ({
        isDirectory: () => false,
      })),
    };
    await expect(_createGitMonitor(workingDir, mockFileSystem)).rejects.toThrow(errorMsg);
    expect(mockFileSystem.statSync).toBeCalledWith(workingDir);
  });
  it('throws error with non-git repository', async () => {
    const workingDir = 'not a git repo';
    const errorMsg = /not under a git project/;
    const mockFileSystem = {
      existsSync: () => true,
      statSync: () => ({
        isDirectory: () => true,
      }),
    };
    const mockCreateGit = jest.fn(() => ({
      checkIsRepo: () => Promise.resolve(false),
    }));
    await expect(_createGitMonitor(workingDir, mockFileSystem, null, mockCreateGit)).rejects.toThrow(errorMsg);
    expect(mockCreateGit).toBeCalledWith(workingDir);
  });
  it('calls the constructor with proper ars', async () => {
    const workingDir = 'a git repo';
    const mockFileSystem = {
      existsSync: () => true,
      statSync: () => ({
        isDirectory: () => true,
      }),
    };
    const fileWatcher = {};
    const git = { checkIsRepo: () => Promise.resolve(true) };
    const createGit = () => git;
    const gitMonitor = {};
    const mockGitMonitorConstructor = jest.fn(() => gitMonitor);
    const createdGotMonitor = await _createGitMonitor(
      workingDir, mockFileSystem, fileWatcher, createGit, mockGitMonitorConstructor,
    );
    expect(mockGitMonitorConstructor.mock.calls[0]).toEqual([git, workingDir, fileWatcher]);
    expect(createdGotMonitor).toBe(gitMonitor);
  });
});
