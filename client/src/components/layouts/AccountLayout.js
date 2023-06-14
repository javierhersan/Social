import { Outlet } from "react-router-dom";
import AccountNavbar from "../navbar/AccountNavbar";
import Footer from "../footer/Footer";
import Loading from "../loading/Loading";
import Protection from "../protection/Protection";
import Chats from "../chat/minimized-screen/Chats";

function AccountLayout() {
    return (
        <>
            <AccountNavbar/>
            <Loading>
                <Protection>
                    <Outlet/>
                    <Chats></Chats>
                </Protection>
            </Loading>
            <Footer/>
        </>
    );
}

export default AccountLayout;

