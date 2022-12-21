import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'i18next';

import _ from 'lodash';
import { wp } from 'src/lib/utilities';

const ThrottledNavigateButton = ({
  componentId,
  destination,
  tobBarTitleText,
  tobBarTitleColor,
  tobBarBackgroundColor,
  passProps = {},
  styles,
  children,
  disabled,
  noBackButton,
  confirm,
  confirmMessages,
  rightButtons,
}) => {
  function useThrottle(cb, delay) {
    const options = { leading: true, trailing: false }; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      _.throttle((...args) => cbRef.current(...args), delay, options),
      [],
    );
  }

  const throtleOnPress = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: destination,
        options: {
          topBar: {
            title: {
              text: tobBarTitleText,
            },
            background: {
              color: tobBarBackgroundColor,
            },
            backButton: {
              visible: !noBackButton,
            },
            rightButtons,
          },
          animations: {
            pop: {
              content: {
                x: {
                  from: 0,
                  to: wp(95),
                  duration: 200,
                  startDelay: 0,
                },
              },
            },
            push: {
              content: {
                x: {
                  from: wp(95),
                  to: 0,
                  duration: 200,
                  startDelay: 0,
                },
              },
            },
          },
        },
        passProps: {
          ...passProps,
        },
      },
    });
  }, [
    componentId,
    destination,
    noBackButton,
    passProps,
    rightButtons,
    tobBarBackgroundColor,
    tobBarTitleColor,
    tobBarTitleText,
  ]);

  const handleConfirm = useCallback(() => {
    Alert.alert(
      confirmMessages.first,
      confirmMessages.second,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () =>
            Navigation.push(componentId, {
              component: {
                name: destination,
                options: {
                  topBar: {
                    title: {
                      text: tobBarTitleText,
                      color: tobBarTitleColor,
                    },
                    background: {
                      color: tobBarBackgroundColor,
                    },
                    backButton: {
                      visible: !noBackButton,
                    },
                  },
                  animations: {
                    pop: {
                      content: {
                        x: {
                          from: 0,
                          to: wp(95),
                          duration: 200,
                          startDelay: 0,
                        },
                      },
                    },
                    push: {
                      content: {
                        x: {
                          from: wp(95),
                          to: 0,
                          duration: 200,
                          startDelay: 0,
                        },
                      },
                    },
                  },
                },
                passProps: {
                  ...passProps,
                },
              },
            }),
        },
      ],
      { cancelable: true },
    );
  }, [
    componentId,
    confirmMessages,
    destination,
    noBackButton,
    passProps,
    tobBarBackgroundColor,
    tobBarTitleColor,
    tobBarTitleText,
  ]);

  const onPress = useThrottle(throtleOnPress, 2000);
  const onPressC = useThrottle(handleConfirm, 2000);

  return (
    <TouchableOpacity style={styles} onPress={confirm ? onPressC : onPress} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default ThrottledNavigateButton;
