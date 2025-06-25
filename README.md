# PoupeFácil 🐷💰

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Expo: 51](https://img.shields.io/badge/Expo-~51-blueviolet.svg)
![Works with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-✅-white.svg)

Um aplicativo de finanças pessoais focado em simplicidade e uma experiência de usuário limpa. Desenvolvido com **React Native** e **Expo**, como parte da disciplina de **Desenvolvimento Mobile** da **UNIFEI - Itabira**.

---

## 📖 Tabela de Conteúdos

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🚀 Começando](#-começando)
- [📁 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [📜 Licença](#-licença)
- [📫 Contato](#-contato)

---

## 🎯 Sobre o Projeto

O **PoupeFácil** nasceu da necessidade de um controle financeiro rápido e descomplicado. O app guia o usuário por um onboarding simples para cadastrar suas despesas recorrentes e, a partir disso, oferece uma visão clara por meio de dashboards interativos que ajudam a entender seus hábitos financeiros.

Atualmente, os dados são armazenados localmente usando `AsyncStorage`, o que garante leveza e compatibilidade com o **Expo Go**. No futuro, planeja-se a sincronização com uma API na nuvem.

---

## ✨ Funcionalidades

- ✅ **Onboarding Guiado** para configurar as finanças pela primeira vez.
- 💸 **Gestão de Transações**: adicionar, editar, excluir e consultar gastos fixos e variáveis.
- 📊 **Dashboard Interativo**:
  - Filtro por período (mês atual e últimos 90 dias)
  - Gráfico de barras (Ganhos vs. Gastos)
  - Gráfico de pizza (categorias de despesas)
- 📷 **Scanner de QR Code** para inserir despesas a partir de notas fiscais.
- 💾 **Persistência local** com `AsyncStorage`.
- 🧭 **Navegação moderna** com `expo-router` e layouts distintos (onboarding, modais, principal).
- 🌐 **Gerenciamento de estado global** com Context API.
- 🧱 **Arquitetura escalável** com serviços, componentes reutilizáveis e separação clara de contextos.

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de apps nativos.
- **[Expo](https://expo.dev/)**: Plataforma de ferramentas para facilitar o desenvolvimento.
- **[Expo Router](https://docs.expo.dev/router/introduction/)**: Navegação baseada em arquivos.
- **[React Context API](https://react.dev/learn/passing-data-deeply-with-context)**: Gerenciamento de estado.
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)**: Persistência local.
- **[React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)**: Gráficos de barra e pizza.
- **[React Native SVG](https://github.com/react-native-svg/react-native-svg)**: Dependência gráfica para os gráficos.

---

## 🚀 Começando

Para executar este projeto localmente, siga os passos abaixo:

```bash
# Clone o repositório
git clone https://github.com/matheus-fsc/PoupeFacil.git

# Acesse a pasta do projeto
cd PoupeFacil

# Instale as dependências
npm install
# ou
yarn install

# Inicie o projeto com Expo
npx expo start
```

Depois, escaneie o QR Code com o app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/us/app/expo-go/id982107779)).

---

## 📁 Estrutura de Arquivos

```bash
PoupeFacil/
├── app/                  # Rotas e layouts do Expo Router
│   ├── (tabs)/           # Telas principais com Tab Bar
│   │   ├── _layout.jsx
│   │   ├── index.jsx
│   │   ├── add.js
│   │   ├── reports.js
│   │   └── settings.js
│   ├── onboarding/       # Fluxo de onboarding
│   ├── manual-form.js    # Modal: adicionar/editar transações
│   ├── transaction-list.js # Modal: gerenciar transações
│   └── qr-scanner.js     # Modal: leitor de QR Code
├── assets/               # Ícones, splash, fontes
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Contextos (ex: AuthContext.js)
│   └── services/         # Serviços (ex: storage.js)
├── eas.json              # Configuração do EAS
└── package.json
```

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE.txt` para mais informações.

---

## 📫 Contato

Matheus - [@matheus-fsc](https://github.com/matheus-fsc)  
📧 `matheusvgp29@gmail.com`  
🔗 Projeto: [https://github.com/matheus-fsc/PoupeFacil](https://github.com/matheus-fsc/PoupeFacil)
