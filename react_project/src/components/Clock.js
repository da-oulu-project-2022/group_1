import React, { useState, useEffect } from 'react';
import styles from './modules/Clock.module.css';

//This function is for real-time clock for pages
function Clock(props) {
	const [dateState, setDateState] = useState(new Date());
	useEffect(() => {
		setInterval(() => {
			console.log('watching');
			setDateState(new Date());
		}, 30000);
	}, []);
	return (
		<>
			<div className={ props.styles }>
				{dateState.toLocaleString('en-US', {
					hour: 'numeric',
					minute: 'numeric',
					hour12: false,
				})}
			</div>
		</>
	);
}

export default Clock;
