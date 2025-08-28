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

// importa las traducciones
import { es } from "../../translations/es";
import { en } from "../../translations/en";

export default function AppFooter({ lang = "en" }) {
  const currentYear = new Date().getFullYear();

  // selector de idioma
  const translations = { es, en };
  const t = translations[lang];

  return (
    <Footer container className="bg-gradient-to-r from-[#9931CC] to-[#038EFE] text-white animate-gradient rounded-none">
      <div className="w-full">
        <div className="grid w-full justify-between gap-8 sm:flex sm:justify-between md:grid-cols-4">
          {/* Brand & Description */}
          <div className="max-w-sm">
            <Logo variant="black" size = "h-16"/>
            <p className="mt-3 text-white text-sm">{t.footerDescription}</p>
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
              <span className="text-white">📞 +502 1234-5678</span>
              <span className="text-white">✉️ info@emamusic.com</span>
              <span className="text-white">📍 Zona 15, Guatemala</span>
            </FooterLinkGroup>
          </div>

          {/* Newsletter */}
          <div>
            <FooterTitle title={t.newsletter} />
            <p className="mb-3 text-sm text-white">{t.newsletterText}</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="rounded-lg px-3 py-2 text-white"
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
            by={`EMA. ${t.copyright}`}
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
