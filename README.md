# PoupeFácil 🐷💰

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Expo: 51](https://img.shields.io/badge/Expo-~51-blueviolet.svg)
![Works with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-✅-white.svg)

Um aplicativo de finanças pessoais focado em simplicidade e uma experiência de usuário limpa, construído com React Native e Expo para a disciplina de Desenvolvimento Mobile da UNIFEI-Itabira.

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

O **PoupeFácil** nasceu da necessidade de ter um controle financeiro rápido e descomplicado. O aplicativo guia o usuário por um processo de configuração inicial (`onboarding`) para cadastrar as suas despesas recorrentes e, a partir daí, oferece uma visão clara e dashboards interativos para entender os seus hábitos financeiros.

Toda a persistência de dados é feita localmente através do `AsyncStorage`, garantindo que o app seja leve, rápido e compatível com o Expo Go, com planos futuros de sincronização com uma API na nuvem.

---

## ✨ Funcionalidades

- **Fluxo de Onboarding Guiado**: Uma experiência limpa para o usuário configurar as suas finanças pela primeira vez, permitindo o cadastro de múltiplas despesas personalizadas.
- **Gestão Completa de Transações**: Adicione, consulte, edite e apague qualquer transação, seja ela um gasto fixo ou variável.
- **Dashboard de Relatórios Interativo**:
  - Filtro por período (Mês Atual / Últimos 90 dias).
  - Gráfico de Barras comparando Ganhos vs. Gastos.
  - Gráfico de Pizza com a distribuição de despesas por categoria.
- **Scanner de QR Code**: Funcionalidade para adicionar despesas de forma rápida a partir de notas fiscais.
- **Persistência de Dados Local**: Utiliza `AsyncStorage` para salvar os dados de forma segura no dispositivo.
- **Navegação Moderna**: Construído com `expo-router`, com separação de layouts para onboarding, telas modais e o app principal (com abas).
- **Gerenciamento de Estado Global**: Utiliza a Context API do React para um controle de estado fluido e sem recarregamentos desnecessários.
- **Arquitetura Escalável**: Código organizado em camadas de serviços, componentes reutilizáveis (`InputModal`, `EditTransactionModal`, etc.) e contextos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de aplicativos móveis nativos.
* **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento com React Native.
* **[Expo Router](https://docs.expo.dev/router/introduction/)**: Sistema de roteamento baseado em ficheiros para navegação.
* **[React Context API](https://react.dev/learn/passing-data-deeply-with-context)**: Para gerenciamento de estado global.
* **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)**: Para persistência de dados local (chave-valor).
* **[React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)**: Para a criação dos gráficos de Barras e Pizza.
* **[React Native SVG](https://github.com/react-native-svg/react-native-svg)**: Dependência para os gráficos.

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

A estrutura de ficheiros foi pensada para ser escalável e de fácil manutenção:

PoupeFacil/├── app/                  # Contém todas as rotas e layouts do Expo Router│   ├── (tabs)/           # Grupo de rotas para as telas principais com Tab Bar│   │   ├── _layout.jsx│   │   ├── index.jsx│   │   ├── add.js│   │   ├── reports.js│   │   └── settings.js│   ├── onboarding/       # Grupo de rotas para o fluxo de onboarding│   ├── manual-form.js    # Tela modal para adicionar/editar transações│   ├── transaction-list.js # Tela modal para listar e gerir transações│   └── qr-scanner.js     # Tela modal para o leitor de QR Code├── assets/               # Imagens (ícone, splash), fontes e outros ficheiros estáticos├── src/│   ├── components/       # Componentes React reutilizáveis│   ├── context/          # Provedores de Contexto (AuthContext.js)│   └── services/         # Camada de serviços (storage.js)└── eas.json              # Configuração para builds com EAS└── package.json
---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE.txt` para mais informações.

---

## 📫 Contato

Matheus - [@matheus-fsc](https://github.com/matheus-fsc) - `matheusvgp29@gmail.com`

Link do Projeto: [https://github.com/matheus-fsc/PoupeFacil](https://github.com/matheus-fsc/PoupeFacil)
