import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";


const NoweetFactory = ({ userObj }) => {
	const [noweet, setNoweet] = useState("");
	const [attachment, setAttachment] = useState("");

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


	return (
			// Create 
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
	)
}
export default NoweetFactory;