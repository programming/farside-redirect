const twitterUrls = [
  "*://twitter.com/*"
];
const redditUrls = [
  "*://reddit.com/*",
  "*://www.reddit.com/*",
  "*://old.reddit.com/*",
  "*://np.reddit.com/*",
  "*://new.reddit.com/*",
  "*://amp.reddit.com/*"
];
const youtubeUrls = [
  "*://youtube.com/*",
  "*://m.youtube.com/*",
  "*://www.youtube.com/*",
  "*://youtu.be/*",
];
const mediumUrls = [
  "*://medium.com/*",
  "*://*.medium.com/*"
];
const instagramUrls = [
  "*://www.instagram.com/*",
  "*://instagram.com/*",
  "*://www.instagr.am/*",
  "*://instagr.am/*",
];

let farsideInstances = {
  nitter: "farside.link/nitter",
  teddit: "farside.link/teddit",
  invidious: "farside.link/invidious",
  scribe: "farside.link/scribe",
  bibliogram: "farside.link/bibliogram",
};

function replaceUrl(url, regex, newDomain) {
  return url.replace(regex, `$1://${newDomain}/$3`);
}

function getDomain(url) {
  if (url) {
    return url.replace(/https?:\/\/([^\/]*).*/, "$1");
  } else {
    return null;
  }
}

function redirect(requestDetails) {
  const originalUrl = requestDetails.url;
  const originalDomain = getDomain(originalUrl);

  const twitterRegex = /(https?):\/\/(twitter.com)\/(.*)/;
  const redditRegex = /(https?):\/\/(reddit.com|www.reddit.com|old.reddit.com|np.reddit.com|new.reddit.com|amp.reddit.com)\/(.*)/;
  const youtubeRegex = /(https?):\/\/(youtube.com|m.youtube.com|www.youtube.com|youtu.be)\/(.*)/;
  const mediumRegex = /https?:\/\/(?:.*\.)*(?<!link\.)medium\.com(\/.*)?$/;
  const instagramPostRegex = /https?:\/\/(www\.)?(instagram.com|instagr.am)\/(p|tv)\/.*/;
  const instagramRegex = /https?:\/\/(www\.)?(instagram.com|instagr.am)\/.*/;

  // Twitter
  if (twitterRegex.test(originalUrl)) {
      const newUrl = replaceUrl(
          originalUrl,
          twitterRegex,
          farsideInstances.nitter
      );
      return {
          redirectUrl: newUrl
      };
  }

  // Reddit
  if (redditRegex.test(originalUrl)) {
      const newUrl = replaceUrl(
          originalUrl,
          redditRegex,
          farsideInstances.teddit
      );
      return {
          redirectUrl: newUrl
      };
  }

  // YouTube
  if (youtubeRegex.test(originalUrl)) {
      const newUrl = replaceUrl(
          originalUrl,
          youtubeRegex,
          farsideInstances.invidious
      );
      return {
          redirectUrl: newUrl
      };
  }

  // Medium
  if (mediumRegex.test(originalUrl)) {
      const newUrl = originalUrl.replace(
          mediumRegex,
          `https://${farsideInstances.scribe}$1`
      );
      return {
          redirectUrl: newUrl
      };
  }

  // Instagram
  if (instagramPostRegex.test(originalUrl)) {
      const newUrl = originalUrl.replace(
          /https?:\/\/((www\.)?(instagram.com|instagr.am))/,
          `https://${farsideInstances.bibliogram}`
      );
      return {
          redirectUrl: newUrl
      };
  }

  if (instagramRegex.test(originalUrl)) {
      const newUrl = originalUrl.replace(
          /https?:\/\/((www\.)?(instagram.com|instagr.am))/,
          `https://${farsideInstances.bibliogram}/u`
      );
      return {
          redirectUrl: newUrl
      };
  }
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {
    urls: [
      ...twitterUrls,
      ...redditUrls,
      ...youtubeUrls,
      ...mediumUrls,
      ...instagramUrls,
    ],
  },
  ["blocking"]
);
