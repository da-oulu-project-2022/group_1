import styles from '../components/modules/menu.module.css'
import Clock from '../components/clock'

export function Menu() {
    return(
    <div className={ styles.background }>
        <div className={ styles.container }>
            <div className={ styles.logo }>POLAR LOGO</div>
            <Clock />
            <div className={ styles.device_container }>
                <div className={ styles.device }>SENSOR</div>
                <div className={ styles.device }>SENSOR</div>
            </div>
            <div className={ styles.select }>Choose Your Device</div>
            <button className={ styles.button }>Connect Device</button>
        </div>
    </div>
    ) 
}