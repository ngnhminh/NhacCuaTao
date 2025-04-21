import Navbar from './Navbar'
import Playbar from './Playbar'

const MainLayout = (props) => {
    return (
        <div className="block">
            <Navbar />
            <main>{props.children}</main>
            <Playbar />
        </div>
    )
}

export default MainLayout
