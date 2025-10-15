"use client";

import {
  Footer,
  FooterIcon,
} from "flowbite-react";
import { BsFacebook, BsInstagram, BsYoutube, BsWhatsapp } from "react-icons/bs";

import translations from '../../translations'
import { useAuth } from "../../contexts/AuthContext";

export default function AppFooter() {
  const { lang } = useAuth();
  const t = { ...translations[lang].common, ...translations[lang].contact };

  return (
    <Footer container className="bg-gradient-to-r from-[#9931CC] to-[#038EFE] text-white animate-gradient rounded-none">
      <div className="w-full max-w-7xl mx-auto py-10 px-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Columna 1 - Redes sociales */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-2">
              {t.followUs}
            </h4>
            <p className="text-sm mb-4">{t.footerFollowUsText}</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <FooterIcon
                href="#"
                icon={BsFacebook}
                className="text-white hover:text-blue-200"
              />
              <FooterIcon
                href="#"
                icon={BsInstagram}
                className="text-white hover:text-pink-200"
              />
              <FooterIcon
                href="#"
                icon={BsWhatsapp}
                className="text-white hover:text-green-200"
              />
            </div>
          </div>

          {/* Columna 2 - Contacto */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">
              {t.contactUs}
            </h4>
            <p className="text-sm">{t.addressLine}</p>
            <p className="text-sm">{t.phoneLine}</p>
            <p className="text-sm">{t.emailLine}</p>
          </div>

          {/* Columna 3 - Navegación */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">
              {t.navigation}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:underline text-white">
                  {t.about}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline text-white">
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        
      </div>
    </Footer>
  );
}
