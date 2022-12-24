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
} from 'react-native';
import { Colors } from 'src/styles';

const licenseKey = Platform.select({
  // iOS license key for applicationID: com.microblink.sample
  ios: 'sRwAAAEVY29tLm1pY3JvYmxpbmsuc2FtcGxl1BIcP4FpSuS/38KlOx6IMzWbmaGEGiaL7eNSyKVwZjeUMW3Ax8aKh+quw2aZ4K4wKk+HtsAqjaGiGJSKWfeqZ/hXXpX3Kd7PRq/86AF3lpVWOZPN6FzUB6FVm7jYfVBUag4hYYxvq70616zMDQyaAItml02PvEL8OKbKbBxEYmVzBVpq3ew4JoHyRAaOJQfc9WEKrP4HYd8q4s15+HB/KO24IUVBabZggHMj2hOyAEM7p9dWpA/Q+n6C49w35xLfmcJrjSP0qE25bdTUMMEwhu6xiYmYdtMrqJkwCEIjzEQ04bEB3XWskZl3+AD5kUQH8qyhuEELR/mvbmvwxMBpwpM=',
  // android license key for applicationID: com.microblink.sample
  android:
    'sRwAAAAUY29tLmlidC5yYXZlbC5pbnNhdmVPbdVYuJeAHMeHyBCkSnMeQZZC/u6ti32CI43SzEpkzXslgZCKJyGwiEuMAYIi/HIU7DRx8oPR7WKZ2XyY3kzfSXdQV1nCnU3CwJYzc5Qv042ChPwu+267bgBoB7LaQlaCt9mJcL2OBKccTSlfYXrVPaudkg9bSe1O9JMUe2Iu53MunsIR+aXGpcUaLapTcpz/W/ugN2YPW5qp1LAsethcpY72oXHbNvuYJsKLzw==',
});

var renderIf = function (condition, content) {
  if (condition) {
    return content;
  }
  return null;
};

function buildResult(result, key) {
  if (result && result != -1) {
    return key + ': ' + result + '\n';
  }
  return '';
}

