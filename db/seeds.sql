INSERT INTO department (name)
VALUES 
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Management'),
  ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Lead Engineer', '150000', 1),
  ('Software Engineer', '120000', 1),
  ('Intern Engineer', '90000', 1),
  ('Account Manager', '155000', 2),
  ('Accountant', '125000', 2),
  ('Clerk', '60000', 2),
  ('Legal Team Lead', '250000', 3),
  ('Lawyer', '190000', 3),
  ('Legal Aide', '75000', 3),
  ('Engineering Manager', '165000', 4),
  ('Finance Manager', '165000', 4),
  ('Legal Manager', '180000', 4),
  ('Sales Manager', '145000', 4),
  ('Sales Lead', '100000', 5),
  ('Salesperson', '80000', 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('James', 'Fraser', 10, NULL),
  ('Jack', 'London', 11, NULL),
  ('Robert', 'Bruce', 12, NULL),
  ('Peter', 'Greenaway', 13, NULL),
  ('Derek', 'Jarman', 1, 1),
  ('Paolo', 'Pasolini', 2, 1),
  ('Heathcote', 'Williams', 2, 1),
  ('Sandy', 'Powell', 2, 1),
  ('Emil', 'Zola', 2, 1),
  ('Sissy', 'Coalpits', 2, 1),
  ('Antoinette', 'Capet', 3, 1),
  ('Samuel', 'Delany', 3, 1),
  ('Tony', 'Duvert', 3, 1),
  ('Dennis', 'Cooper', 4, 2),
  ('Monica', 'Bellucci', 4, 2),
  ('Samuel', 'Johnson', 5, 2),
  ('John', 'Dryden', 5, 2),
  ('Alexander', 'Pope', 5, 2),
  ('Lionel', 'Johnson', 6, 2),
  ('Aubrey', 'Beardsley', 6, 2),
  ('Tulse', 'Luper', 7, 3),
  ('William', 'Morris', 8, 3),
  ('George', 'Shaw', 8, 3),
  ('Arnold', 'Bennett', 8, 3),
  ('Algernon', 'Blackwood', 9, 3),
  ('Rhoda', 'Broughton', 9, 3),
  ('Hart', 'Crane', 9, 3),
  ('Vitorio', 'DeSica', 14, 4),
  ('Wilkie', 'Collins', 14, 4),
  ('Elizabeth', 'Gaskell', 15, 4),
  ('George', 'Sand', 15, 4),
  ('Vernon', 'Lee', 15, 4),
  ('Arthur', 'Machen', 15, 4),
  ('Frederick', 'Marryat', 15, 4);
 
  
 