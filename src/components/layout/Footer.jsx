"use client";

import {
  Footer,
  FooterIcon,
} from "flowbite-react";
import { BsFacebook, BsInstagram, BsYoutube, BsWhatsapp } from "react-icons/bs";

import translations from '../../translations'

export default function AppFooter({ lang = "en" }) {
  const t = { ...translations[lang].common, ...translations[lang].contact };

  return (
    <Footer container className="bg-gradient-to-r from-[#9931CC] to-[#038EFE] text-white animate-gradient rounded-none">
      <div className="w-full max-w-7xl mx-auto py-10 px-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Columna 1 - Redes sociales */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-2">
              {lang === "es" ? "Síguenos" : "Follow us"}
            </h4>
            <p className="text-sm mb-4">
              we are not here to sell you products, we sell value through our expertise.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <FooterIcon href="#" icon={BsFacebook} className="text-white hover:text-blue-200" />
              <FooterIcon href="#" icon={BsInstagram} className="text-white hover:text-pink-200" />
              <FooterIcon href="#" icon={BsYoutube} className="text-white hover:text-red-200" />
              <FooterIcon href="#" icon={BsWhatsapp} className="text-white hover:text-green-200" />
            </div>
          </div>

          {/* Columna 2 - Contacto */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">
              {lang === "es" ? "Contáctanos" : "Contact us"}
            </h4>
            <p className="text-sm">Zona 15, Guatemala</p>
            <p className="text-sm">+502 1234-5678</p>
            <p className="text-sm">info@emamusic.com</p>
          </div>

          {/* Columna 3 - Navegación */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">
              {lang === "es" ? "Navegación" : "Navigation"}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:underline text-white">
                  {lang === "es" ? "Nosotros" : "About us"}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline text-white">
                  {lang === "es" ? "Contacto" : "Contact"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter debajo del grid */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Subscribe to get latest updates
          </h3>
          <form className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your Email address"
              className="flex-1 rounded-l-lg px-4 py-2 bg-white text-gray-800 placeholder-purple-500 border-0 focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="rounded-r-lg bg-blue-400 hover:bg-blue-500 px-6 py-2 text-white font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </Footer>
  );
}
