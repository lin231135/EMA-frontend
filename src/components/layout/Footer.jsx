import './Footer.css';
import { Logo } from './Logo';

export default function Footer({ lang = "es" }) {
  const currentYear = new Date().getFullYear();
  
  const footerData = {
    es: {
      contact: "Contacto",
      quickLinks: "Enlaces Rápidos",
      followUs: "Síguenos",
      newsletter: "Boletín",
      newsletterText: "Suscríbete para recibir noticias y promociones",
      subscribe: "Suscribirse",
      emailPlaceholder: "Tu correo electrónico",
      phone: "Teléfono",
      email: "Correo",
      address: "Dirección",
      hours: "Horarios",
      home: "Inicio",
      about: "Nosotros",
      services: "Servicios",
      contact: "Contacto",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      copyright: "Todos los derechos reservados.",
      madeWith: "Hecho con",
      description: "Escuela de música dedicada a formar artistas con excelencia y pasión por la música."
    },
    en: {
      contact: "Contact",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      newsletter: "Newsletter",
      newsletterText: "Subscribe to receive news and promotions",
      subscribe: "Subscribe",
      emailPlaceholder: "Your email address",
      phone: "Phone",
      email: "Email",
      address: "Address",
      hours: "Hours",
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "All rights reserved.",
      madeWith: "Made with",
      description: "Music school dedicated to training artists with excellence and passion for music."
    }
  };

  const t = footerData[lang];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <Logo variant='white' size='h-15'/>
          </div>
          <p className="footer-description">
            {t.description}
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <span>📘</span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span>📷</span>
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <span>📺</span>
            </a>
            <a href="#" className="social-link" aria-label="WhatsApp">
              <span>📱</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>{t.quickLinks}</h4>
          <ul className="footer-links">
            <li><a href="/">{t.home}</a></li>
            <li><a href="/about">{t.about}</a></li>
            <li><a href="#services">{t.services}</a></li>
            <li><a href="#contact">{t.contact}</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t.contact}</h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+502 1234-5678</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>info@emamusic.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Zona 15, Guatemala</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>{t.newsletter}</h4>
          <p className="newsletter-text">{t.newsletterText}</p>
          <form className="newsletter-form">
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                {t.subscribe}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-bottom-left">
            <p>
              © {currentYear} EMA Music School. {t.copyright}
            </p>
          </div>
          <div className="footer-bottom-right">
            <a href="#privacy" className="footer-legal-link">{t.privacy}</a>
            <span className="footer-divider">|</span>
            <a href="#terms" className="footer-legal-link">{t.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
