import HomeNavbar from "../navbar/HomeNavbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

function HomeLayout() {
    return (
        <>
            <HomeNavbar/>
            <Outlet/>
            <Footer/>
        </>
    );
}

export default HomeLayout;

