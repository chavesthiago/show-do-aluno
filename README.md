# 🎓 Show do Aluno

Jogo de perguntas e respostas no estilo *game show* para alunos de **7 a 12 anos** (2º ao 7º ano), feito para o **professor projetar em sala de aula** (projetor, TV, computador, tablet ou celular).

🔗 **Jogue agora:** https://chavesthiago.github.io/show-do-aluno/

## ✨ O que tem nesta versão (MVP)

- **Show de perguntas** com 4 alternativas coloridas (ou 3, se o professor deixar a última em branco) (cada uma com cor, letra e forma, pensando em quem tem daltonismo)
- **Português:** vogais, 13 famílias silábicas, rimas, contrários, singular e plural, ortografia, pontuação, sinônimos, classes de palavras, sílabas e acentuação
- **Matemática:** contagem, antes e depois, par ou ímpar, adição, subtração, tabuada, divisão, dobro e metade, sistema monetário, probleminhas, medidas e tempo, geometria, frações, decimais, porcentagem, expressões, potências, números inteiros e equações. A maioria das contas é **gerada na hora**, então as perguntas mudam a cada partida.
- **Painel de conteúdos** com filtro por disciplina e ano escolar (com referência à BNCC)
- **Área do Professor:** o professor cria seus próprios conteúdos, de qualquer disciplina, com perguntas, figuras (emoji ou foto), resposta certa e dica. Pode **exportar** e **importar** em arquivo `.json` para levar a outro aparelho ou compartilhar com colegas.
- **Ajudas:** Pular, Eliminar 2 e Ajuda do Professor
- **Narração** das perguntas com a voz do navegador (pt-BR)
- **Sons** criados pelo próprio app (Web Audio, sem arquivos de áudio), **confetes**, animações de acerto e erro, pontuação com bônus de sequência e recorde por conteúdo
- Erro tratado com carinho: a resposta certa é mostrada e o jogo segue, sem "perder tudo"
- **Controle pelo teclado** (ótimo com passador de slides): `1`–`4` ou `A`–`D` respondem; `Enter`, `Espaço` ou `→` avançam; `Esc` sai
- **PWA:** funciona sem internet depois de aberto uma vez e pode ser instalado com ícone na tela inicial
- Opção **Menos animação** e respeito à configuração "reduzir movimento" do aparelho

## 🧱 Tecnologias

React 18 · TypeScript · Vite · Framer Motion · Zustand · canvas-confetti · vite-plugin-pwa · Web Speech API · Web Audio API

## 💻 Rodar no seu computador

Precisa do [Node.js](https://nodejs.org/) 20 ou mais novo.

```bash
npm install        # instala as dependências (só na primeira vez)
npm run dev        # abre em http://localhost:5173/show-do-aluno/
npm run verificar  # confere se todas as perguntas estão corretas
npm run build      # gera a versão final na pasta dist/
```

## 🚀 Publicação

Cada `push` na branch `main` roda o GitHub Actions (`.github/workflows/deploy.yml`): confere as perguntas, gera o site e publica no GitHub Pages.

## 📁 Organização

```
src/
├── dados/                 ← banco de perguntas
│   ├── portugues/         ← famílias silábicas e linguagem
│   ├── matematica/        ← geradores de contas e perguntas fixas
│   └── catalogo.ts        ← junta tudo e prepara a partida
├── telas/                 ← Abertura, Menu, Conteudos, Jogo, Resultado, Professor
├── componentes/           ← Logo, Fundo, Figura, Modal
├── servicos/              ← sons, narração, confete, tela cheia, arquivos
└── estado/app.ts          ← estado do jogo (Zustand)
```

**Para adicionar perguntas fixas:** edite os arquivos em `src/dados/`. A **primeira alternativa é sempre a correta**; o jogo embaralha na hora de mostrar. Depois rode `npm run verificar`.

## 🗺️ Próximas versões

- **Versão 2:** montar palavras, arrastar sílabas, desafios cronometrados, mascote, mapa de progressão
- **Versão 3:** turmas, relatórios de aprendizagem, perfis dos alunos, multiplayer, ranking privado e biblioteca de atividades compartilhadas

## 🔒 Privacidade

Nenhum dado sai do aparelho. Conteúdos do professor, recordes e configurações ficam salvos apenas no navegador (localStorage).
