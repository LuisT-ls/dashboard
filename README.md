# Dashboard Alternativo

<p align="center">
  <img src="./assets/img/logotype/logo.png" alt="Dashboard Alternativo Logo" width="200">
</p>

Uma aplicação web moderna para análise e visualização de dados, com funcionalidades de criação de gráficos, relatórios estatísticos e exportação de dados em múltiplos formatos.

## 📊 Funcionalidades

- **Visualização de Dados**: Crie gráficos de diversos tipos (barras, linhas, pizza, rosca, radar, áreas e pontos)
- **Entrada Flexível de Dados**: Insira dados manualmente ou importe de arquivos
- **Análise Estatística**: Visualize estatísticas automáticas como soma, média, mínimo, máximo e desvio padrão
- **Histórico de Dados**: Gerenciamento completo com busca e paginação
- **Exportação Versátil**: Exporte seus dados e gráficos em formatos PDF, CSV, Excel e TXT
- **Design Responsivo**: Interface adaptada para todos os tamanhos de dispositivos
- **Armazenamento Local**: Seus dados são salvos localmente para fácil acesso futuro

## 🚀 Tecnologias Utilizadas

- HTML5
- CSS modular e responsivo
- JavaScript modular (ES6+)
- Chart.js para visualização de dados
- FontAwesome para ícones
- Arquitetura modular e escalável

## 🏗️ Estrutura do Projeto

```
.
├── ./assets
│   ├── ./assets/css       # Estilos modulares organizados por funcionalidade
│   └── ./assets/img       # Imagens, logos e favicons
├── ./index.html           # Página principal da aplicação
├── ./js
│   ├── ./js/app.js        # Ponto de entrada da aplicação JavaScript
│   └── ./js/modules       # Módulos JavaScript separados por funcionalidade
├── ./LICENSE
└── ./README.md
```

### Organização de CSS Modular

O CSS está estruturado em módulos para maior manutenibilidade:

- **Base**: Reset, variáveis, tipografia, animações, etc.
- **Componentes**: Botões, ícones, popups e elementos reutilizáveis
- **Features**: Estilos específicos para recursos como gráficos e relatórios
- **Layout**: Estrutura global, cabeçalho, rodapé e containers
- **Utils**: Classes utilitárias para espaçamento e responsividade

### Módulos JavaScript

A aplicação utiliza JavaScript modular:

- **chart.js**: Gerenciamento de criação e renderização de gráficos
- **export.js**: Funcionalidades de exportação de dados
- **storage.js**: Persistência de dados e gerenciamento de armazenamento local
- **ui.js**: Interações de interface e atualização dinâmica de elementos

## 📦 Instalação e Uso

1. Clone o repositório:

   ```bash
   git clone https://github.com/LuisT-ls/dashboard.git
   ```

2. Abra o arquivo `index.html` em seu navegador ou use um servidor local como Live Server.

3. Para iniciar com um servidor de desenvolvimento:
   ```bash
   # Usando npm e live-server
   npm install -g live-server
   live-server
   ```

## 🔧 Desenvolvimento

Para contribuir com o projeto:

1. Crie um fork
2. Clone seu fork
3. Crie uma branch para sua feature (`git checkout -b feature/incrivel`)
4. Commit suas mudanças (`git commit -m 'Adiciona feature incrível'`)
5. Push para a branch (`git push origin feature/incrivel`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](./LICENSE).

## 👥 Contato

- Twitter: [@luistls\_](https://twitter.com/luistls_)
- Instagram: [@luis.tei](https://www.instagram.com/luis.tei)
- LinkedIn: [Luis Tei](https://www.linkedin.com/in/luis-tei)
- GitHub: [LuisT-ls](https://github.com/LuisT-ls)
