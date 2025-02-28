import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRoutes from './Routes/Routes';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster position="top-right" />
    </Provider>
  );
};

export default App;
