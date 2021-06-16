import { put } from '@redux-saga/core/effects';

export const ACTION_RESET_SUCCESS = 'ACTION_RESET_SUCCESS';

export const actionStart = (actionName) => `${actionName}_START`;
export const actionEnd = (actionName) => `${actionName}_END`;
export const actionOK = (actionName) => `${actionName}_OK`;
export const actionError = (actionName) => `${actionName}_ERROR`;

export function* Call(action, run) {
  try {
    console.info('start', action);
    yield put({ type: actionStart(action.type), payload: action.payload });
    const payload = yield run();
    console.info('success', action.type, payload);
    yield put({ type: actionOK(action.type), payload });
    console.info('end', action.type);
    yield put({ type: actionEnd(action.type), payload: action.payload });
  } catch (error) {
    console.error('error', action, error);
    yield put({ type: actionError(action.type), payload: error });
    console.info('end', action.type);
    yield put({ type: actionEnd(action.type), payload: action.payload });
  }
}

export const actionResetSucces = () => ({
  type: ACTION_RESET_SUCCESS,
  payload: {},
});
