import Noweet from 'components/Noweet';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react';

//App → AppRouter → Home 으로 전달받은 userObj로 "누가 로그인 했는지" 확인 가능해졌음
const Home = ({ userObj }) => { 
	const [noweet, setNoweet] = useState("");
	const [noweets, setNoweets] = useState([]);
	const [attachment, setAttachment] = useState();

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

	//Create : 글 작성 후 firebase에 제출 및 저장 기능
	const onSubmit = async (e) => {
		// submit 버튼 클릭하면 firebase의 collections에 데이터가 추가됨
		e.preventDefault();
		let attachmentUrl = ""; //사진이 없을때도 게시글 등록할 수 있어야 하니까 (noweetObj참고)

		//사진이 있을때만 아래 코드 실행해서 사진 업로드 진행함
		if(attachment !== ""){ 
			//uuidv4() : 랜덤문자열을 생성해줌
			const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, "data_url");
			attachmentUrl = await response.ref.getDownloadURL();
		}

		//사진없을때는 그냥 attachmentUrl="" 인 상태로 빈 string만 업로드
		const noweetObj = {
			text:noweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl
		}
		await dbService.collection("noweets").add(noweetObj);
		//데이터 올리고 noweet은 초기화 시켜주기
		setNoweet("");
	}
	//Create : 작성 글 임시저장 기능
	const onChange = (e) => {
		// setNoweet(e.target.value)  : 똑같이 동작하는데 왜 이렇게 안쓰지? value 말고 여러 값 저장하려면 es6 문법이 편해서 그런가
		const {
			target: { value }
		} = e;
		setNoweet(value);
	}
	//파일입출력 : 파일업로드 함수
	const onFileChange = (e) => {
		const {
			target: {files},
		} = e;
		const theFile = files[0];
		
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: {result},
			} = finishedEvent;
			setAttachment(result);
		}
		reader.readAsDataURL(theFile);
	}
	//파일입출력 : 파일 선택 삭제 함수
	const onClearAttachment = () => { setAttachment(null) }
	
	return(
		<div>
			{/* Create */}
			<form onSubmit={ onSubmit }>
				<input 
					value={ noweet } 
					onChange={ onChange } 
					type="text" 
					placeholder="'What's on your mind?" 
					maxLength={120} 
				/>
				<input type="file" accept="image/*" onChange={ onFileChange } />
				<input type="submit" value="Noweet" />

				{/* 파일이 선택되면(파일이 존재하면) 미리보기, clear 버튼 노출 */}
				{ attachment && (
					<div>
						<img src={ attachment } width="50px" height="50px" />
						<button onClick={ onClearAttachment }>Clear</button>
					</div>
				) }
			</form>
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