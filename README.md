# @semantic-release/wordpress

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to create a zip file for a [WordPress](https://wordpress.org) plugin or theme.

![node-current (scoped)](https://img.shields.io/node/v/%40semantic-release/wordpress)
[![npm (scoped)](https://img.shields.io/npm/v/%40semantic-release/wordpress)](https://www.npmjs.com/package/@semantic-release/wordpress)
[![Release](https://github.com/semantic-release/wordpress/actions/workflows/release.yml/badge.svg)](https://github.com/semantic-release/wordpress/actions/workflows/release.yml)
![Scrutinizer coverage (GitHub/BitBucket)](https://img.shields.io/scrutinizer/coverage/g/oblakstudio/semantic-release-wp-plugin/master)

| Step               | Description                                                                                                     |
|--------------------|-----------------------------------------------------------------------------------------------------------------|
| `verifyConditions` | Verify if the theme / plugin is valid. Check that the necessary files exist and if they contain needed metadata |
| `prepare`          | Copy the theme / plugins files and optionally prepare the asset bundle                                          |
| `publish`          | Create a zip file for the theme / plugin, and optionally zip the assets                                         |
| `success`          | Clean up the intermediate files                                                                                 |

## Install

```bash
$ npm install -D @semantic-release/wordpress
```
## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/wordpress", {
      "type": "plugin",
      "slug" : "my-plugin",
      "withAssets": true,
      "withReadme": true,
      "withChangelog": true,
      "withVersionFile": true,
    }]
  ]
}
```

With this example, for each release, the plugin will:
  * Verify that the plugin is valid
  * Create a zip file for the plugin (/tmp/wp-release/my-plugin.zip)
  * Create a zip file for the assets (/tmp/wp-release/assets.zip)
  * Write the release notes to the readme file (/tmp/wp-release/readme.txt)
  * Copy the readme.txt file (/tmp/wp-release/readme.txt)
  * Create a version file (/tmp/wp-release/version.txt)

## Configuration

Plugin uses no environment variables, but has a lot of configuration options

### Options

| Options           | Description                                               | Default                                                               |
|-------------------|-----------------------------------------------------------|-----------------------------------------------------------------------|
| `type`            | Type of the package to create. Can be `plugin` or `theme` | None. **You must set this explicitly**                                |
| `slug`            | Package slug.                                             | None. **You must set this explicitly**                                |
| `path`            | The path of root folder that contains plugin or theme     | `./`                                                                  |
| `withAssets`      | Does the package have assets (screenshots, banners, logo) | `false`                                                               |
| `withReadme`      | Does the package have a readme.txt file                   | `false`                                                               |
| `withChangelog`   | Are we writing the release notes to the readme file       | `false`                                                               |
| `withVersionFile` | Do we need to create a file with the next release version | `true`                                                                |
| `releasePath`     | Base path for all of the release files                    | `/tmp/wp-release`                                                     |
| `versionFiles`    | Array of additional files containing the package version. | `[]`                                                                  |
| `include`         | Files to include in the package zip file.                 | `**/*`                                                                |
| `exclude`         | Files to exclude from the package zip file                | List of files and folders defined in [constants.ts](lib/constants.ts) |

### Versioning

Plugin will automatically replace versions in your main file (for plugins) and the ``style.css`` file (for themes).
We follow the WordPress codex, so your plugin file must have the same slug as the plugin folder.

If you have other variables which need to have the version replaced, you can add them to the `versionFiles` option.

If you need any further processing of the package files, next release version will be output to `/tmp/wp-release/VERSION` file, if the `withVersionFile` option is set to `true`.

> [!IMPORTANT]
> Version in your plugin / theme must be set to 0.0.0 for this plugin to work

### Assets
If your package is on [wp.org](https://wordpress.org) repository, you might have assets (screenshots, banners, logos) which you want to include in the assets file. Plugin respects the Codex, and expects those to be in ``.wordpress-org/assets`` folder. Main theme screenshot should be named ``screenshot`` and should be there as well.

### Readme
readme.txt is a special Markdown file needed for packages on [wp.org](https://wordpress.org) to work. It can be in the `.wordpress-org` folder, or in the repository root.  
Plugin will automatically replace the version in the file if the `withReadme` option is set to `true`.

> [!WARNING]
> Version in your readme.txt must also be set to 0.0.0 for this plugin to work

### Include / Exclude
By default, plugin will include all files in the package zip file. If you want to exclude some files, you can use the `exclude` option. It accepts an array of files and folders, and uses [glob](https://npmjs.com/package/glob) for path resolution.
You can also use the `include` option which works in the same manner.

#### Notes

 * Include and exclude options are not mutually exclusive so you can use both.
 * Plugin also looks for `.distinclude` and `.distexclude` / `.distignore` files which take precedence over the options set in the plugin.
 * By default we exclude a lot of build artifacts and files which are not needed in the package. You can see the full list in [constants.ts](lib/constants.ts).

### Examples

Plugin with assets, readme and additional version files

```json
{
  "plugins": [
    ["@semantic-release/wordpress", {
      "type": "plugin",
      "slug" : "my-plugin",
      "withAssets": true,
      "withReadme": true,
      "withVersionFile": false,
      "versionFiles": [
        "constants.php",
        "includes/db-schema.php"
      ]
    }]
  ]
}
```
