import React from 'react';
import './Style.css';
import { ai, blender, cinema, flutter, football, fourwheeler, gdev, react, bg7 } from '../../assets';

export default function Section1() {

    return (

        <div data-w-id="bbb1681c-62a0-7375-a529-1c7bec5a4a0e" className="section">
            <div className="container no-paddings">
                <div className="hero-section">
                    <div className="hero-section-text-holder">
                        <div className="hero-section-sticky">
                            <div className="hero-sticky-holder">
                                <div className="hero-text-holder">
                                    <div className="hero-text-wrapper _01">
                                        <div className="hero-text">Community</div>
                                        <div className="hero-text-blur">Community</div>
                                    </div>
                                    <div className="hero-text-wrapper _02">
                                        <div className="hero-text _02">Reimagined</div>
                                        <div className="hero-text-blur">Reimagined</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="iphone-holder">
                            <img src="https://assets.website-files.com/63aee5793ca698452efe7f60/63aefb47917c0cfa0943fc97_iPhone%2014%20Pro%20%E2%80%93%20Space%20Black.webp" loading="eager" sizes="(max-width: 767px) 196.6796875px, 295.015625px" srcSet="https://assets.website-files.com/63aee5793ca698452efe7f60/63aefb47917c0cfa0943fc97_iPhone%2014%20Pro%20%E2%80%93%20Space%20Black-p-500.webp 500w, https://assets.website-files.com/63aee5793ca698452efe7f60/63aefb47917c0cfa0943fc97_iPhone%2014%20Pro%20%E2%80%93%20Space%20Black.webp 800w" alt="community app" className="iphone-image"/>
                            <div className="iphone-screen">
                                <img loading="eager" alt="community app" sizes="(max-width: 479px) 80vw, 267.875px" className="iphone-screen-image" src={bg7}/>
                            </div>
                            <div className="iphone-drop-shadow"></div>
                        </div>
                    </div>
                    <div className="hero-section-paragraph-holder">
                        <div className="hero-paragraph-holder">
                            <div className="hero-text">Tribe</div>
                        </div>
                        <div className="hero-paragraph-holder">
                            <p>Seamlessly connect, engage, and collaborate with kindred spirits through tribes. Embark on comprehensive interactions that foster growth for everyone involved.</p>
                        </div>
                        {/* <div className="from-wra-er">
                            <div className="form-block w-form">
                                <form id="email-form" name="email-form" data-name="Email Form" method="get"
                                    data-wf-page-id="63aee5793ca698e95ffe7f77"
                                    data-wf-element-id="5ea415ca-a921-34a0-1f6c-2725653f3203">
                                    <div className="from-holder">
                                        <input type="email" className="text-field-form w-input" maxLength="256" name="email-2"
                                        data-name="Email 2" placeholder="Enter Your Email" id="email-2" required="" />
                                        <input type="submit" value="Start Free Trial" data-wait="Please wait..."className="button from w-button" />
                                    </div>
                                </form>
                                <div className="success-message w-form-done">
                                    <div>Thank you! Your submission has been received!</div>
                                </div>
                                <div className="error-message w-form-fail">
                                    <div>
                                        Oops! Something went wrong while submitting the form.
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="logo-grid-holder">
                    <div className="w-layout-grid logo-grid">
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dcd8-5ffe7f77" className="logo-small-container">
                            <img src={cinema} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dcda-5ffe7f77" className="logo-small-container">
                            <img src={fourwheeler} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dcdc-5ffe7f77" className="logo-small-container">
                            <img src={gdev} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dcde-5ffe7f77" className="logo-small-container">
                            <img src={blender} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dce0-5ffe7f77" className="logo-small-container">
                            <img src={flutter} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dce2-5ffe7f77" className="logo-small-container">
                            <img src={react} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dce4-5ffe7f77" className="logo-small-container">
                            <img src={football} loading="eager" alt="community app" className="logo-small" />
                        </div>
                        <div id="w-node-f078fdf9-afcd-dd23-e056-d7d58c77dce6-5ffe7f77" className="logo-small-container">
                            <img src={ai} loading="eager" alt="community app" className="logo-small" />
                        </div>
                    </div>
                    <div className="fade-in-move-on-scroll">
                        <p>Top tribes in our platform</p>
                    </div>
                </div>
            </div>
        </div>

    );

}