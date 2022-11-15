import React, { useState, useEffect } from 'react';
import styles from './modules/Clock.module.css';



function Clock() {
	const [dateState, setDateState] = useState(new Date());
	useEffect(() => {
		setInterval(() => {
			console.log('watching');
			setDateState(new Date());
		}, 30000);
	}, []);
	return (
		<div>
			
		
			<p>
			<h1 className={styles.clockData}>
				
				{dateState.toLocaleString('en-US', {
					hour: 'numeric',
					minute: 'numeric',
					hour12: false,
				})}</h1>
			</p>
		</div>
	);
}

export default Clock;
