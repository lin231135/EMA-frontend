
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

import HeroCarousel from "../ui/HeroCarousel"; // ⬅️ nuevo


export default function prueba() {
  // Ejemplo de datos para el HeroCarousel
  const t = {
    homeCarousel: {
      slides: [
        { title: "Bienvenido a EMA", description: "Descubre nuestros cursos y recitales." },
        { title: "Aprende con los mejores", description: "Profesores certificados y apasionados." },
        { title: "Únete a la comunidad", description: "Eventos, exámenes y más." },
      ],
      prev: "Anterior",
      next: "Siguiente",
      ctaPrimary: "Ver Cursos",
      ctaSecondary: "Ver Exámenes",
    },
  };

  return (
    <>
      <Navbar fluid >
        <NavbarBrand href="https://flowbite-react.com">
          <img src="/LogoColorEMA4.svg" className="mr-1 h-1 sm:h-15" alt="Ellie's Music Academy" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Ellie's Music Academy</span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <Dropdown label="Dropdown" inline>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#" active>
            Home
          </NavbarLink>
          <NavbarLink href="#">About</NavbarLink>
          <NavbarLink href="#">Services</NavbarLink>
          <NavbarLink href="#">Pricing</NavbarLink>
          <NavbarLink href="#">Contact</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <section className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="max-w-7xl mx-auto">
          <HeroCarousel
            slides={t.homeCarousel.slides}
            prevLabel={t.homeCarousel.prev}
            nextLabel={t.homeCarousel.next}
            ctaPrimary={t.homeCarousel.ctaPrimary}
            ctaSecondary={t.homeCarousel.ctaSecondary}
            onPrimary={() => console.log("Go to Courses")}
            onSecondary={() => console.log("Go to Exams")}
          />
        </div>
      </section>
    </>
  );
}
