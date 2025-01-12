import React from 'react';
import { FaXTwitter, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Card, CardContent } from './ui/card';

const Footer = () => {
    const socialLinkClasses = "text-[#646cff] hover:text-[#535bf2] transition-colors duration-300";

    return (
        <div className="px-8 pb-8">
            <Card className="max-w-4xl mx-auto bg-white">
                <CardContent className="py-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex justify-center items-center space-x-6">
                            <a
                                href="https://twitter.com/phoe6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialLinkClasses}
                                aria-label="Twitter"
                            >
                                <FaXTwitter className="w-6 h-6"/>
                            </a>
                            <a
                                href="https://github.com/orsenthil/options-quiz/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialLinkClasses}
                                aria-label="GitHub"
                            >
                                <FaGithub className="w-6 h-6"/>
                            </a>
                            <a
                                href="https://linkedin.com/in/orsenthil"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialLinkClasses}
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin className="w-6 h-6"/>
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-6 space-x-6 p-4">
                        <p className="text-xs text-gray-500">
                            This application helps users learn options trading. No statement on this website should be
                            construed as a recommendation to purchase or sell securities or as investment advice. Before
                            buying or selling options, you must receive a copy of 'Characteristics and Risks of
                            Standardized Options' from your broker or The Options Clearing Corporation.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Footer;