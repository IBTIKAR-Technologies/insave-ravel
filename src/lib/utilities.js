import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { requestMultiple, request, RESULTS } from 'react-native-permissions';
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-toast-message';
import { Keyboard } from 'react-native';
import { Colors } from 'src/styles';

export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;

export const requestPermissions = async (setGranted, perms) => {
  requestMultiple(perms)
    .then(statuses => {
      if (statuses[perms[0]] === RESULTS.GRANTED) {
        setGranted(true);
      }
      perms.forEach(elem => {
        switch (statuses[elem]) {
          case RESULTS.UNAVAILABLE:
            Toast.show({
              type: 'error',
              text1: 'This feature is not available (on this device / in this context)',
              position: 'bottom',
            });
            break;
          case RESULTS.DENIED:
            request(elem).then(() => {
              requestPermissions(setGranted, perms);
            });
            break;
          case RESULTS.LIMITED:
            setGranted(true);
            break;
          case RESULTS.GRANTED:
            setGranted(true);
            break;
          case RESULTS.BLOCKED:
            Toast.show({
              type: 'error',
              text1: 'The permission is denied and not requestable anymore',
              position: 'bottom',
            });
            break;
          default:
            setGranted(true);
        }
      });
    })
    .catch(error => {
      Toast.show({
        type: 'error',
        text1: error.message,
        position: 'bottom',
      });
    });
};

export function navigate(id, name, title, passProps = {}) {
  Navigation.push(id, {
    component: {
      name,
      options: {
        topBar: {
          title: {
            text: title,
            color: '#000',
            fontSize: wp(4),
          },
          background: {
            color: Colors.primary,
          },
          backButton: {
            color: '#000',
            fontSize: wp(4),
          },
        },
      },
      passProps: {
        ...passProps,
      },
    },
  });
}

export const getKeyboardFromType = type => {
  const types = {
    text: 'default',
    number: 'number-pad',
    phone: 'phone-pad',
  };
  return types[type] || 'default';
};

export const dissmissKeyboard = () => Keyboard.dismiss();

export const getDate = (date, hours = true) => {
  let str =
    date.getDate().toString().padStart(2, '0') +
    '/' +
    parseInt(date.getMonth() + 1)
      .toString()
      .padStart(2, '0') +
    '/' +
    date.getFullYear();
  if (hours) {
    str +=
      ' ' +
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0');
  }
  return str;
};

const asin = Math.asin;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;

// equatorial mean radius of Earth (in meters)
const R = 6378137;

function squared(x) {
  return x * x;
}
function toRad(x) {
  return (x * PI) / 180.0;
}
function hav(x) {
  return squared(sin(x / 2));
}

export function getDistance(a, b) {
  const aLat = toRad(Array.isArray(a) ? a[1] : a.latitude || a.lat);
  const bLat = toRad(Array.isArray(b) ? b[1] : b.latitude || b.lat);
  const aLng = toRad(Array.isArray(a) ? a[0] : a.longitude || a.lng || a.lon);
  const bLng = toRad(Array.isArray(b) ? b[0] : b.longitude || b.lng || b.lon);

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
  return 2 * R * asin(sqrt(ht));
}
