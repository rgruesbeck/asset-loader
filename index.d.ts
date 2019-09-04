// Type definitions for game-asset-loader 0.0.8
// Project: https://github.com/rgruesbeck/game-asset-loader
// Definitions by: Jeff Peterson <https://github.com/bdjeffyp>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/**
 * Generic container object for any asset.
 * @param type a string that specifies the type of object returned: image, sound, font
 * @param key a string that refers to the asset for access
 * @param value the asset data (or the font family name as a string)
 */
export type Asset = {
  type: string,
  key: string,
  value: HTMLImageElement | AudioBuffer | string
};

/**
 * Collection of all loaded assets as key-value pairs from loadList()
 */
export type Assets = {
  image?: { [key: string]: HTMLImageElement },
  sound?: { [key: string]: AudioBuffer },
  font?: { [key: string]: string }
};

/**
 * Object to describe the loading progress
 */
export type Progress = {
  percent: number,
  loaded: null | {
    type: string,
    key: string
  }
};

////// loadImage //////
/**
 * Optional object for loading images.
 * @param optional specify the image is optional
 * @param params URL parameters to pass to the loader
 */
export type ImageOptions = {
  optional: boolean,
  params: string
}
/**
 * Loads an image from a given URL, returning the data in an Asset object.
 * @param key a string that refers to the image for access
 * @param url the location of the resource
 * @param options (not required) specify if this image is optional and additional URL parameters
 * @returns the desired image or a blank/default image as a fallback
 */
export function loadImage(key: string, url: string, options?: ImageOptions): Promise<Asset>;

////// loadSound //////
/**
 * Loads a sound file from a given URL, returning the data in an Asset object.
 * @param key a string that refers to the sound for access
 * @param url the location of the resource
 * @returns the desired sound or a one second silent sound as a fallback
 */
export function loadSound(key: string, url: string): Promise<Asset>;

////// loadFont //////
/**
 * An optional object for loading fonts.
 * Provide the name of a fallback font if the desired one is unavailable at the URL.
 */
export type FontOptions = {
  fallback: string;
}
/**
 * 
 * @param key a string that refers to the font for access
 * @param url the location of the resource
 * @param options optionally provide a fallback font name or will default to Arial if none provided
 * @returns the desired font or a fallback font or Arial if unavailable
 */
export function loadFont(key: string, url: string, options?: FontOptions): Promise<Asset>;

////// loadList //////
/**
 * Processes the collection of assets and determines completion percentage as progress
 * @param list Collection of all load*() methods
 * @param progress Callback to indicate progress of loading the assets
 */
export function loadList(list: Promise<Asset>[], progress: (progress: Progress) => void): Promise<Assets>;
