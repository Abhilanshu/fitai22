const Footer = () => {
    return (
        <footer className="bg-black border-t border-gray-800 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">FitAI</h3>
                        <p className="text-gray-400">
                            Empowering your fitness journey with artificial intelligence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Workouts</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Nutrition</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                            <li className="text-sm">
                                <p>123 Fitness Lane, Indiranagar</p>
                                <p>Bangalore, India</p>
                                <p>+91 98765 43210</p>
                                <p>support@fitai.in</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-gray-600 pt-8 border-t border-gray-800">
                    © {new Date().getFullYear()} FitAI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
