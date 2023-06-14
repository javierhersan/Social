import HomeNavbar from "../navbar/HomeNavbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";
import Loading from "../loading/Loading"

function HomeLayout() {
    return (
        <>
            <HomeNavbar/>
            <Loading>
                <Outlet/>
            </Loading>
            <Footer/>
        </>
    );
}

export default HomeLayout;

