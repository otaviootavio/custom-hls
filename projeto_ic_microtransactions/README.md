# Transmissão e armazenamento de HashChains em extensão

Esse projeto tem como intuito possibilitar a transmissão de dados armazenados em uma extensão para uma página web. Ele é dividido em duas partes: a extensão e a página.

## Estrutura do Projeto

### Extensão

A extensão possui um manifesto, que serve para o navegador identificar quais são os scripts utilizados na extensão, quais permissões essa extensão possui, além de nome, versão, descrição, etc. Ela também possui uma estrutura para mandar mensagens internamente e para fora da extensão através de eventos personalizados.

#### Background

- Função: Ouvir as mensagens vindas do pop-up e do content, e realizar as ações pedidas nessas mensagens, como armazenar dados e enviar dados armazenados.
- Participa na construção da hashchain.

#### Content

- Função: Realizar a comunicação entre a página e a extensão, enviando e recebendo mensagens para o background (pedindo dados).
- Cria e recebe eventos personalizados da página, que podem conter dados.

#### Pop-Up

- Área de interação com o usuário, como digitar dados, por exemplo.

## Instalação

1. Instalar a API do Google Chrome para APIs:
   ```bash
   npm install --save-dev @types/chrome
   ```
2. Instalar Viem para a hashchain:
   ```bash
   npm install viem
   ```
3. Rodar o build da extensão
   ```bash
   npm run build
   ```
4. Carregar a pasta dist na aba de desenvolvedor de extensão do Chrome
5. Rodar o ambiente de desenvolvimento na página
   ```bash
   npm run dev
   ```
