import React from "react";

const Noweet = ({ noweetObj, isOwner }) => 
	(
		<div>
			<h4>{noweetObj.text}</h4>
			{ 
				isOwner && 
					<>
						<button>Delete Noweet</button>
						<button>Edit Noweet</button>
					</>
			}
		</div>
	)


export default Noweet