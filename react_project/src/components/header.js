import React from 'react';
import styles from './modules/Header.module.css';

class Header extends React.Component {
    constructor(props) {
        super(props)      
        this.state = {

        };
    }

    render() {
        return (
            <div className={styles.background}> 
                <header className={styles.brand}>
                    Polar
                </header>
            </div>
        )
    }
}

export default Header;