import { combineReducers } from 'redux';
import { UserReducer } from './UserReducer';
import { SysReducer } from './SysReduce';

export const AppReducer = combineReducers({ UserReducer, SysReducer });
