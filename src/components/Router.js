import { Routes, Route } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Navigation from 'components/Navigation';
import Profile from 'routes/Profile';


const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
	return (
		<div
		>
			{ isLoggedIn && <Navigation userObj={ userObj } /> }
			<Routes style={{
				maxWidth: 890,
				width: "100%",
				margin: "0 auto",
				marginTop: 80,
				display: "flex",
				justifyContent: "center",
			}}>
				{/* init == true 이면 이제 로그인 되었는지 확인 */}
				{/* App의 useEffect를 통해 확인했던 isLoggedin이 true이면 Home을 아니면 Auth를 실행 */}
				{ isLoggedIn ? (
					<>
						console.log('good')
						<Route path='/' element={ <Home userObj={ userObj } /> } />
						<Route path='/profile' element={ <Profile userObj={ userObj } refreshUser={ refreshUser } /> } />
					</> 
				) : (
					<Route path='/' element={ <Auth /> } />
				)}
			</Routes>
		</div>
	)
}

export default AppRouter;