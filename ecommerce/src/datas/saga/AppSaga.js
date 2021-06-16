import { all } from 'redux-saga/effects';
import { watchUserAction } from './UserSaga';
import { watchSysAction } from './SysSaga';

export function* AppSaga() {
  yield all([watchUserAction(), watchSysAction()]);
}
