import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./footer.scss";

export default function Footer() {
  return (
    <div className="container footer py-5">
      <div className="row m-0 py-2">
        <div className="col-lg-4 py-2">
          <Link to="/" className="navbar-brand">
            <img src="/radix-logo.png" alt="" height="45" />
            <span className="color-dgreen ms-2 sp1">Radix</span>
            <span className="color-green sp2">Training</span>
          </Link>
          <p className="pt-2 address color-dback">
            B/H Nirma University, Ekyarth, Near Vandemataram Fabula, Malabar
            County Rd, Chharodi, Gujarat 382481
          </p>
          <div className="social-links">
            <a href="https://www.facebook.com/radixweb" target="_blank">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/radixweb/" target="_blank">
              <FaInstagram />
            </a>
            <a href="https://twitter.com/radixweb" target="_blank">
              <FaTwitter />
            </a>
            <a href="https://www.youtube.com/user/Radixweb2000" target="_blank">
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className="col-lg-8 row">
          <div className="col-lg-4 py-2 aboutus">
            <h5 className="color-dgreen py-2">About us</h5>
            <ul>
              <li>
                <a href="https://radixweb.com/our-awards" target="_blank">
                  Awards
                </a>
              </li>
              <li>
                <a href="https://radixweb.com/partners" target="_blank">
                  Partnership
                </a>
              </li>
              <li>
                <a
                  href="https://radixweb.com/our-infrastructure"
                  target="_blank"
                >
                  Our Infrastructure
                </a>
              </li>
              <li>
                <a href="https://radixweb.com/our-culture" target="_blank">
                  Our Culture
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 py-2 ps-lg-4 quicklinks">
            <h5 className="color-dgreen py-2">Quick Links</h5>
            <ul>
              <li>
                <a href="https://radixweb.com/services" target="_blank">
                  Services
                </a>
              </li>
              <li>
                <a href="https://radixweb.com/solutions" target="_blank">
                  Solutions
                </a>
              </li>
              <li>
                <a href="https://radixweb.com/industries" target="_blank">
                  Industries
                </a>
              </li>
              <li>
                <a href="https://radixweb.com/insights" target="_blank">
                  Insights
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 py-2 contactus">
            <h5 className="color-dgreen py-2">Contact</h5>
            <ul>
              <li>biz@radixweb.in</li>
              <li>resumes@radixweb.com</li>
              <li>Sales +1 646 801 6885</li>
              <li>Careers +91-79-35200685</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
