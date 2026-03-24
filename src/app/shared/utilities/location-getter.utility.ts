export function getLocation(target: any): { city: string; country: string }[] {
  const locations: { city: string; country: string }[] = [];
  
  const items = Array.isArray(target) ? target : [target];

  for (const item of items) {
    if (item && typeof item === 'object') {
      
      const countryCode = item.address?.country?.name;
      const cityCode = item.address?.city?.name;

      if (countryCode && cityCode) {
        locations.push({ 
          country: countryCode, 
          city: cityCode 
        });
      }
    }
  }

  return locations;
}