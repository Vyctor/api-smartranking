# Microservices em Node.js: NestJS, Typescript, RabbitMQ, MongoDB, AWS e Cloud Foundry

## Aplicação a ser desenvolvida

Será uma aplicação utilizada por jogadores amadores de tênis.
Esses jogadores fazem parte de um ranking que é atualizado conforme a realização das partidas.
Atualmente este ranking é controlado de forma manual, e o organizador nos procurou para que possamos 
desenvolver uma aplicação que venha modernizar este controle, visando incentivar quem já participa, bem como
disponibilizar um atrativo para novos jogadores.

### Ações disponíveis para o Jogador

* Solicitar ou rejeitar um desafio
* Registar o resultado de uma partida
* Acompanhar os rankings
* Consultar seus dados e seu histórico de partidas (vitórias, derrotas, posição no ranking)
* Consultar as informações de seus adversários (histórico de partidas e dados)
* Ser notificado por e-mail quando for desafiado

### Ações disponíveis para o Administrador

* Cadastrar as categorias e definir as populações
* Cadastrar jogadores e definir suas categorias
* Ser notificado quando existir um desafio pendente a mais de 10 dias.


# Tecnologias Utilizadas

* NestJS
* MongoDB

# Microservices - Entendimentos Iniciais

## Benefícios

- Facilitar a implementação de novas features, uma vez que teremos domínios de negócio exclusivos em cada microservice.
- Autonomia para nossos componentes de modo que possamos desenvolver e publicar serviços de forma independente
- Aumentar a capacidade de escalabilidade horizontal e balanceamento de carga
- Maior resiliência / Tolerância a falhas
