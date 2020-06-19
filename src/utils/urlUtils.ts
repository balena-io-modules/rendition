import isUrl from 'is-url-superb';

/**
 *
 * @param {String} url - The url to check
 * @description checks if url is External from the window.location
 * @example
 * // window.location.origin = 'https://jel.ly.fish'
 * // returns true
 * isExternalUrl('https://google.com/maps')
 * @example
 * // window.location.origin = 'https://jel.ly.fish'
 * // returns false
 * isExternalUrl('https://jel.ly.fish/inbox')
 *
 * @returns {Boolean}
 */
export const isExternalUrl = (url = null) => {
	// It's external if it's absolute and isn't the same host
	return isUrl(url) && !url.startsWith(window.location.origin);
};

/**
 *
 * @param {String} url - The url to be converted
 * @description Converts an absolute url of the current window.location.origin to an relative url.
 * @example
 * // window.location.origin = 'https://google.com/maps'
 * // returns '/maps'
 * toRelativeUrl('https://google.com/maps')
 *
 * @returns {String} Return relative url without window.location.origin
 */
export const toRelativeUrl = (url = null) => {
	return url.replace(window.location.origin, '');
};
