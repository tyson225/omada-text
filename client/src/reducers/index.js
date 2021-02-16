import { combineReducers } from 'redux';
import users from './users.reducer';
import posts from './posts.reducers';
import auth from './auth.reducer';

export default combineReducers({
  users,
  posts,
  auth,
});
