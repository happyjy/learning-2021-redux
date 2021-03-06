import { applyMiddleware, createStore } from 'redux';
import reducer from './modules/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import history from '../history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from '@redux-saga/core';
import rootSaga from './modules/rootSaga';

function middleware1(store) {
  return (next) => {
    console.log('middleware1', 1);
    return (action) => {
      console.log('middleware1', 2);
      const returnValue = next(action);
      console.log('middleware1', 3);
      return returnValue;
    };
  };
}

function middleware2(store) {
  return (next) => {
    console.log('middleware2', 1);
    return (action) => {
      console.log('middleware2', 2);
      const returnValue = next(action);
      console.log('middleware2', 3);
      return returnValue;
    };
  };
}

const myLogger = (store) => (next) => (action) => {
  console.log(action); // 액션을 출력
  const result = next(action); // 다음 미들웨어(또는 리듀서) 에게 액션 전달
  console.log('\t', store.getState());
  return result; // 여기서 바환하는 값은 dispatch(action)의 결과물
};

// * thunk.withExtraArgument({ history })
//  * thunk extra Arguments 설정
//  * action Creator에서 확인

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(
      middleware1,
      middleware2,
      myLogger,
      thunk.withExtraArgument({ history }),
      promise,
      routerMiddleware(history),
      sagaMiddleware,
    ),
  ),
);

sagaMiddleware.run(rootSaga);

export default store;
