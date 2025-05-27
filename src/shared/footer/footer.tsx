"use client";

import { getBgColor } from '../../utils/route-matcher/route-matcher';
import { usePathname, React, Image } from "../../components/ui/index"; 

import styles from './footer.module.scss';

export default function Footer() {
const pathname = usePathname();
  const bgColor  = getBgColor(pathname); 
  return (
    <footer className={`${styles.footer}`}
      style={{ backgroundColor: bgColor }}>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Coluna 1 - Serviços */}
        <div className="space-y-3 vantagem-description">
          <p className="text-white font-bold">Serviços</p>
          <ul className="space-y-1 text-foreground --font-normal">
            <li className="mb-4">Conta corrente</li>
            <li className="mb-4">Conta PJ</li>
            <li className="mb-4">Cartão de crédito</li>
          </ul>
        </div>

        {/* Coluna 2 - Contato */}
        <div className="space-y-3 vantagem-description">
          <p className="text-white font-bold">Contato</p>
          <ul className="space-y-1 text-foreground --font-normal">
            <li className="mb-4">0800 504 3058</li>
            <li className="mb-4">suporte@bytebank.com</li>
            <li className="mb-4">contato@bytebank.com</li>
          </ul>
        </div>

        {/* Coluna 3 - Developed by Front-End */}
        <div className="space-y-3 vantagem-description">
          <p className="text-white font-bold">Developed by Front-End</p>
          <div className="space-y-2">
            <Image
              src="/footer/ft-logo.svg"
              className="mb-4"
              alt="Bytebank Logo"
              width={80}
              height={24}
            />
            <div className="flex items-center space-x-3">
              <Image
                src="/footer/ft-instagram.svg"
                className="mb-4"
                alt="Instagram"
                width={20}
                height={20}
              />
              <Image
                src="/footer/ft-youtube.svg"
                className="mb-4"
                alt="YouTube"
                width={20}
                height={20}
              />
              <Image
                src="/footer/ft-whatsapp.svg"
                className="mb-4"
                alt="Whatsapp"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
