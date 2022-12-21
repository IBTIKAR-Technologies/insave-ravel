import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuetionaiLocalite } from 'src/models/cartes';
import AddMenage from './AddMenage';
import LoadingModal from './LoadingModal';

export default function UrbainOrRural({ user, concession, componentId }) {
  const [urbain, setUrbain] = useState(true);
  const [loading, setLoading] = useState(true);
  const [questionaireLocal, setQuestionLocal] = useState({});
  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userData);
      const q = await getQuetionaiLocalite(parsedData);
      setQuestionLocal(q[0]);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    })();
  }, [setLoading]);
  return (
    <>
      <LoadingModal color={'#fff'} loading={loading} size={80} text="wait" />
      <AddMenage componentId={componentId} concession={concession} user={user} />
    </>
  );
}
