CREATE DATABASE IF NOT EXISTS dindin;

CREATE TABLE IF NOT EXISTS usuarios (
  id serial NOT NULL,
  nome varchar(80) NOT NULL, 
  email varchar(120) NOT NULL UNIQUE,
  senha varchar(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  id serial NOT NULL,
  descricao text NOT NULL
);

CREATE TABLE IF NOT transacao (
  id serial NOT NULL,
  descricao text NOT NULL,
  valor integer NOT NULL,
  data data NOT NULL,
  categoria_id integer NOT NULL,
  foreign key (categoria_id) references categorias (id),
  foreign key (usuario_id) references usuarios (id),
  tipo text NOT NULL
);

INSERT INTO categorias (descricao)
VALUES
('Casa'), ('Animais'),('Alimentacao'),('Transporte'),
('Vendas'), ('Salário'),('Roupas'),('Presentes'), ('Saúde'), ('Despesas Pessoais'), ('Educacão'), ('Cursos'), ('Família'), ('Carro'), ('Atividades'), ('Viagens'), ('Cuidados Pessoais'), ('Serviços');