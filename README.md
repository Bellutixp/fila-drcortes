# Dr. Cortes - Gestão de Barbearia

Sistema web responsivo desenvolvido para a barbearia **Dr. Cortes**, focado em agilidade no agendamento e organização do fluxo de trabalho entre cliente e profissional.

---

## Interface do Sistema

O projeto utiliza interfaces distintas para garantir a melhor experiência de acordo com o perfil do usuário.

| Fluxo do Cliente | Painel do Barbeiro |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/3639ee44-9be8-470e-8e3a-4171cfc424bd" width="220"/> | <img src="https://github.com/user-attachments/assets/68f2e6a0-c64c-4e21-b600-b0a4ccd24af2" width="220"/> |
| *Agendamento e Identificação* | *Gestão de Fila e Painel Geral* |

### Telas de Suporte
<p align="center">
  <img src="https://github.com/user-attachments/assets/f9e9f5e9-c896-4326-a0fe-0e7cb6716a73" width="180" title="Acesso do Cliente"/>
  <img src="https://github.com/user-attachments/assets/6f94ea6c-76d5-4aae-9c48-3d98858787e7" width="180" title="Sistema Interno"/>
  <img src="https://github.com/user-attachments/assets/a227b36c-66a2-49fa-a3bc-1dde2fd75a7c" width="180" title="Status de Atendimento"/>
</p>

---

## Decisões Técnicas e de Projeto
Este sistema foi criado para resolver a falta de organização em agendamentos de pequeno porte. A arquitetura foi pensada para ser simples e funcional:

*   **Arquitetura Serverless:** Uso de tecnologias estáticas para rodar via GitHub Pages, eliminando custos de servidor para o cliente final.
*   **User Experience (UX):** Separação lógica entre `cliente.html` e `barbeiro.html` para reduzir erros operacionais e facilitar a gestão da fila em tempo real.
*   **Mobile First:** Design totalmente otimizado para celulares, considerando que o acesso principal ocorre via QR Code no estabelecimento.
*   **Escalabilidade:** Estrutura modular em JavaScript que permite a adição de novos serviços e profissionais com baixo esforço de manutenção.

## Funcionalidades
*   **Check-in Rápido:** Interface intuitiva para clientes realizarem agendamentos.
*   **Gestão de Atendimento:** Painel administrativo para o barbeiro gerenciar o status da fila.
*   **Segurança:** Validação de acesso para áreas administrativas.

## Tecnologias Utilizadas
*   **Frontend:** HTML5, CSS3 e JavaScript (ES6+).
*   **Hospedagem:** GitHub Pages.
*   **Integração:** Preparado para acesso direto via QR Code.

## Instalação e Uso
1. Clone o repositório:
   ```bash
   git clone [https://github.com/bellutixp/dr-cortes.git](https://github.com/bellutixp/dr-cortes.git)