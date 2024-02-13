module.exports = {
  ci: false,
  branches: ['main', 'master'],
  plugins: [
    '@semantic-release/changelog',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    '@semantic-release/git',
  ],
};
