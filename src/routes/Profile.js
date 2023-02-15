import { authService } from 'fbase';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ refreshUser, userObj }) => {
	const navigate = useNavigate();
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const onLogOutClick = () => { 
		authService.signOut();
		navigate("/");
	}
	
	/*
	자신의 데이터만 가지고 오기
	const getMyNoweets = async() => {
		const noweets = await dbService
			.collection("noweets")
			.where("creatorId", "==", userObj.uid)
			.orderBy("createAt")
			.get();
	}
	useEffect(() => {
		getMyNoweets();
	})
	*/

	const onChange = (e) => {
		const {
			target: {value},
		} = e;
		setNewDisplayName(value);
	}

	const onSubmit = async(e) => {
		e.preventDefault();
		//displayName이 변경되지 않았을 때는 클릭해도 아무효과 없게 지정
		if (userObj.displayName !== newDisplayName){
			await userObj.updateProfile({
				displayName: newDisplayName,
			})
			refreshUser();
		}
	}

	return (
		<div className="container">
			<form onSubmit={ onSubmit } className="profileForm" >
				<input 
					onChange={ onChange }
					type="text" 
					placeholder="Display name" 
					value={ newDisplayName ?? userObj.email.split('@')[0] }
					autoFocus
					className="formInput"
				/>
				<input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
			</form>
			<span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
		</div>
	)
}

export default Profile;