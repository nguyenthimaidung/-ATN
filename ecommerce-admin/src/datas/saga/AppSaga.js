import { all } from 'redux-saga/effects';
import { watchAdminAction } from './AdminSaga';

export function* AppSaga() {
  yield all([watchAdminAction()]);
}
