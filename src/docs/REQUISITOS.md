# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RN**

- O link enviado por e-mail para resetar a senha deve expirar em 2 horas;
- O usuário deve confirmar sua senha (digitando-a novamente) durante o reset;

**RNF**

- Utilizar Mailtrap para testar envios de e-mail em ambiente de desenvolvimento;
- Utilizar o Amazon SES (Simple Email Service) para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

# Atualização de perfil

**RF**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar a senha, o usuário deve informar a senha antiga;
- Para atualizar a senha, o usuário deve confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar os seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que receber um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas utilizando Socket.io;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviços cadastrados;
- O usuário deve poder listar todos aqueles dias do mês que possuam pelo menos um horário disponível;
- A listagem dos dias disponíveis deve ser filtrada por prestador;
- O usuário deve poder listar os horários disponíveis em um dia (por prestador);
- O usuário deve poder realizar um novo agendamento com um prestador;

**RN**

- Cada agendamento deve durar 1 hora;
- Os agendamentos devem estar disponíveis entre 8h e 18h de seg a sáb (primeio às 8h e último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário passado;
- O usuário não pode agendar serviços com ele próprio;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;