function buildDateResult(result, key) {
  if (result) {
    return key + ': ' + result.day + '.' + result.month + '.' + result.year + '.' + '\n';
  }
  return '';
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
    try {
      // to scan any machine readable travel document (passports, visas and IDs with
      // machine readable zone), use MrtdRecognizer
      // var mrtdRecognizer = new BlinkIDReactNative.MrtdRecognizer();
      // mrtdRecognizer.returnFullDocumentImage = true;

      // var mrtdSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(mrtdRecognizer);

      // BlinkIDCombinedRecognizer automatically classifies different document types and scans the data from
      // the supported document
      var blinkIdCombinedRecognizer = new BlinkIDReactNative.BlinkIdCombinedRecognizer();
      blinkIdCombinedRecognizer.returnFullDocumentImage = false;
      blinkIdCombinedRecognizer.returnFaceImage = true;
      blinkIdCombinedRecognizer.skipUnsupportedBack = true;
      const OverLaySetring = new BlinkIDReactNative.BlinkIdOverlaySettings();
      OverLaySetring.firstSideInstructionsText = this.props.t('scan_front');
      OverLaySetring.backSideInstructionsText = this.props.t('scan_back');
      OverLaySetring.errorDocumentTooCloseToEdge = this.props.t('error_edge');
      OverLaySetring.errorMoveFarther = this.props.t('error_move');
      OverLaySetring.errorMoveCloser = this.props.t('error_close');
      OverLaySetring.retryButtonText = this.props.t('retry');
      OverLaySetring.flipInstructions = this.props.t('flip');
      const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
        OverLaySetring,
        new BlinkIDReactNative.RecognizerCollection([
          blinkIdCombinedRecognizer /*, mrtdSuccessFrameGrabber*/,
        ]),
        licenseKey,
      );

      if (scanningResults) {
        console.log('scanningResults', scanningResults);
        let newState = {
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

        for (let i = 0; i < scanningResults.length; ++i) {
          if (scanningResults[i].mrzResult?.sanitizedOpt1) {
            this.state.person.NNI = scanningResults[i].mrzResult.sanitizedOpt1;
            this.state.person.firstName = scanningResults[i].mrzResult.secondaryId;
            this.state.person.lastName = scanningResults[i].mrzResult.primaryId;
            this.state.person.sex = scanningResults[i].mrzResult.gender === 'M' ? 'male' : 'female';
          }
          let localState = this.handleResult(scanningResults[i]);
          newState.showFrontImageDocument =
            newState.showFrontImageDocument || localState.showFrontImageDocument;
          if (localState.showFrontImageDocument) {
            newState.resultFrontImageDocument = localState.resultFrontImageDocument;
          }
          newState.showBackImageDocument =
            newState.showBackImageDocument || localState.showBackImageDocument;
          if (localState.showBackImageDocument) {
            newState.resultBackImageDocument = localState.resultBackImageDocument;
          }
          newState.showImageFace = newState.showImageFace || localState.showImageFace;
          if (localState.resultImageFace) {
            newState.resultImageFace = localState.resultImageFace;
          }
          newState.results += localState.results;
          newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
          if (localState.successFrame) {
            newState.successFrame = localState.successFrame;
          }
        }
        newState.results += '\n';
        this.setState(newState);
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

  handleResult(result) {
    var localState = {
      showFrontImageDocument: false,
      resultFrontImageDocument: '',
      showBackImageDocument: false,
      resultBackImageDocument: '',
      resultImageFace: '',
      results: '',
      showSuccessFrame: false,
      successFrame: '',
    };

    if (result instanceof BlinkIDReactNative.BlinkIdCombinedRecognizerResult) {
      let blinkIdResult = result;
      this.state.person.birthDate = `${blinkIdResult.dateOfBirth.day < 10 ? '0' : ''}${
        blinkIdResult.dateOfBirth.day
      }/${blinkIdResult.dateOfBirth.month < 10 ? '0' : ''}${blinkIdResult.dateOfBirth.month}/${
        blinkIdResult.dateOfBirth.year
      }`;
      console.log('blinkIdResult.dateOfBirth', blinkIdResult.dateOfBirth);

      let resultString =
        buildResult(blinkIdResult.firstName, this.props.t('first_name')) +
        buildResult(blinkIdResult.lastName, 'Last name') +
        buildResult(blinkIdResult.fullName, 'Full name') +
        buildResult(blinkIdResult.localizedName, 'Localized name') +
        buildResult(blinkIdResult.additionalNameInformation, 'Additional name info') +
        buildResult(blinkIdResult.address, 'Address') +
        buildResult(blinkIdResult.additionalAddressInformation, 'Additional address info') +
        buildResult(blinkIdResult.documentNumber, 'Document number') +
        buildResult(blinkIdResult.documentAdditionalNumber, 'Additional document number') +
        buildResult(blinkIdResult.sex, 'Sex') +
        buildResult(blinkIdResult.issuingAuthority, 'Issuing authority') +
        buildResult(blinkIdResult.nationality, 'Nationality') +
        buildDateResult(blinkIdResult.dateOfBirth, 'Date of birth') +
        buildResult(blinkIdResult.age, 'Age') +
        buildDateResult(blinkIdResult.dateOfIssue, 'Date of issue') +
        buildDateResult(blinkIdResult.dateOfExpiry, 'Date of expiry') +
        buildResult(blinkIdResult.dateOfExpiryPermanent, 'Date of expiry permanent') +
        buildResult(blinkIdResult.expired, 'Expired') +
        buildResult(blinkIdResult.maritalStatus, 'Martial status') +
        buildResult(blinkIdResult.personalIdNumber, 'Personal id number') +
        buildResult(blinkIdResult.profession, 'Profession') +
        buildResult(blinkIdResult.race, 'Race') +
        buildResult(blinkIdResult.religion, 'Religion') +
        buildResult(blinkIdResult.residentialStatus, 'Residential status') +
        buildResult(blinkIdResult.processingStatus, 'Processing status') +
        buildResult(blinkIdResult.recognitionMode, 'Recognition mode');
      let dataMatchDetailedInfo = blinkIdResult.dataMatchDetailedInfo;
      resultString +=
        buildResult(dataMatchDetailedInfo.dataMatchResult, 'Data match result') +
        buildResult(dataMatchDetailedInfo.dateOfExpiry, 'dateOfExpiry') +
        buildResult(dataMatchDetailedInfo.dateOfBirth, 'dateOfBirth') +
        buildResult(dataMatchDetailedInfo.documentNumber, 'documentNumber');

      let licenceInfo = blinkIdResult.driverLicenseDetailedInfo;
      if (licenceInfo) {
        var vehicleClassesInfoString = '';
        if (licenceInfo.vehicleClassesInfo) {
          for (let i = 0; i < licenceInfo.vehicleClassesInfo.length; i++) {
            vehicleClassesInfoString +=
              buildResult(licenceInfo.vehicleClassesInfo[i].vehicleClass, 'Vehicle class') +
              buildResult(licenceInfo.vehicleClassesInfo[i].licenceType, 'License type') +
              buildDateResult(licenceInfo.vehicleClassesInfo[i].effectiveDate, 'Effective date') +
              buildDateResult(licenceInfo.vehicleClassesInfo[i].expiryDate, 'Expiry date');
          }
        }
        resultString +=
          buildResult(licenceInfo.restrictions, 'Restrictions') +
          buildResult(licenceInfo.endorsements, 'Endorsements') +
          buildResult(licenceInfo.vehicleClass, 'Vehicle class') +
          buildResult(licenceInfo.conditions, 'Conditions') +
          vehicleClassesInfoString;
      }

      // there are other fields to extract
      localState.results += resultString;

      // Document image is returned as Base64 encoded JPEG
      if (blinkIdResult.fullDocumentFrontImage) {
        localState.showFrontImageDocument = true;
        localState.resultFrontImageDocument =
          'data:image/jpg;base64,' + blinkIdResult.fullDocumentFrontImage;
      }
      if (blinkIdResult.fullDocumentBackImage) {
        localState.showBackImageDocument = true;
        localState.resultBackImageDocument =
          'data:image/jpg;base64,' + blinkIdResult.fullDocumentBackImage;
      }
      // Face image is returned as Base64 encoded JPEG
      if (blinkIdResult.faceImage) {
        localState.showImageFace = true;
        localState.resultImageFace = 'data:image/jpg;base64,' + blinkIdResult.faceImage;
        this.state.person.faceImage = 'data:image/jpg;base64,' + blinkIdResult.faceImage;
      }
    }
    return localState;
  }

  render() {
    let displayFrontImageDocument = this.state.resultFrontImageDocument;
    let displayBackImageDocument = this.state.resultBackImageDocument;
    let displayImageFace = this.state.resultImageFace;
    let displaySuccessFrame = this.state.successFrame;
    let displayFields = this.state.results;
    console.log('resultImageFace', this.state.resultImageFace);
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{this.props.text ? this.props.text : this.props.t('scan')}</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.scan.bind(this)}
            title={this.props.t('scan')}
            color={Colors.secondary}
          />
        </View>
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
              }}>
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
                  });
                }}>
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
