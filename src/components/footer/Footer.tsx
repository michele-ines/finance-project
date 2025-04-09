"use client";

import React from "react";
import { Image } from "../ui/index"; 

import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer} >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Coluna 1 - Serviços */}
        <div className="space-y-3">
          <p className="text-white font-semibold">Serviços</p>
          <ul className="space-y-1 text-foreground">
            <li>Conta corrente</li>
            <li>Conta PJ</li>
            <li>Cartão de crédito</li>
          </ul>
        </div>

        {/* Coluna 2 - Contato */}
        <div className="space-y-3">
          <p className="text-white font-semibold">Contato</p>
          <ul className="space-y-1 text-foreground">
            <li>0800 504 3058</li>
            <li>oi@designedbyalex.art.br</li>
            <li>studio@bytebank.com.br</li>
          </ul>
        </div>

        {/* Coluna 3 - Desenvolvido por Alex */}
        <div className="space-y-3">
          <p className="text-white font-semibold">Desenvolvido por Alex</p>
          <div className="space-y-2">
            <Image
              src="/footer/ft-logo.svg"
              alt="Bytebank Logo"
              width={80}
              height={24}
            />
            <div className="flex items-center space-x-3">
              <Image
                src="/footer/ft-instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
              <Image
                src="/footer/ft-youtube.svg"
                alt="YouTube"
                width={20}
                height={20}
              />
              <Image
                src="/footer/ft-whatsapp.svg"
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
