import React, { Component } from 'react';
import * as BlinkIDReactNative from 'blinkid-react-native';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import i18next from 'i18next';
import { Colors } from 'src/styles';

const licenseKey = Platform.select({
  // iOS license key for applicationID: com.microblink.sample
  ios: 'sRwAAAELUkFWRUxJTlNBVkU8h2CKaU91oU7gbVtU+ejVL6MXAhdKNqEYwVu/T8AKSjaZNyrTVenGUuYH0YAJPB8XJpi+r/PeNWpCKVj2UJyFWZIvpJNyLXi+F+aXe4JfGkG/bMcwuOrNs4HWuMSlZrRgQlftx74tuobP6GjCE/oEAvvTksqsl+VZRJT9qHEgZkKSvFq16ka7OR24FPLoE9lscnGR44mrmW/kehu30z+NFHpXsgjJZCTLT3zQ01E=',
  // android license key for applicationID: com.microblink.sample
  android:
    'sRwAAAAUY29tLmlidC5yYXZlbC5pbnNhdmVPbdVYuJeAHMeHyBCkel+11lpsolUiU9yCM9tXJl7/TzLXOei6S74SLjBpuBiHluIX34TXe3ntqV/ZUlBaRzZtpb1PIoLMKLuBnDkMAeE8nhfMtHxopmzlKISiT2tA/swyp6GZ3RzODMyGNNz/KVXWrS/ZZO3H1rKSrXInfOmUg+W8IteR1blycGkRZSstDh5VS+b0LEQSbpIz7XOCe/YRbY3edlNdQ59Ve+z7aJQ=',
});

const renderIf = function (condition, content) {
  if (condition) {
    return content;
  }
  return null;
};

function buildResult(result, key) {
  if (result && result != -1) {
    return `${key}: ${result}\n`;
  }
  return "";
}

function buildDateResult(result, key) {
  if (result) {
    return `${key}: ${result.day}.${result.month}.${result.year}.`
      + `\n`;
  }
  return "";
}

