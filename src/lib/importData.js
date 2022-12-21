/* export const importData = async (realm, setDataLoaded) => {
  RNFS.readFileAssets('listecnam.csv')
    .then((result) => {
      console.log('GOT RESULT', result.substr(0, 20));
      const cartesPapa = Papa.parse(result.trim(), { header: true });
      const cartes = cartesPapa.data;
      console.log('PAPA PARSED');
      console.log('WRITING STARTED');
      realm.write(() => {
        for (let i = 0; i < cartes.length; i++) {
          const carte = cartes[i];
          realm.create('Cnam', carte, Realm.UpdateMode.Modified);
        }
      });
      console.log('WRITING ENDED');
      setDataLoaded(true);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
}; */
