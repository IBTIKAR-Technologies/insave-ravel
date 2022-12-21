import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FieldArray as FormikFieldArray } from 'formik';
import { Colors } from 'src/styles';

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

const FieldArray2 = (props) => {
  console.log('props fieldArray', props);

  return (
    <FormikFieldArray
      name={props.name}
      render={(arrayHelpers) => {
        console.log('props', props);
        console.log('values[name]', props.values[props.name]);
        return (
          <View style={styles.itemBlock}>
            <Text style={styles.questTitle}>{`${props.order}) ${props.title}`}</Text>
            {props.fields.map((field) => {
              const Component = mapper[field.type];
              return <Component key={field.name} {...field} name={`${field.name}`} />;
            })}
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
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default memo(FieldArray2);
