# PIX estatico minimo

Este projeto gera localmente um QR Code PIX com a chave estatica aleatoria fixa abaixo. O site e 100% estatico e pode ser publicado direto no GitHub Pages, sem servidor local.

## Chave fixa

dd5bbbba-51d3-4f30-b4ba-3fdc4aec9132

## GitHub Pages

O projeto esta pronto para deploy estatico pelo GitHub Pages usando a pasta public.

1. Envie o repositorio para o GitHub.
2. Garanta que a branch principal seja main.
3. Em Settings > Pages, deixe Source como GitHub Actions.
4. Ao fazer push na main, o workflow publica automaticamente.

## O que ficou

- Tela unica para gerar QR Code e copiar o pagamento PIX
- Geração local do payload PIX no navegador
- Workflow de deploy para GitHub Pages

## Estrutura

- public/: arquivos do site
- .github/workflows/deploy-pages.yml: publicacao automatica no GitHub Pages
