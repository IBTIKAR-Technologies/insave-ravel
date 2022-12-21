import React from 'react';
import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';
import FieldArray from './FieldArray';
import TilteField from './TilteField';
import Subtitle from './Subtitle';
import FieldArray2 from './FieldArray2';

const InputNum = (props) => <Input keyboardType="numeric" {...props} />;

const mapper = {
  text: Input,
  num: InputNum,
  select: Select,
  date: DatePicker,
  fieldArray: FieldArray,
  fieldArray2: FieldArray2,
  title: TilteField,
  subtitle: Subtitle,
};
export default mapper;
