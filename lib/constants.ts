/**
 * Globs to exclude from the release.
 */
export const DEFAULT_EXCLUDES = [
  // Version control and editor files
  '.git*', // Exclude Git repository data
  '.wordpress-org', // Exclude WordPress.org-specific files
  '.yarn*', // Exclude Yarn package manager data
  '.editorconfig', // Exclude EditorConfig settings
  '.eslint*', // Exclude ESLint configurations
  '.prettier*', // Exclude Prettier configurations
  '.babelrc*', // Exclude Babel configurations
  '.browserslistrc*', // Exclude Browserslist configurations
  '.releaserc*', // Exclude release configurations
  '.stylelint*', // Exclude stylelint configurations
  '*phpcs*', // Exclude PHPCS (PHP CodeSniffer) configurations
  'composer.json', // Exclude Composer project file
  'composer.lock', // Exclude Composer lock file
  'LICENSE', // Exclude project license file

  // Build and output directories
  'build', // Exclude build output directory
  'coverage', // Exclude test coverage output directory

  // Environment and system files
  '.env*', // Exclude environment files
  '.DS_Store', // Exclude macOS specific files
  '*.log', // Exclude log files

  // Temporary and cache directories
  'tmp', // Exclude temporary files or directories
  '.cache', // Exclude cache directories

  // Logs and test results
  'logs', // Exclude application logs
  'test-results', // Exclude test result files

  // PHP-specific files and directories
  '*.phpc', // Exclude PHPC files (PHP Code Compiler)
  'phpunit.xml', // Exclude PHPUnit configuration file
  'phpunit.xml.dist', // Exclude PHPUnit configuration file (dist version)
  'phpunit', // Exclude PHPUnit output directory
  'composer.phar', // Exclude Composer PHAR file
  '.phpstorm.meta.php', // Exclude PhpStorm meta file
  '.idea', // Exclude PhpStorm IDE settings
  'nbproject', // Exclude NetBeans IDE project directory
  'Thumbs.db', // Exclude Windows thumbnail cache file
  'ehthumbs.db', // Exclude Windows thumbnail cache file
  '*.swp', // Exclude Vim swap files
  '*.swo', // Exclude Vim swap files

  // Additional editor-specific exclusions
  '.vscode', // Exclude Visual Studio Code settings
  '.vscode-test', // Exclude Visual Studio Code test settings
  '.vs', // Exclude Visual Studio IDE settings
  '.atom', // Exclude Atom Editor settings
  '.sublime-*', // Exclude Sublime Text settings and workspace files

  // NodeJS files
  '.npm*', // Exclude npm package manager data
  'node_modules', // Exclude NodeJS dependencies directory
  'yarn.lock', // Exclude Yarn lock file
  'yarn-error.log', // Exclude Yarn error log file
  'yarn-debug.log*', // Exclude Yarn debug log files
  'npm-debug.log*', // Exclude npm debug log files
  'pnpm-debug.log*', // Exclude pnpm debug log files
  'lerna-debug.log*', // Exclude lerna debug log files
  'package-debug.log*', // Exclude npm package debug log files
  'package.json', // Exclude npm package file
  'package-lock.json', // Exclude npm package lock file
  'npm-shrinkwrap.json', // Exclude npm shrinkwrap file
];
