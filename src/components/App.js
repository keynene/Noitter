/* eslint-disable */ //warning 제거
import React, { useEffect, useState } from 'react';
/* 기존경로 변경 (jsconfig.json에서 src로 기본경로 지정해놓음) */
import AppRouter from 'components/Router';
import { authService } from 'fbase';


function App() {
  
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    //누가 Create Account를 클릭하거나, Login을 하거나 일단 "변화가 있으면" 실행
    authService.onAuthStateChanged((user) => { 
      if(user){
        //user == true이면 우리유저니까 로그인
        setIsLoggedIn(true);
        /*
          authService가 변경될 때 user값을 userObj에 넣기
          setUserObj(user) ↓ 아래와 같이 변경된 이유 : updateProfile 때문
          react가 리랜더링할지말지 결정하기에 user의 사이즈가 너무 큼
          너무 방대한 정보중 유저 이름 하나만 바뀌었다고 리랜더링 할 필요가 없다고 판단하기 때문에
          정보의 사이즈를 줄여줌. (우리가 필요한 정보만 받아오면 되니까)
        */
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
          updateProfile: (args) => (user.updateProfile(args)),
        });

      } else {
        setUserObj(null);
        setIsLoggedIn(false);
      }
      setInit(true);
     })
  }, [])
  const refreshUser = () => {
    const user = authService.currentUser;
    /*
    Navigation, Profile 컴포넌트에 userObj를 props로 전달했기 때문에 firebase와 연동이 안 되어 있었는데,
    profile을 업데이트 하려면 firebase에 저장되어있는 유저 이름을 가져와야 하기 때문에
    userObj를 authServie.currentUser로 즉, firebase와 연동되게끔 수정하는 과정임
    */
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      updateProfile: (args) => (user.updateProfile(args)),
    });
  }

  return (
    <div>
      {/*  useEffect를 통해 init(Create Account나 Login 즉 로그인 시도한 흔적이 있으면 실행)을 확인 */}
      {/*  init이 true이면 AppRouter실행 (Router.js에서 확인) */}
      { init ? 
        <AppRouter 
          refreshUser={ refreshUser } 
          isLoggedIn={ isLoggedIn } 
          // isLoggedIn={ Boolean(userObj) } 
          userObj={ userObj }/>
        : "Initializing..." 
      }
      <footer>&copy; {new Date().getFullYear()} Noitter</footer>
    </div>

  );
}

export default App;
