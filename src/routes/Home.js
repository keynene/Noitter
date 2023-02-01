import React, { useState } from 'react';

const Home =  () => {
	const [noweet, setNoweet] = useState("");
	const onSubmit = (e) => {
		e.preventDefault();
	}
	const onChange = (e) => {
		// setNoweet(e.target.value)  : 똑같이 동작하는데 왜 이렇게 안쓰지? value 말고 여러 값 저장하려면 es6 문법이 편해서 그런가
		const {
			target: { value }
		} = e;
		setNoweet(value);
		console.log(noweet)
	}
	return(
		<div>
			<form onSubmit={ onSubmit }>
				<input value={ noweet } onChange={ onChange } type="text" placeholder="'What's on your mind?" maxLength={120} />
				<input type="submit" value="Noweet" />
			</form>
		</div>
	)
}

export default Home;