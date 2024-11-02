import React from 'react';
import './Style.css';
import { Link } from 'react-router-dom';

export default function Section6() {

    return (

        <div className="footer">
            <div className="container">
                <div className="footer-social-media-container">
                    <div className="social-media-content">
                        <div className="fade-in-on-scroll">
                            <div>Follow us</div>
                        </div>
                        <a href="https://www.instagram.com/wyttyofficial/" className="social-media-link w-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0)">
                                    <path d="M16.98 0.000203233C17.9168 -0.0321436 18.8505 0.126742 19.7239 0.467164C20.5973 0.807585 21.3922 1.3224 22.06 1.9802C22.7038 2.64801 23.2071 3.43809 23.5404 4.30376C23.8736 5.16942 24.0299 6.0931 24 7.0202V16.9802C24 19.0602 23.32 20.8502 22.02 22.1102C20.6409 23.3834 18.8159 24.0624 16.94 24.0002H7.06C5.19976 24.0578 3.39201 23.3786 2.03 22.1102C1.35485 21.434 0.826185 20.6259 0.476935 19.7365C0.127686 18.847 -0.0346623 17.8952 4.17558e-06 16.9402V7.0202C4.17558e-06 2.8002 2.8 0.000203233 7.02 0.000203233H16.98ZM17.03 2.2302H7.06C5.61 2.2302 4.36 2.6602 3.53 3.4802C3.0865 3.95259 2.74279 4.50955 2.51943 5.11779C2.29606 5.72603 2.19763 6.37306 2.23 7.0202V16.9402C2.23 18.4402 2.66 19.6402 3.53 20.5202C4.50032 21.3784 5.76584 21.8265 7.06 21.7702H16.94C18.2342 21.8265 19.4997 21.3784 20.47 20.5202C20.9359 20.0593 21.3009 19.5067 21.5419 18.8973C21.7829 18.2879 21.8946 17.6351 21.87 16.9802V7.0202C21.9023 5.73287 21.4366 4.48273 20.57 3.5302C20.0976 3.0867 19.5407 2.74299 18.9324 2.51962C18.3242 2.29626 17.6772 2.19782 17.03 2.2302ZM12 5.7602C15.39 5.7602 18.2 8.5602 18.2 11.9602C18.2 13.6045 17.5468 15.1815 16.3841 16.3443C15.2213 17.507 13.6443 18.1602 12 18.1602C10.3557 18.1602 8.77867 17.507 7.61594 16.3443C6.45322 15.1815 5.8 13.6045 5.8 11.9602C5.8 10.3159 6.45322 8.73887 7.61594 7.57614C8.77867 6.41342 10.3557 5.7602 12 5.7602ZM12 7.9802C10.9487 7.98546 9.94198 8.40541 9.1986 9.1488C8.45521 9.89218 8.03526 10.8989 8.03 11.9502C8.03526 13.0015 8.45521 14.0082 9.1986 14.7516C9.94198 15.495 10.9487 15.9149 12 15.9202C13.0513 15.9149 14.058 15.495 14.8014 14.7516C15.5448 14.0082 15.9647 13.0015 15.97 11.9502C15.9647 10.8989 15.5448 9.89218 14.8014 9.1488C14.058 8.40541 13.0513 7.98546 12 7.9802ZM18.44 4.2102C18.8113 4.2102 19.1674 4.3577 19.43 4.62025C19.6925 4.8828 19.84 5.2389 19.84 5.6102C19.84 5.98151 19.6925 6.3376 19.43 6.60015C19.1674 6.8627 18.8113 7.0102 18.44 7.0102C18.0687 7.0102 17.7126 6.8627 17.4501 6.60015C17.1875 6.3376 17.04 5.98151 17.04 5.6102C17.04 5.2389 17.1875 4.8828 17.4501 4.62025C17.7126 4.3577 18.0687 4.2102 18.44 4.2102Z" fill="black"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                        <a href="https://twitter.com/wyttyInc" className="social-media-link w-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0)">
                                    <path d="M24 4.37C23.1034 4.78044 22.1488 5.05027 21.17 5.17C22.2083 4.52999 22.9793 3.53517 23.34 2.37C22.39 2.95 21.34 3.37 20.21 3.59C19.754 3.0886 19.1981 2.68813 18.5781 2.4143C17.9582 2.14048 17.2878 1.99936 16.61 2C15.856 2.00771 15.1136 2.18618 14.4385 2.52201C13.7634 2.85784 13.1732 3.3423 12.7122 3.93898C12.2512 4.53566 11.9315 5.22905 11.7769 5.96706C11.6224 6.70507 11.6371 7.4685 11.82 8.2C9.84996 8.09245 7.92553 7.56584 6.17521 6.65533C4.4249 5.74482 2.88897 4.47137 1.67 2.92C1.03409 4.03248 0.838449 5.34298 1.12171 6.59268C1.40498 7.84238 2.14656 8.94044 3.2 9.67C2.41565 9.64141 1.65014 9.42172 0.97 9.03V9.1C0.97 11.54 2.67 13.58 4.92 14.05C4.19621 14.2484 3.43619 14.2758 2.7 14.13C3.33 16.14 5.15 17.6 7.3 17.64C6.2865 18.4622 5.11782 19.0718 3.86363 19.4326C2.60945 19.7934 1.29545 19.898 0 19.74C2.24048 21.2176 4.86613 22.0036 7.55 22C16.61 22 21.55 14.3 21.55 7.63V6.98C22.51 6.27 23.34 5.38 24 4.37Z" fill="black"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                        <a href="https://in.linkedin.com/company/wytty-platforms" className="social-media-link w-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22.23 0H1.77C0.8 0 0 0.77 0 1.72V22.28C0 23.23 0.8 24 1.77 24H22.23C23.21 24 24 23.23 24 22.28V1.72C24 0.77 23.2 0 22.23 0ZM7.27 20.1H3.65V9.24H7.27V20.1ZM5.47 7.76H5.44C4.22 7.76 3.44 6.93 3.44 5.89C3.44 4.83 4.24 4.02 5.49 4.02C6.73 4.02 7.49 4.82 7.51 5.89C7.51 6.93 6.73 7.76 5.46 7.76H5.47ZM20.34 20.1H16.71V14.3C16.71 12.85 16.19 11.85 14.88 11.85C13.88 11.85 13.28 12.52 13.01 13.17C12.91 13.4 12.9 13.72 12.9 14.05V20.1H9.28C9.28 20.1 9.33 10.28 9.28 9.26H12.91V10.8C13.2377 10.2313 13.7146 9.76299 14.2892 9.44573C14.8638 9.12848 15.5141 8.97434 16.17 9C18.56 9 20.35 10.56 20.35 13.89V20.1H20.34Z" fill="black"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="footer-flex-container">
                    <div className="footer-brand-content">
                        <a href="/" data-w-id="a91eae88-2cd2-a6a2-03b1-a73f4b02afe9" aria-current="page" className="footer-logo-link w-inline-block w--current">
                            <div id='wytty-title'>Wytty</div>
                        </a>
                        <ul className="footer-list w-list-unstyled">
                            <li className="footer-list-item">
                                <Link to="/community-guidelines" id='community-guidelines-bt' className="link w-inline-block">
                                    <div>Community Guidelines</div>
                                </Link>
                            </li>
                            <li className="footer-list-item">
                                <Link to="/privacy-policy" id='privacy-policy-bt' className="link w-inline-block">
                                    <div>Privacy Policy</div>
                                </Link>
                            </li>
                            <li className="footer-list-item">
                                <Link to="/terms" id='terms' className="link w-inline-block">
                                    <div>Terms and Conditions</div>
                                </Link>
                            </li>
                            <li className="footer-list-item">
                                <Link to="/delete-account" id='delete-account-bt' className="link w-inline-block">
                                    <div>Account deletion</div>
                                </Link>
                            </li>
                            <li className="footer-list-item">
                                <a href="mailto:wyttyfeedbacks@gmail.com?subject=Wytty Support" className="link w-inline-block">
                                    <div>Contact us</div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div data-w-id="a91eae88-2cd2-a6a2-03b1-a73f4b02b005" className="footer-copyright">
                        <div>Wytty Platforms ©2024</div>
                    </div>
                </div>
            </div>
        </div>

    );

}