export type ParsedCookie = {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  path: string;
  domain?: string;
  expires?: Date;
  maxAge?: number;
  sameSite?: 'Strict' | 'Lax' | 'None';
};

export const parseSetCookieString = (setCookieString: string): ParsedCookie[] => {
  // Handle empty or invalid input
  if (!setCookieString || typeof setCookieString !== 'string') {
    return [];
  }

  const cookieParts = setCookieString.split(/,(?=\s*\w+=)/).map((cookie) => cookie.trim());

  // Filter out empty parts
  return cookieParts
    .filter((cookie) => cookie.length > 0)
    .map((cookie) => {
      const cookieData: ParsedCookie = {
        name: '',
        value: '',
        httpOnly: false,
        secure: false,
        path: '/',
      };

      try {
        // Split cookie into key-value pairs (name=value)
        const [nameValue, ...attributes] = cookie.split(';').map((attr) => attr.trim());

        if (!nameValue?.includes('=')) {
          throw new Error('Invalid cookie format: missing name=value pair');
        }

        const [name, ...valueParts] = nameValue.split('=');
        cookieData.name = name;
        // Handle values that might contain '=' characters
        cookieData.value = valueParts.join('=');

        // Decode the value if it's URL encoded
        try {
          cookieData.value = decodeURIComponent(cookieData.value);
        } catch (e) {
          // If decoding fails, keep the original value
        }

        attributes.forEach((attr) => {
          const [attrName, ...attrValueParts] = attr.split('=').map((part) => part.trim());
          const attrValue = attrValueParts.join('=');

          switch (attrName.toLowerCase()) {
            case 'httponly':
              cookieData.httpOnly = true;
              break;
            case 'secure':
              cookieData.secure = true;
              break;
            case 'path':
              cookieData.path = attrValue || '/';
              break;
            case 'domain':
              cookieData.domain = attrValue;
              break;
            case 'max-age':
              const maxAge = parseInt(attrValue, 10);
              if (!isNaN(maxAge)) {
                cookieData.maxAge = maxAge;
              }
              break;
            case 'expires':
              try {
                const dateStr = attrValue.replace(/(;.*)?$/, '');
                const expires = new Date(dateStr);
                if (!isNaN(expires.getTime())) {
                  cookieData.expires = expires;
                }
              } catch (e) {
                // Invalid date format, ignore
              }
              break;
            case 'samesite':
              const sameSiteValue = attrValue.toLowerCase();
              if (['strict', 'lax', 'none'].includes(sameSiteValue)) {
                cookieData.sameSite = (sameSiteValue.charAt(0).toUpperCase() +
                  sameSiteValue.slice(1)) as ParsedCookie['sameSite'];
              }
              break;
          }
        });

        return cookieData;
      } catch (error) {
        // If parsing fails for a cookie, return a minimal valid cookie object
        return cookieData;
      }
    });
};

export type CookieMap = Record<string, Omit<ParsedCookie, 'name'>>;

export const parseSetCookieStringAsMap = (setCookieString: string): CookieMap => {
  const cookies = parseSetCookieString(setCookieString);
  return cookies.reduce<CookieMap>((acc, cookie) => {
    const { name, ...cookieData } = cookie;
    acc[name] = cookieData;
    return acc;
  }, {});
};

export type SimpleCookieMap = Record<string, string>;

export const parseSetCookieStringToValues = (setCookieString: string): SimpleCookieMap => {
  const cookies = parseSetCookieString(setCookieString);
  return cookies.reduce<SimpleCookieMap>((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});
};
