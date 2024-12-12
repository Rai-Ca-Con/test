import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import authReducer from './reducers/auth';
import currentUserReducer from './reducers/currentUser';
import questionsReducer from './reducers/questions.js';
import userReducer from './reducers/users';
import { ToastContainer } from 'react-toastify';  // Thêm ToastContainer ở đây
import { thunk } from 'redux-thunk'; // Import redux-thunk
import commentsReducer from './reducers/comments'; // Import commentsReducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    currentUser: currentUserReducer,
    questionReducer: questionsReducer,
    userReducer: userReducer,
    comments: commentsReducer, 
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Thêm redux-thunk vào middleware
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
      <ToastContainer autoClose={3000} />
    </React.StrictMode>
  </Provider>
);
