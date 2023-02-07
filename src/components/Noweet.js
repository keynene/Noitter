import { dbService } from "fbase";
import React, { useState } from "react";

const Noweet = ({ noweetObj, isOwner }) => {
	//Delete 기능 : ok가 True이면 삭제, 아니면 삭제안함
	const [editing, setEditing] = useState(false); //editing mode(수정폼)인지아닌지 확인해주는 state
	const [newNoweet, setNewNoweet] = useState(noweetObj.text); //input에 입력된 text를 업데이트 해주는 state

	const onDeleteClick = async() => {
		const ok = window.confirm("Are you sure you want to delete this noweet?");
		if(ok) {
			//es6문법 : 템플릿 리터럴(Template Literal)
			//`백틱`으로 문자열 표현 가능, ${}와 함께 사용하여 문자열 중간에 변수를 넣을 수 있음
			//기존의 "따옴표"와 +기호와 함께 쓰는 것과 동일

			//firebase(dbService)의 noweets안에 id값이 저장되어 있으므로,
			//Home에서 가져온 noweet(noweetObj)의 id값에 해당되는 dbService noweets를 .delete()를 이용하여 삭제하기
			await dbService.doc(`noweets/${noweetObj.id}`).delete();
		}
	}
	// 1. editing을 false로 선언했으니 toggleEditing은 editing을 true로 바꿔줌
	const toggleEditing = () => { setEditing((prev) => !prev) }
	// 3. edit 기능을 사용하려면 onChange가 있어야함 (없으면 수정화면으로 넘어가도 text자체가 수정이 안됨)
	const onChange = (e) => {
		const { 
			target:{value},
		} = e;
		//5. edit 버튼 클릭하면 수정폼이 뜨는데, 수정화면에서 트윗을 수정하면 NewNoweet에 반영되게 설정
		//반영(onChange)되어야 업데이트 할 수 있으니까
		setNewNoweet(value) 
	}
	// 4. onChange, onSubmit e.preventDefault() 는 한 세트임
	const onSubmit = async(e) => {
		e.preventDefault();
		//update는 delete와 같은 방식의 함수를 사용함 18줄 참고
		await dbService.doc(`noweets/${noweetObj.id}`).update({
			text: newNoweet,
		});
		//6. 수정폼에서 글 수정을 완료하면 Update Noweet버튼 클릭 시 수정화면을 나가야함
		setEditing(false);
	}

	return (
		<div>
			{ 
				//2. editing이 true면 수정하는폼 보여줌, false이면 수정/삭제 버튼 보여줌
				editing ? (
					<>
						{ isOwner && (
							<>
								<form onSubmit={ onSubmit }>
									<input 
										type="text" 
										placeholder="Edit your Noweet" 
										value={ newNoweet } 
										onChange = { onChange }
										required />
									<input type="submit" value="Update Noweet" />
								</form>
								<button onClick={ toggleEditing } >Cancel</button>
							</>)
						}
					</>
			)	: (
					<>
						<h4>{ noweetObj.text }</h4>
						{isOwner && (
							<>
								<button onClick={ onDeleteClick }>Delete Noweet</button>
								<button onClick={ toggleEditing }>Edit Noweet</button>
							</>)
						}
					</>
			)}
		</div>
	)
}


export default Noweet