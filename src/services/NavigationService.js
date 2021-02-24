import { CommonActions } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';

let _container; // eslint-disable-line

const setContainer = (container) => {
  _container = container;
};

const reset = (routeName, params) => {
  _container.dispatch(
    CommonActions.reset({
      index: 0,
      actions: [
        CommonActions.navigate({
          name: routeName,
          params,
        }),
      ],
    }),
  );
};

const navigate = (routeName, params) => {
  _container.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    }),
  );
};

export default {
  setContainer,
  navigate,
  reset,
};
