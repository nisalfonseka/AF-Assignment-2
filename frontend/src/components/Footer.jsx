import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                <span className="text-sm">🌎</span>
              </div>
              <span className="text-gray-300">World</span>
              <span className="text-white">Explorer</span>
            </h3>
            <p className="text-gray-400">
              Embark on a digital journey through countries and cultures from around the globe. 
              Discover fascinating details about nations, explore diverse regions, and expand your world knowledge!
            </p>
          </div>
          
          <div className="md:mx-auto">
            <h3 className="text-xl font-bold mb-4 text-white relative">
              Quick Links
              <div className="h-0.5 w-12 bg-white absolute -bottom-1 left-0 rounded-full"></div>
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">→</span> About
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">→</span> Favorites
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-white relative">
              Stay Connected
              <div className="h-0.5 w-12 bg-white absolute -bottom-1 left-0 rounded-full"></div>
            </h3>
            <p className="text-gray-400 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <a 
              href="mailto:hello@worldexplorer.com" 
              className="inline-block px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors shadow-md"
            >
              Contact Us
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <div className="flex justify-center space-x-5 mb-4">
            {/* Social media icons */}
            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.615 11.615 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S15.523 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} WorldExplorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;