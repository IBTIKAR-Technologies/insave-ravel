import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FieldArray as FormikFieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/styles';
import i18n from 'src/lib/languages/i18n';
import { IconButton } from 'react-native-paper';
import Icon from '../Icon';

import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';

const InputNum = (props) => <Input keyboardType="numeric" {...props} />;

const mapper = {
  text: Input,
  num: InputNum,
  select: Select,
  date: DatePicker,
};

const FieldArray = (props) => {
  const { t } = useTranslation();

  return (
    <FormikFieldArray
      name={props.name}
      render={(arrayHelpers) => {
        return (
          <View style={styles.block}>
            <Text style={styles.title}>{`${i18n.t(props.title)} (${(props.values[props.name] || []).length
              })`}</Text>
            <View style={styles.fieldArrayBlock}>
              {(props.values[props.name] || []).length > 0 && (
                <IconButton
                  icon={() => <Icon name="plus" color={Colors.success} size={20} />}
                  size={20}
                  onPress={() => arrayHelpers.push(props.initialValues)}
                />
              )}
              {(props.values[props.name] || []).map((item, index) => (
                <View style={styles.itemBlock} key={index}>
                  {props.fields.map((field) => {
                    const Component = mapper[field.type];
                    return (
                      <Component
                        key={field.name}
                        {...field}
                        name={`${props.name}[${index}].${field.name}`}
                      />
                    );
                  })}
                  <IconButton
                    icon={() => <Icon name="minus" color={Colors.error} size={20} />}
                    size={20}
                    onPress={() => arrayHelpers.remove(index)}
                  />
                </View>
              ))}
              <IconButton
                icon={() => <Icon name="plus" color={Colors.success} size={20} />}
                size={20}
                onPress={() => arrayHelpers.push(props.initialValues)}
              />
            </View>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  fieldArrayBlock: {
    borderLeftColor: Colors.primary,
    borderLeftWidth: 2,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  itemBlock: {
    borderColor: Colors.primary,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default memo(FieldArray);
