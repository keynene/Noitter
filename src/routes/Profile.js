import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ refreshUser, userObj }) => {
	const navigate = useNavigate();
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const onLogOutClick = () => { 
		authService.signOut();
		navigate("/");
	}
	
	//자신의 데이터만 가지고 오기
	const getMyNoweets = async() => {
		const noweets = await dbService
			.collection("noweets")
			.where("creatorId", "==", userObj.uid)
			.orderBy("createAt")
			.get();
	}
	useEffect(() => {
		getMyNoweets();
	}, [])

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
		<>
			<form onSubmit={ onSubmit } >
				<input 
					onChange={ onChange }
					type="text" 
					placeholder="Display name" 
					value={ newDisplayName ?? userObj.email.split('@')[0] }
					// newDisplayName ?? userObj.email.split('@')[0]
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button	onClick={ onLogOutClick }>Log Out</button>
		</>
	)
}

export default Profile;