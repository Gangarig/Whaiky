interface City {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  }
  
  interface State {
    id: number;
    name: string;
    state_code: string;
    cities: City[];
  }
  
  interface Country {
    id: number;
    name: string;
    states: State[];
  }
  
  const countryStateCityData: Country[] = [

  ];
  
  export default countryStateCityData;
  