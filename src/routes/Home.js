import { dbService } from 'fbase';
import React, { useState } from 'react';

const Home =  () => {
	const [noweet, setNoweet] = useState("");
	const onSubmit = async (e) => {
		// submit 버튼 클릭하면 firebase의 collections에 데이터가 추가됨 (이거 이용해서 트윗 올리고 보여주고 하는듯)
		e.preventDefault();
		await dbService.collection("noweets").add({
			//넣을 데이터
			noweet,
			createdAt: Date.now()
		});
		//데이터 올리고 noweet은 초기화 시켜주기
		setNoweet("");

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