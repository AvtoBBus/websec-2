
import { Link } from "react-router-dom";

import HomeIcon from "../../shared/assets/homeIcon.svg"
import StationIcon from "../../shared/assets/busStation.svg"
import BetweenStationIcon from "../../shared/assets/betweenStationsIcon.svg"

import "./style.css"
import { useReducer } from "react";

const Navigation = () => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    window.addEventListener('resize', forceUpdate);

    return <>
        <nav className="navigation">
            {window.innerWidth <= 1024 ?
                <>
                    <Link className="navigation__nav-item rubik-600" to="/" style={{ backgroundImage: `url(${HomeIcon})`, backgroundSize: '38px' }} />
                    <Link className="navigation__nav-item rubik-600" to="/stops" style={{ backgroundImage: `url(${StationIcon})` }} />
                    <Link className="navigation__nav-item rubik-600" to="/between-stops" style={{ backgroundImage: `url(${BetweenStationIcon})` }} />
                </>
                : <>
                    <Link className="navigation__nav-item rubik-600" to="/"> Home</Link>
                    <Link className="navigation__nav-item rubik-600" to="/stops">Stops</Link>
                    <Link className="navigation__nav-item rubik-600" to="/between-stops">Between stops</Link>
                </>}

        </nav>
    </>
}

export default Navigation;