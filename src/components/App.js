/* eslint-disable */ //warning 제거
import React, { useState } from 'react';
/* 기존경로 변경 (jsconfig.json에서 src로 기본경로 지정해놓음) */
import AppRouter from 'components/Router';
import { authService } from 'fbase';


function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  return (
    <div>
      <AppRouter isLoggedIn={ isLoggedIn }/>
      <footer>&copy; {new Date().getFullYear()} Twitter_clone</footer>
    </div>

  );
}

export default App;
