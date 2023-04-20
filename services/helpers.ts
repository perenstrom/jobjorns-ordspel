import crypto from 'crypto';

export const shuffleArray = <T>(array: T[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const gravatar = (email: string | undefined) => {
  if (email) {
    const hash = crypto.createHash('md5').update(email).digest('hex');

    return 'https://www.gravatar.com/avatar/' + hash + '?d=retro';
  } else {
    return 'https://www.gravatar.com/avatar/?d=retro';
  }
};

export const faviconString = (badge?: string | number) => {
  let svgFavicon =
    '<svg viewBox="0 0 100 100" width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg">';
  svgFavicon +=
    '<rect x="0" y="0" width="92%" height="92%" fill="#2196f3" rx="0" ry="0"></rect>';
  svgFavicon +=
    '<text font-family="sans-serif" x="42.5%" y="52.5%" font-size="4em" fill="white" text-anchor="middle" dominant-baseline="middle">J</text>';
  svgFavicon +=
    '<text font-family="sans-serif" x="75%" y="30%" font-size="2em" fill="white" text-anchor="middle" alignment-baseline="central">7</text>';
  svgFavicon +=
    '<polygon points="92,0 100,8 100,100 92,92" fill="#1565c0"></polygon>';
  svgFavicon +=
    '<polygon points="0,92 8,100 100,100 92,92" fill="#64b5f6"></polygon>';

  if (badge) {
    svgFavicon += '<circle cx="67" cy="33" r="30" fill="red"></circle>';
    svgFavicon +=
      '<text font-family="sans-serif" x="68" y="47.7" font-size="3em" fill="white" text-anchor="middle">';
    if (
      !(typeof badge === 'string' && badge.length > 1) &&
      !(typeof badge === 'number' && badge > 9)
    ) {
      svgFavicon += badge;
    }
    svgFavicon += '</text>';
  }
  svgFavicon += '</svg>';

  const svgFaviconEncoded = Buffer.from(svgFavicon).toString('base64');
  const svgFaviconWithPrefix = `data:image/svg+xml;base64,${svgFaviconEncoded}`;
  return svgFaviconWithPrefix;
};
