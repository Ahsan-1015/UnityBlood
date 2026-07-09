import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <div>
      <footer className="bg-teal-950 text-white pt-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex gap-3 items-center mb-4">
              <img src={logo} className="h-10" alt="" />
              <h3 className="text-xl font-extrabold">UnityBlood</h3>
            </div>

            <p className="text-sm leading-7 text-teal-50/80">
              HopePluse is a platform dedicated to connecting blood donors with
              those in need. Our mission is to save lives by making blood
              donation simple, efficient, and impactful.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-extrabold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2 text-teal-50/80">
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <Link to={"/regi"} href="/donate" className="hover:text-white">
                  Become a Donor
                </Link>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  to={"/registration"}
                  href="/faq"
                  className="hover:text-white"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div>
            <h3 className="text-xl font-extrabold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sm mb-4 leading-7 text-teal-50/80">
              Stay updated with the latest news and events from UnityBlood.
            </p>
            <form className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md text-slate-800 outline-none focus:ring-2 focus:ring-red-300"
                required
              />
              <button type="submit" className="rounded-md bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700">
                Subscribe
              </button>
            </form>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-teal-50/80 hover:text-white" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-teal-50/80 hover:text-white" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                href="#"
                className="text-teal-50/80 hover:text-white"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-slate-950 mt-8 py-4 text-center">
          <p className="text-sm text-slate-300">
            © {new Date().getFullYear()} UnityBlood. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
