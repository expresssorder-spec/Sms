import { getCode } from 'country-list';

export const getCountryCode = (countryName: string): string => {
  if (!countryName || countryName === 'Unknown') return 'UN';
  
  if (countryName.length === 2 && countryName === countryName.toUpperCase()) {
    return countryName;
  }
  
  // Custom mappings for common variations
  const mapping: Record<string, string> = {
    'United States': 'US',
    'USA': 'US',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Russia': 'RU',
    'South Korea': 'KR',
    'Czech Republic': 'CZ',
    'Czechia': 'CZ',
    'Vietnam': 'VN',
    'Taiwan': 'TW',
    'Iran': 'IR',
    'Syria': 'SY',
    'Palestine': 'PS',
    'Venezuela': 'VE',
    'Bolivia': 'BO',
    'Tanzania': 'TZ',
    'Moldova': 'MD',
    'Ivory Coast': 'CI',
    'Côte d’Ivoire': 'CI',
    'Macau': 'MO',
    'Macao': 'MO',
    'Hong Kong': 'HK',
    'North Korea': 'KP',
    'Laos': 'LA',
    'Brunei': 'BN',
    'East Timor': 'TL',
    'Timor-Leste': 'TL',
    'Micronesia': 'FM',
    'Marshall Islands': 'MH',
    'Vatican City': 'VA',
    'Kosovo': 'XK',
    'Eswatini': 'SZ',
    'Swaziland': 'SZ',
    'Cape Verde': 'CV',
    'Cabo Verde': 'CV',
    'Sao Tome and Principe': 'ST',
    'São Tomé & Príncipe': 'ST',
    'Congo - Kinshasa': 'CD',
    'Congo - Brazzaville': 'CG',
    'Central African Republic': 'CF',
    'Equatorial Guinea': 'GQ',
    'Guinea-Bissau': 'GW',
    'Burkina Faso': 'BF',
    'Sierra Leone': 'SL',
    'Antigua & Barbuda': 'AG',
    'Trinidad & Tobago': 'TT',
    'St. Vincent & Grenadines': 'VC',
    'St. Lucia': 'LC',
    'St. Kitts & Nevis': 'KN',
    'Bosnia & Herzegovina': 'BA',
    'North Macedonia': 'MK',
    'Macedonia': 'MK',
    'Myanmar (Burma)': 'MM',
    'Myanmar': 'MM',
    'Burma': 'MM',
  };

  if (mapping[countryName]) {
    return mapping[countryName];
  }

  const code = getCode(countryName);
  return code || 'UN';
};
