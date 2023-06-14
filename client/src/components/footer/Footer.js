const Footer = () => {
    return (
        <div className="bg-dark fixed-bottom" style={{height:"200px"}}>
            <div className="container">
                <footer className="py-3 my-4 footer">
                    <style type="text/css">
                        {`
                            .footer a { text-decoration: none !important; color: #757575 !important;}
                            .footer a:hover {
                                color: white !important;
                            }
                        `}
                    </style>
                    <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                        <li className="nav-item"><a href="/" className="nav-link px-2 link">Home</a></li>
                        <li className="nav-item"><span className="nav-link px-2 text-muted">Features</span></li>
                        <li className="nav-item"><span className="nav-link px-2 text-muted">Pricing</span></li>
                        <li className="nav-item"><span className="nav-link px-2 text-muted">FAQs</span></li>
                        <li className="nav-item"><a href="/about" className="nav-link px-2 link">About</a></li>
                    </ul>
                    <p className="text-center text-light">© 2023 Company, Inc</p>
                </footer>
            </div>
        </div>
    );
};

export default Footer;
