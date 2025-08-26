"use client";

import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsFacebook, BsInstagram, BsYoutube, BsWhatsapp } from "react-icons/bs";
import { Logo } from "./Logo";

export default function AppFooter({ lang = "es" }) {
  const currentYear = new Date().getFullYear();

  const footerData = {
    es: {
      quickLinks: "Enlaces Rápidos",
      followUs: "Síguenos",
      contact: "Contacto",
      newsletter: "Boletín",
      newsletterText: "Suscríbete para recibir noticias y promociones",
      subscribe: "Suscribirse",
      emailPlaceholder: "Tu correo electrónico",
      home: "Inicio",
      about: "Nosotros",
      services: "Servicios",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      copyright: "Todos los derechos reservados.",
      description:
        "Escuela de música dedicada a formar artistas con excelencia y pasión por la música.",
    },
    en: {
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      contact: "Contact",
      newsletter: "Newsletter",
      newsletterText: "Subscribe to receive news and promotions",
      subscribe: "Subscribe",
      emailPlaceholder: "Your email address",
      home: "Home",
      about: "About",
      services: "Services",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "All rights reserved.",
      description:
        "Music school dedicated to training artists with excellence and passion for music.",
    },
  };

  const t = footerData[lang];

  return (
    <Footer container className="bg-gray-900 text-white">
      <div className="w-full">
        <div className="grid w-full justify-between gap-8 sm:flex sm:justify-between md:grid-cols-4">
          {/* Brand & Description */}
          <div className="max-w-sm">
            <FooterBrand
              href="/"
              src= ""
              alt="EMA Logo"
              name="EMA Music School"
            />
            <p className="mt-3 text-gray-400 text-sm">{t.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <FooterTitle title={t.quickLinks} />
            <FooterLinkGroup col>
              <FooterLink href="/">{t.home}</FooterLink>
              <FooterLink href="/about">{t.about}</FooterLink>
              <FooterLink href="#services">{t.services}</FooterLink>
              <FooterLink href="#contact">{t.contact}</FooterLink>
            </FooterLinkGroup>
          </div>

          {/* Contact Info */}
          <div>
            <FooterTitle title={t.contact} />
            <FooterLinkGroup col>
              <span className="text-gray-400">📞 +502 1234-5678</span>
              <span className="text-gray-400">✉️ info@emamusic.com</span>
              <span className="text-gray-400">📍 Zona 15, Guatemala</span>
            </FooterLinkGroup>
          </div>

          {/* Newsletter */}
          <div>
            <FooterTitle title={t.newsletter} />
            <p className="mb-3 text-sm text-gray-400">{t.newsletterText}</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="rounded-lg px-3 py-2 text-black"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-700"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        <FooterDivider />

        {/* Bottom section */}
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            href="/"
            by={`EMA Music School. ${t.copyright}`}
            year={currentYear}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsYoutube} />
            <FooterIcon href="#" icon={BsWhatsapp} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
