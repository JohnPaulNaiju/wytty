import React from 'react';
import { logo } from '../../assets';

export default function Header() {

    return (

        <div data-animation="default" className="navbar w-nav" data-easing2="ease" data-easing="ease" data-collapse="medium" role="banner" data-no-scroll="1" data-duration="500" data-doc-height="1">
            <div className="container nav-container">
                <div className="nav-menu-container">
                    <a href="/" aria-current="page" className="brand w-nav-brand w--current">
                        <img src={logo} loading="eager" alt="community app" className="brand-image" />
                    </a>
                    <nav role="navigation" className="nav-menu w-nav-menu">
                        <div className="nav-link">
                            <div className="nav-link-active-holder">
                                <a href="/#experince" className="nav-link-holder w-inline-block">
                                    <div className="nav-link-text-holder">
                                        <div className="nav-link-text">Engage</div>
                                    </div>
                                </a>
                                <a href="/#experince" className="cricle-active-holder w-inline-block">
                                    <div/>
                                </a>
                            </div>
                            <div className="nav-link-active-holder">
                                <a href="/#integration" className="nav-link-holder w-inline-block">
                                    <div className="nav-link-text-holder">
                                        <div className="nav-link-text">Explore</div>
                                    </div>
                                </a>
                                <a href="/#integration" className="cricle-active-holder w-inline-block">
                                    <div/>
                                </a>
                            </div>
                            <div className="nav-link-active-holder">
                                <a href="/#features" className="nav-link-holder w-inline-block">
                                    <div className="nav-link-text-holder">
                                        <div className="nav-link-text">Features</div>
                                    </div>
                                </a>
                                <a href="/#features" className="cricle-active-holder w-inline-block">
                                    <div/>
                                </a>
                            </div>
                            <div className="nav-link-active-holder">
                                <a href="/#download" className="nav-link-holder w-inline-block">
                                    <div className="nav-link-text-holder">
                                        <div className="nav-link-text">Download</div>
                                    </div>
                                </a>
                                <a href="/#download" className="cricle-active-holder w-inline-block">
                                    <div/>
                                </a>
                            </div>
                        </div>
                        {/* <div className="nav-button-holder">
                            <a href="/#sign-up" className="button navbar-button w-button">Sign up</a>
                        </div> */}
                    </nav>
                    <div className="menu-button w-nav-button">
                        <div className="center-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}
