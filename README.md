# Microservices em Node.js: NestJS, Typescript, RabbitMQ, MongoDB, AWS e Cloud Foundry

## Aplicação a ser desenvolvida

Será uma aplicação utilizada por jogadores amadores de tênis.
Esses jogadores fazem parte de um ranking que é atualizado conforme a realização das partidas.
Atualmente este ranking é controlado de forma manual, e o organizador nos procurou para que possamos
desenvolver uma aplicação que venha modernizar este controle, visando incentivar quem já participa, bem como
disponibilizar um atrativo para novos jogadores.

### Ações disponíveis para o Jogador

- Solicitar ou rejeitar um desafio
- Registar o resultado de uma partida
- Acompanhar os rankings
- Consultar seus dados e seu histórico de partidas (vitórias, derrotas, posição no ranking)
- Consultar as informações de seus adversários (histórico de partidas e dados)
- Ser notificado por e-mail quando for desafiado

### Ações disponíveis para o Administrador

- Cadastrar as categorias e definir as populações
- Cadastrar jogadores e definir suas categorias
- Ser notificado quando existir um desafio pendente a mais de 10 dias.

# Tecnologias Utilizadas

- NestJS
- Nest Microservices
- MongoDB

# Microservices - Entendimentos Iniciais

## Benefícios

- Facilitar a implementação de novas features, uma vez que teremos domínios de negócio exclusivos em cada microservice.
- Autonomia para nossos componentes de modo que possamos desenvolver e publicar serviços de forma independente
- Aumentar a capacidade de escalabilidade horizontal e balanceamento de carga
- Maior resiliência / Tolerância a falhas

# Nest Microservices

É um subsistema integrado no Nest, que utiliza uma camada diferente de transporte, que não é HTTP, para viabilizar a
comunicação entre aplicações através da rede.

Seu CORE é chamado de **TRANSPORTERS**, que são responsáveis por transmitir as mensagens entre diferentes instâncias de
microservices, suporta nativamente os estilods de mensagem: request-response e event-based. Abstrai os detalhes de
implementação de cada transporter atrás de uma interface canônica.

**Transporter Broker-based**: Redis, NATS, RabbitMQ, MQTT, e Kafka
Permite descoplar vários componentes da aplicação. Cada componente somente precisa se conectar ao broker, e pode permanecer
sem necessidade de conhecer a existência, localização ou detalhes da implementação de outros componentes.
A única coisa que precisa ser compartilhada entre os componentes é o protocolo de mensagens.

Um broker se divide em:

- Broker Server: Processo do lado servidor, responsável por gerenciar a publicação, assinatura e entrega das mensagens aos clientes
- Broker client API: É disponibilizado em um package específico para cada linguagem, fornecendo uma API para acessar
  o broker, a partir de aplicações clientes.

**Point-to-point**: TCP E gRPC
