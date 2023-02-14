import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NoweetFactory = ({ userObj }) => {
	const [noweet, setNoweet] = useState("");
	const [attachment, setAttachment] = useState("");

	//Create : 글 작성 후 firebase에 제출 및 저장 기능
	const onSubmit = async (e) => {
		if (noweet === "") {
      return;
    }

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
		setAttachment("");
	}

	//Create : 작성 글 임시저장 기능
	const onChange = (e) => {
		// setNoweet(e.target.value)  : 똑같이 동작하는데 왜 이렇게 안쓰지? value 말고 여러 값 저장하려면 es6 문법이 편해서 그런가
		const {
			target: { value },
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
	const onClearAttachment = () => { setAttachment("") };


	return (
		// Create 
		<form onSubmit={ onSubmit } className="factoryForm">
			<div className="factoryInput__container">
				<input 
					value={ noweet } 
					onChange={ onChange } 
					type="text" 
					placeholder="'What's on your mind?" 
					maxLength={120} 
					className="factoryInput__input"
				/>
				<input type="submit" value="&rarr;" className="factoryInput__arrow" />
			</div>
			<label htmlFor="attach-file" className="factoryInput__label">
				<span>Add photos</span>
				<FontAwesomeIcon icon={faPlus} />
			</label>

			<input 
				type="file" 
				accept="image/*" 
				onChange={ onFileChange } 
				id="attach-file"
				style={{
					opacity: 0,
				}}
			/>

			{/* 파일이 선택되면(파일이 존재하면) 미리보기, clear 버튼 노출 */}
			{ attachment && (
				<div className="factoryForm__attachment">
					<img
						src={ attachment }
						style={{
							backgroundImage: attachment,
						}}
						alt="attachment"
					/>
					<div className="factoryForm__clear" onClick={onClearAttachment}>
						<span>Remove</span>
						<FontAwesomeIcon icon={faTimes} />
					</div>
				</div>
			)}
		</form>
	)
}
export default NoweetFactory;
