/// <reference types="vite/client" />


interface ImportMetaEnv {
    VITE_SERVER_ADDRESS: string;
    // outras variáveis de ambiente podem ser adicionadas aqui
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }