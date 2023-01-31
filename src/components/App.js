/* eslint-disable */ //warning 제거
import React, { useEffect, useState } from 'react';
/* 기존경로 변경 (jsconfig.json에서 src로 기본경로 지정해놓음) */
import AppRouter from 'components/Router';
import { authService } from 'fbase';


function App() {
  
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    //누가 Create Account를 클릭하거나, Login을 하거나 일단 "변화가 있으면" 실행
    authService.onAuthStateChanged((user) => { 
      if(user){
        //user == true이면 우리유저니까 로그인
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
     })

  }, [])

  return (
    <div>
      {/*  useEffect를 통해 init(Create Account나 Login 즉 로그인 시도한 흔적이 있으면 실행)을 확인 */}
      {/*  init이 true이면 AppRouter실행 (Router.js에서 확인) */}
      { init ? <AppRouter isLoggedIn={ isLoggedIn }/> : "Initializing..." }
      <footer>&copy; {new Date().getFullYear()} Noitter</footer>
    </div>

  );
}

export default App;
