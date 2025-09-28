export async function fetchAffectedCountries(token: string) {
  try{
    const response = await fetch('/api/countries',{
      headers:{
        Authorization: `Token ${token}`,
        'Content-type':'application/json',
      },
    });

    if (!response.ok){
      throw new Error('Failed to fetch countries:'+ response.statusText);
    }
    const result = await response.json();
    return result;
  }catch (error){
    throw new Error(`Error fetching countries: ${(error as Error).message}`);
  }
  
}