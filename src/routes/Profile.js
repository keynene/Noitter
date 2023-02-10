import { authService, dbService } from 'fbase';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ userObj }) => {
	const navigate = useNavigate()
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
		console.log(noweets.docs.map((doc) => ( doc.data() )))
	}
	useEffect(() => {
		getMyNoweets();
	}, [])


	return (
		<button onClick={ onLogOutClick }>Log Out</button>
	)
}

export default Profile;