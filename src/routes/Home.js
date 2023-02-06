import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home =  () => {
	const [noweet, setNoweet] = useState("");
	const [noweets, setNoweets] = useState([]);
	const getNoweets = async() => {
		const dbNoweets = await dbService.collection("noweets").get();
		//firestore에서 데이터 가져오는 문법 (.forEach((작명) => 작명.data()))
		dbNoweets.forEach((document) => {
			// 4. noweetObject에는 data와 id를 저장
			const noweetObject = {
				...document.data(),
				id: document.id
			};
			// 1. [새로 작성한 트윗, 그 이전 것들]
			// 2. set 값으로 함수를 넣으면 이전 값에 접근할 수 있게 해줌
			// 3. 최근값을 배열 제일 앞에 배치하고, 그 다음에 이전 트윗들을 배치하려고 사용한 것 같음
			setNoweets((prev) => [noweetObject, ...prev]);
		});
	}

	useEffect(()=>{
		//mount 될 때 dbService(firestore)의 noweets를 가지고옴
		getNoweets();

	}, [])

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
	}
	console.log(noweets);
	return(
		<div>
			<form onSubmit={ onSubmit }>
				<input value={ noweet } onChange={ onChange } type="text" placeholder="'What's on your mind?" maxLength={120} />
				<input type="submit" value="Noweet" />
			</form>
			<div>
				{noweets.map((noweet) => 
					<div key={noweet.id}>
						<h4>{noweet.noweet}</h4>
					</div>
				)}
			</div>
		</div>
	)
}

export default Home;