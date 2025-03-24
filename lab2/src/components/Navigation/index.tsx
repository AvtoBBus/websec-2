
import { Link } from "react-router-dom";
import "./style.css"

const Navigation = () => {
    return <>
        <nav className="navigation">
            <Link className="navigation__nav-item rubik-600" to="/">Home</Link>
            <Link className="navigation__nav-item rubik-600" to="/stops">Stops</Link>
            <Link className="navigation__nav-item rubik-600" to="/before-stops">Before stops</Link>
        </nav>
    </>
}

export default Navigation;