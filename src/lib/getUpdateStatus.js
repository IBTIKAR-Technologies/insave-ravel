import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import Text from 'src/components/Text';
import { wp } from 'src/lib/utilities';
import CodePush from 'react-native-code-push';
import { useIsConnected } from 'react-native-offline';

const UpdateStatus = () => {
  const isConnected = useIsConnected();
  const { t } = useTranslation();
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateProg, setUpdateProg] = useState(0);

  const CodePushParams = useMemo(() => ({
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME, installMode: CodePush.InstallMode.IMMEDIATE, rollbackRetryOptions: { delayInHours: 0, maxRetryAttempts: 30, updateDialog: { title: t('update'), mandatoryContinueButtonLabel: t('continue'), mandatoryUpdateMessage: t('update_ready') } },
  }), [t]);

  const syncWithCodePush = status => {
    switch (status) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("Checking for updates.");
        setUpdateStatus('update_check')
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log("Downloading package.");
        setUpdateStatus('update_download')
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        console.log("Installing update.");
        setUpdateStatus('update_install')
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        console.log("Up-to-date.");
        setUpdateStatus('update_up')
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        console.log("Update installed.");
        setUpdateStatus('update_installed')
        break;
    }
  }

  function codePushDownloadDidProgress(progress) {
    console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    setUpdateProg(parseInt((progress.receivedBytes / progress.totalBytes) * 100, 10))
  }

  useEffect(() => {
    CodePush.notifyAppReady();
    CodePush.sync(CodePushParams, syncWithCodePush, codePushDownloadDidProgress);
  }, [CodePushParams, isConnected]);

  return (
    <View style={styles.update}>
      <Text style={[styles.updateText, updateStatus === 'offline' ? styles.error : {}]}>
        {t(updateStatus)} {updateStatus === 'update_download' && ` : ${updateProg} %`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  update: {
    width: '100%',
    backgroundColor: Colors.bluish,
  },
  updateText: {
    alignSelf: 'center',
  },
  error: {
    color: Colors.error,
  },
});

export default UpdateStatus;
