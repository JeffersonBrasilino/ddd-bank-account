module.exports = {
  ci: false,
  branches: ['main'],
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
