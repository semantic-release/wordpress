import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PluginConfig {
  /**
   * Package type.
   *
   * Can be either `theme` or `plugin`.
   *
   */
  @IsString()
  @IsEnum(['theme', 'plugin'])
  type!: string;

  /**
   * Wheter to include assets from `.wordpress-org/assets` folder.
   */
  @IsBoolean()
  withAssets? = false;

  /**
   * Do we need to change the version in the readme.txt file?
   */
  @IsBoolean()
  @IsOptional()
  withReadme? = false;

  /**
   * Do we output the version in a file?
   */
  @IsBoolean()
  withVersionFile? = true;

  /**
   * Path to the plugin/theme.
   *
   * @default './'
   */
  @IsString()
  @IsOptional()
  path? = './';

  /**
   * Do we need to copy the files to a temporary directory?
   *
   * @default false
   */
  @IsBoolean()
  copyFiles?: boolean = false;

  /**
   * Path to the release directory
   *
   *
   * @default '/tmp/wp-release'
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  releasePath? = '/tmp/wp-release';

  @IsString()
  @IsOptional()
  workDir?: string = '';

  /**
   * Slug of the plugin/theme.
   */
  @IsString()
  @IsNotEmpty()
  slug!: string;

  /**
   * Files to change the version in.
   *
   * @default []
   */
  @IsString({ each: true })
  @IsOptional()
  versionFiles?: string[] = [];

  /**
   * Files to include in the release.
   */
  @IsString({ each: true })
  @IsOptional()
  include?: string[];

  /**
   * Files to exclude from the release.
   */
  @IsString({ each: true })
  @IsOptional()
  exclude?: string[];
}
