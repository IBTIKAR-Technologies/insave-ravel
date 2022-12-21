import { Text, View } from 'react-native';
import React from 'react';
import mapper from './Mapper';

const ItemRenderer = props => {
  const { item, values, setFieldValue } = props;

  if (item.notEqu && item.to && item.depends && item.valueIsgte) {
    if (values[item.notEqu] !== item.to && new Date().getFullYear() - parseInt(values[item.depends], 10) >=
      item.valueIsgte) {
      const Comp = mapper[item.type];
      return Comp ? (
        <Comp key={`${item.name}_${item.order}`} {...item} />
      ) : null;
    }
    if (setFieldValue && values[item.name]) {
      setFieldValue(item.name, '')
    }
    return <View />
  }
  if (item.depends && item.valueIsgte) {
    if (
      new Date().getFullYear() - parseInt(values[item.depends], 10) >=
      item.valueIsgte
    ) {
      const Comp = mapper[item.type];
      return Comp ? (
        <Comp key={`${item.name}_${item.order}`} {...item} />
      )
        : <View />;
    }
    if (setFieldValue && values[item.name]) {
      setFieldValue(item.name, '')
    }
    return <View />
  }
  if (
    item.isPositif &&
    !Number.isNaN(values[item.depends]) &&
    parseInt(values[item.depends], 10) <= 0
  ) {
    const Comp = mapper[item.type];
    return Comp ? (
      <Comp key={`${item.name}_${item.order}`} {...item} />
    )
      : <View />;
  }
  if (
    !item.depends ||
    item.answer === values[item.depends] ||
    (item.notAnswer && item.notAnswer !== values[item.depends]) ||
    (Array.isArray(item.answer) && item.answer.find(an => an === values[item.depends]))
  ) {
    const Comp = mapper[item.type];
    return Comp ? (
      <Comp key={`${item.name}_${item.order}`} {...item} />
    ) : <View />;
  }
  if (setFieldValue && values[item.name]) {
    setFieldValue(item.name, '');
  };
  return <View />;
};

export default ItemRenderer;
