import { View, TouchableNativeFeedback, StyleSheet, Text, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor(duration / (1000 * 60 * 60));

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours < 1 ? minutes + ':' + seconds : hours + ':' + minutes + ':' + seconds;
}

const EnqueteTimer = ({ menage }) => {
  const [rippleOverflow, setRippleOverflow] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const enquete = global.realms[0].objects('enquete').filtered(`menageId == oid(${menage._id})`);
    const interval = setInterval(() => {
      setTime(msToTime(new Date() - enquete[0].beginAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [menage]);

  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 50,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        onPress={() => {
          setRippleOverflow(!rippleOverflow);
        }}
        background={TouchableNativeFeedback.Ripple('rgba(00000007)', rippleOverflow)}>
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={{}}>{time}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default EnqueteTimer;
