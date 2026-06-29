import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  GraduationCap 
} from "lucide-react";
import { useSettings } from "../context/SettingsContext.jsx";

const Footer = () => {
  const settings = useSettings();
  const year = new Date().getFullYear();
  const social = settings.social || {};

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            <span>E</span>
            <GraduationCap />
          </div>
          <p className="footer-desc">
            {settings.tagline || "Skills That Move You Forward"}. Practical,
            affordable courses built to help you grow your career, business, and
            creative skills.
          </p>
          <div className="footer-social">
              <a href={social.facebook} target="_blank" rel="noreferrer">
                <Facebook size={16} />
              </a>
              <a href={social.instagram} target="_blank" rel="noreferrer">
                <Instagram size={16} />
              </a>
              <a href={social.twitter} target="_blank" rel="noreferrer">
                <Twitter size={16} />
              </a>
              <a href={social.youtube} target="_blank" rel="noreferrer">
                <Youtube size={16} />
              </a>
              <a href={social.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={16} />
              </a>
          </div>
        </div>

        <div>
          <div className="footer-heading">Explore</div>
          <div className="footer-links">
            <Link to="/courses">All courses</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <div className="footer-heading">Account</div>
          <div className="footer-links">
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/my-courses">My courses</Link>
          </div>
        </div>

        <div>
          <div className="footer-heading">Contact</div>

          <a
            href={`mailto:${settings.contactEmail}`}
            className="footer-contact-item"
          >
            <Mail size={16} />
            {settings.contactEmail}
          </a>

          <a
            href={`tel:${settings.contactPhone}`}
            className="footer-contact-item"
          >
            <Phone size={16} />
            {settings.contactPhone}
          </a>

          <div className="footer-contact-item">
            <MapPin size={16} />
            {settings.address}
          </div>
        </div>
      </div>

  <div className="container footer-bottom">
  <span>
    © {year} {settings.siteName}. All rights reserved.
  </span>

  <div className="footer-bottom-links">
    <Link to="/privacy-policy">Privacy</Link>
    <Link to="/terms-of-service">Terms</Link>
  </div>
</div>
    </footer>
  );
};

export default Footer;
