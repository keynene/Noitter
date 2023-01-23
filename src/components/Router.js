import React, { useState } from 'react';
import {HashRouter as Routes, Route} from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';

export default () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	return (
		<Routes>
			{ isLoggedIn ? (
				<>
					<Route path='/'>
						<Home />
					</Route>
				</> 
			) : (
				<Route path='/'>
					<Auth />
				</Route>	
			)}
		</Routes>
	)
}