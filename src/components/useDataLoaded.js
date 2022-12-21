import { useState } from 'react';

export default function useDataLoaded() {
  const [dataLoaded, setDataLoaded] = useState(false);

  return [dataLoaded, setDataLoaded];
}
