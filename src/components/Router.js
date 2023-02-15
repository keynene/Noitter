import React from "react";
import { Routes, Route } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';


const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
	return (
		<div>
			{ isLoggedIn && <Navigation userObj={ userObj } /> }
			<div style={{
				maxWidth: 890,
				width: "100%",
				margin: "0 auto",
				marginTop: 80,
				display: "flex",
				justifyContent: "center",
			}}>
				<Routes>
					{/* init == true 이면 이제 로그인 되었는지 확인 */}
					{/* App의 useEffect를 통해 확인했던 isLoggedin이 true이면 Home을 아니면 Auth를 실행 */}
					{ isLoggedIn ? (
						<>
							<Route path='Noitter/' element={ <Home userObj={ userObj } /> } />
							<Route path='Noitter/profile' element={ <Profile userObj={ userObj } refreshUser={ refreshUser } /> } />
						</> 
					) : (
						<Route path='Noitter/' element={ <Auth /> } />
					)}
				</Routes>
			</div>
		</div>
	)
}

export default AppRouter;