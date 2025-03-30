export type ParsedCookie = {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  path: string;
  expires?: Date;
  maxAge?: number;
};

export const parseSetCookieString = (setCookieString: string): ParsedCookie[] => {
  const cookieParts = setCookieString.split(/,(?=\s*\w+=)/).map((cookie) => cookie.trim());

  return cookieParts.map((cookie) => {
    const cookieData: ParsedCookie = {} as ParsedCookie;

    // Split cookie into key-value pairs (name=value)
    const [nameValue, ...attributes] = cookie.split(';').map((attr) => attr.trim());
    const [name, value] = nameValue.split('=');
    cookieData.name = name;
    cookieData.value = value;

    attributes.forEach((attr) => {
      if (attr.toLowerCase().startsWith('httponly')) {
        cookieData.httpOnly = true;
      } else if (attr.toLowerCase().startsWith('secure')) {
        cookieData.secure = true;
      } else if (attr.toLowerCase().startsWith('path')) {
        cookieData.path = attr.split('=')[1];
      } else if (attr.toLowerCase().startsWith('max-age')) {
        cookieData.maxAge = parseInt(attr.split('=')[1], 10);
      } else if (attr.toLowerCase().startsWith('expires')) {
        // Extract and parse the date
        const dateStr = attr.split('=')[1].trim();
        // Ensure the date is correctly formatted
        cookieData.expires = new Date(dateStr.replace(/(;.*)?$/, ''));
        // Check if the date is invalid, and handle accordingly
        if (isNaN(cookieData.expires.getTime())) {
          cookieData.expires = undefined;
        }
      }
    });

    // Set defaults if not provided in cookie attributes
    cookieData.httpOnly = cookieData.httpOnly || false;
    cookieData.secure = cookieData.secure || false;
    cookieData.path = cookieData.path || '/';

    return cookieData;
  });
};
