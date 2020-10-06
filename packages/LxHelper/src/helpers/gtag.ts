import ReactGA from "react-ga";

/**
 * Tags events like button clicks, sharing or video plays with following parameters.
 *
 * @param {string} action           Event action (Eg. sign_in, add_to_cart, share)
 * @param {string} category         Events with similar category names will be grouped together
 * @param {string} label (optional) Event description (Eg. Merchant Sign In, User Add to Cart)
 * @param {string} value (optional) Event value (Eg. "22", "[merchantId]")
 */
export const event = (options: {
  action: string;
  category: string;
  label: string;
  value: number;
}): void => {
  const { action, category, label, value } = options;
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

/**
 * Initialize GA and track pageviews
 *
 * @param {string} GA_TRACKING_ID
 */
export const initialize = (GA_TRACKING_ID: string, options: any = {}): void => {
  ReactGA.initialize(GA_TRACKING_ID, options);
};

/**
 * This will set the values of custom dimensions in Google Analytics.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#dimension
 *
 * @param {object} options custom dimension
 * @param {array} trackers multiple trackers
 */
export const set = (options: any, trackers = []): void => {
  if (trackers.length > 0) {
    ReactGA.set(options, trackers);
    return;
  }
  ReactGA.set(options);
};

export const googleAnalytics = {
  initialize,
  event,
  set
};
