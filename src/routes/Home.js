import Noweet from 'components/Noweet';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import NoweetFactory from 'components/NoweetFactory';

//App → AppRouter → Home 으로 전달받은 userObj로 "누가 로그인 했는지" 확인 가능해졌음
const Home = ({ userObj }) => { 
	const [noweets, setNoweets] = useState([]);

	/*
	forEach방식의 get() : 새로 생성/변경된 데이터는 새로고침해야 반영됨
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
	*/
	useEffect(()=>{
		//mount 될 때 dbService(firestore)의 noweets를 가지고옴
		/*
		napshot 방식의 get() : re-render를 줄여줌
		위의 forEach를 이용한 get방식과 동일한데 re-render를 줄여줌
		forEach가 아닌 Array를 새로 만들어서 Noweets Array에 넣어주는 방법임
		*/
		dbService.collection("noweets").onSnapshot((snapshot) => {
			const noweetArray = snapshot.docs.map((doc) => ({ 
				id:doc.id, 
				...doc.data(), 
			}));
			setNoweets(noweetArray);
		});
	}, []);


	
	return(
		<div>
			<NoweetFactory userObj={ userObj } />
			<div>
				{/* Read */}
				{ noweets.map((noweet) => 
					<Noweet 
						key={noweet.id} 
						noweetObj={noweet} 
						isOwner={noweet.creatorId === userObj.uid} 
					/>
				)}
			</div>
		</div>
	)
}

export default Home;