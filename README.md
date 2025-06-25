# PoupeFácil 🐷💰

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Expo: 51](https://img.shields.io/badge/Expo-~51-blueviolet.svg)
![Works with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-✅-white.svg)

Um aplicativo de finanças pessoais focado em simplicidade e uma experiência de usuário limpa, construído com React Native e Expo.

---

## 📖 Tabela de Conteúdos

* [Sobre o Projeto](#-sobre-o-projeto)
* [✨ Funcionalidades](#-funcionalidades)
* [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [🚀 Começando](#-começando)
* [📁 Estrutura de Arquivos](#-estrutura-de-arquivos)
* [📜 Licença](#-licença)
* [📫 Contato](#-contato)

---

## 🎯 Sobre o Projeto

O **PoupeFácil** nasceu da necessidade de ter um controle financeiro rápido e descomplicado, diretamente no celular. O aplicativo guia o usuário por um processo de configuração inicial (`onboarding`) para cadastrar suas despesas recorrentes e, a partir daí, oferece uma visão clara de seus gastos mensais.

Toda a persistência de dados é feita localmente através do `AsyncStorage`, garantindo que o app seja leve, rápido e compatível com o Expo Go, com planos futuros de sincronização com uma API na nuvem.

---

## ✨ Funcionalidades

- **Fluxo de Onboarding Guiado**: Uma experiência limpa para o usuário configurar suas finanças pela primeira vez.
- **Gerenciamento de Despesas Recorrentes**: Cadastro fácil de contas fixas e assinaturas.
- **Persistência de Dados Local**: Utiliza `AsyncStorage` para salvar os dados de forma segura no dispositivo.
- **Navegação Moderna**: Construído com `expo-router`, com separação de layouts para onboarding e o app principal.
- **Gerenciamento de Estado Global**: Utiliza a Context API do React para um controle de estado fluido e sem recarregamentos desnecessários.
- **Arquitetura Escalável**: Código organizado em camadas de serviços, componentes reutilizáveis e contextos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de aplicativos móveis nativos.
* **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento com React Native.
* **[Expo Router](https://docs.expo.dev/router/introduction/)**: Sistema de roteamento baseado em arquivos para navegação.
* **[React Context API](https://react.dev/learn/passing-data-deeply-with-context)**: Para gerenciamento de estado global.
* **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)**: Para persistência de dados local (chave-valor).

---

## 🚀 Começando

Para executar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/matheus-fsc/PoupeFacil.git](https://github.com/matheus-fsc/PoupeFacil.git)
    ```
2.  **Navegue até o diretório do projeto**
    ```bash
    cd PoupeFacil
    ```
3.  **Instale as dependências**
    ```bash
    npm install
    ```
    _ou se você usa Yarn:_
    ```bash
    yarn install
    ```
4.  **Inicie o servidor de desenvolvimento do Expo**
    ```bash
    npx expo start
    ```
5.  **Execute no seu dispositivo**: Escaneie o QR Code com o aplicativo Expo Go (disponível para [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) e [iOS](https://apps.apple.com/us/app/expo-go/id982107779)).

---

## 📁 Estrutura de Arquivos

A estrutura de arquivos foi pensada para ser escalável e de fácil manutenção:

```
PoupeFacil/
├── app/                  # Contém todas as rotas e layouts do Expo Router
│   ├── (tabs)/           # Grupo de rotas para as telas principais com Tab Bar
│   │   ├── _layout.jsx
│   │   └── index.jsx
│   └── onboarding/       # Grupo de rotas para o fluxo de onboarding
│       ├── _layout.jsx
│       └── welcome.js
├── assets/               # Imagens, fontes e outros arquivos estáticos
├── components/           # Componentes React reutilizáveis (ex: PrimaryButton.js)
├── context/              # Provedores de Contexto (ex: AuthContext.js)
├── services/             # Camada de serviços (ex: storage.js para interagir com AsyncStorage)
└── package.json
```

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE.txt` para mais informações.

*(Você pode criar um arquivo `LICENSE.txt` na raiz do projeto e colar o texto da licença MIT nele)*

---

## 📫 Contato

Matheus - [@matheus-fsc](https://github.com/matheus-fsc) - `seu_email@exemplo.com`

Link do Projeto: [https://github.com/matheus-fsc/PoupeFacil](https://github.com/matheus-fsc/PoupeFacil)