export default class Sample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFrontImageDocument: false,
      resultFrontImageDocument: '',
      showBackImageDocument: false,
      resultBackImageDocument: '',
      showImageFace: false,
      resultImageFace: '',
      showSuccessFrame: false,
      successFrame: '',
      results: '',
      licenseKeyErrorMessage: '',
      person: {
        firstName: '',
        lastName: '',
        NNI: '',
        birthDate: '',
        sex: '',
      },
    };
  }

  async scan() {
    console.log('this.state', this.state);
    try {
      // to scan any machine readable travel document (passports, visas and IDs with
      // machine readable zone), use MrtdRecognizer
      // var mrtdRecognizer = new BlinkIDReactNative.MrtdRecognizer();
      // mrtdRecognizer.returnFullDocumentImage = true;

      // var mrtdSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(mrtdRecognizer);

      // BlinkIDCombinedRecognizer automatically classifies different document types and scans the data from
      // the supported document
      const blinkIdCombinedRecognizer = new BlinkIDReactNative.BlinkIdCombinedRecognizer();
      blinkIdCombinedRecognizer.returnFullDocumentImage = false;
      blinkIdCombinedRecognizer.returnFaceImage = true;

      const { language } = i18next;
      const OverLaySetring = new BlinkIDReactNative.BlinkIdOverlaySettings();
      OverLaySetring.firstSideInstructionsText = this.props.t('scan_front');
      OverLaySetring.backSideInstructionsText = this.props.t('scan_back');
      OverLaySetring.errorDocumentTooCloseToEdge = this.props.t('error_edge');
      OverLaySetring.errorMoveFarther = this.props.t('error_move');
      OverLaySetring.errorMoveCloser = this.props.t('error_close');
      OverLaySetring.retryButtonText = this.props.t('retry');
      OverLaySetring.flipInstructions = this.props.t('flip');
      OverLaySetring.language = language;
      OverLaySetring.country = "MR";

      const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
        OverLaySetring,
        new BlinkIDReactNative.RecognizerCollection([blinkIdCombinedRecognizer]),
        licenseKey,
      );

      if (scanningResults) {
        const newState = {
          showFrontImageDocument: false,
          resultFrontImageDocument: '',
          showBackImageDocument: false,
          resultBackImageDocument: '',
          showImageFace: false,
          resultImageFace: '',
          results: '',
          showSuccessFrame: false,
          successFrame: '',
        };

        console.log('scanningResults.length', scanningResults.length);
        let result;

        if (scanningResults.length > 0) {
          result = scanningResults[0];
        }

        if (result?.mrzResult?.sanitizedOpt1) {
          this.state.person.NNI = result.mrzResult.sanitizedOpt1;
          this.state.person.firstName = result.mrzResult.secondaryId;
          this.state.person.lastName = result.mrzResult.primaryId;
          this.state.person.documentNumber = result.mrzResult.documentNumber;
          this.state.person.nationality = result.mrzResult.nationality;
          this.state.person.image = `data:image/jpg;base64,${result.faceImage}`;
          this.state.person.birthDate = `${result.dateOfBirth.day < 10 ? '0' : ''}${result.dateOfBirth.day
            }/${result.dateOfBirth.month < 10 ? '0' : ''}${result.dateOfBirth.month}/${result.dateOfBirth.year
            }`;
          this.state.person.sex = result.mrzResult.gender === 'M' ? 'male' : 'female';
        }
        if (result.faceImage) {
          newState.showImageFace = true;
          newState.resultImageFace = `data:image/jpg;base64,${result.faceImage}`;
        }

        if (!this.state.person.firstName || Number(this.state.person.NNI) % 97 !== 1) {
          Alert.alert(this.props.t('error'), this.props.t('scan_error'));
        } else {
          this.setState(newState);
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({
        showFrontImageDocument: false,
        resultFrontImageDocument: '',
        showBackImageDocument: false,
        resultBackImageDocument: '',
        showImageFace: false,
        resultImageFace: '',
        results: 'Scanning has been cancelled',
        showSuccessFrame: false,
        successFrame: '',
      });
    }
  }

  render() {
    console.log('state', this.state);
    return (
      <View style={styles.container}>
        {
          !this.state.showImageFace && (
            <>
              <Text style={styles.label}>{this.props.text ? this.props.text : this.props.t('scan')}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.scan.bind(this)}
                  title={this.props.t('scan')}
                  color={Colors.secondary}
                />
              </View>
            </>
          )
        }
        <ScrollView automaticallyAdjustContentInsets={false} scrollEventThrottle={200}>
          {this.state.showImageFace && (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 10,
                alignSelf: 'center',
                padding: 10,
                marginVertical: 20,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageContainer}>
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: this.state.resultImageFace,
                    }}
                    style={styles.imageResult}
                  />
                </View>
                <View>
                  <Text>
                    {this.props.t('name')}: {this.state.person.firstName}{' '}
                    {this.state.person.lastName}
                  </Text>
                  <Text>{`${this.props.t('sex')}: ${this.props.t(this.state.person.sex)}`}</Text>
                  <Text>{`${this.props.t('born_at')}: ${this.state.person.birthDate}`}</Text>
                  <Text>{`${this.props.t('nni')}: ${this.state.person.NNI}`}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  alignSelf: 'center',
                  paddingVertical: 3,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                onPress={() => {
                  this.props.savePerson({
                    ...this.state.person,
                    image: this.state.resultImageFace,
                  });
                  this.setState({
                    person: {
                      firstName: '',
                      lastName: '',
                      NNI: '',
                      birthDate: '',
                      sex: '',
                    },
                    showImageFace: false,
                    resultImageFace: '',
                  });
                }}
              >
                <Text>
                  {this.props.confirmText ? this.props.confirmText : this.props.t('save')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  label: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    margin: 20,
  },
  results: {
    fontSize: 16,
    textAlign: 'left',
    margin: 10,
  },
  imageResult: {
    height: 100,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
