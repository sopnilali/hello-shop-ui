import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black mt-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Hello Shop</h3>
            <p className="text-gray-800">
              Your one-stop destination for all your shopping needs. Quality products, great prices, and excellent service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black hover:text-orange-600 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-black hover:text-orange-600 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-black hover:text-orange-600 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-black hover:text-orange-600 transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-black hover:text-orange-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/product" className="text-black hover:text-orange-600 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-black hover:text-orange-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black hover:text-orange-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-black hover:text-orange-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-black hover:text-orange-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-black hover:text-orange-600 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-black hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-800 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded text-black border border-gray-700 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 bg-white">
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-black text-sm">
              © {new Date().getFullYear()} Hello Shop. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 flex-wrap">
              <Link href="/terms" className="text-black-400 hover:text-orange-600 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-black-400 hover:text-orange-600 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-black-400 hover:text-orange-600 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 