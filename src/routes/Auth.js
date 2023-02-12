import React from "react";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";

const Auth = () => {
/**  firebase 이용하여 소셜 로그인 기능 구현 */
const onSocialClick = async (e) => {
  const {
    target: { name }
  } = e;

  let provider;
  if (name === "google"){
    provider = new firebaseInstance.auth.GoogleAuthProvider();
  } else if (name === "github"){
    provider = new firebaseInstance.auth.GithubAuthProvider();
  }
  await authService.signInWithPopup(provider);
};

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={ onSocialClick } name="google">Continue with Google</button>
        <button onClick={ onSocialClick } name="github">Continue with Github</button>
      </div>
    </div>
  );
};
export default Auth;