import mysql from 'mysql2/promise';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS daroul_mokhtar');
  await connection.end();
}

async function createTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'daroul_mokhtar'
  });

  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user'
    )
  `);

  // Classes table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS classes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      type ENUM('Arabe', 'Français') NOT NULL
    )
  `);

  // Eleves table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS eleves (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numeroImmatriculation VARCHAR(255) NOT NULL UNIQUE,
      nom VARCHAR(255) NOT NULL,
      prenom VARCHAR(255) NOT NULL,
      dateNaissance DATE,
      classeArabe INT,
      classeFrancais INT,
      FOREIGN KEY (classeArabe) REFERENCES classes(id),
      FOREIGN KEY (classeFrancais) REFERENCES classes(id)
    )
  `);

  // Professeurs table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS professeurs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numeroImmatriculation VARCHAR(255) NOT NULL UNIQUE,
      nom VARCHAR(255) NOT NULL,
      prenom VARCHAR(255) NOT NULL,
      matiere VARCHAR(255),
      classeArabe INT,
      classeFrancais INT,
      FOREIGN KEY (classeArabe) REFERENCES classes(id),
      FOREIGN KEY (classeFrancais) REFERENCES classes(id)
    )
  `);

  // Paiements table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS paiements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      eleveId INT NOT NULL,
      date DATE NOT NULL,
      montant DECIMAL(10, 2) NOT NULL,
      type ENUM('Inscription', 'Mensualité', 'Tenue') NOT NULL,
      mois VARCHAR(7),
      description TEXT,
      FOREIGN KEY (eleveId) REFERENCES eleves(id)
    )
  `);

  // Depenses table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS depenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      montant DECIMAL(10, 2) NOT NULL,
      categorie ENUM('Salaire', 'Electricité', 'Eau', 'Personnel', 'Autre') NOT NULL,
      description TEXT,
      userId INT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Insert default admin user
  await connection.query(`
    INSERT IGNORE INTO users (username, password, role)
    VALUES ('admin', 'superadmin123', 'superadmin')
  `);

  // Insert default classes
  const classesData = [
    ['PS', 'Français'], ['GS', 'Français'], ['CI', 'Français'],
    ['CP', 'Français'], ['CE1', 'Français'], ['CE2', 'Français'],
    ['CM1', 'Français'], ['CM2', 'Français'],
    ['PS', 'Arabe'], ['GS', 'Arabe'], ['CI', 'Arabe'],
    ['CP', 'Arabe'], ['CE1', 'Arabe'], ['CE2', 'Arabe'],
    ['CM1', 'Arabe'], ['CM2', 'Arabe']
  ];

  for (const [nom, type] of classesData) {
    await connection.query(
      'INSERT IGNORE INTO classes (nom, type) VALUES (?, ?)',
      [nom, type]
    );
  }

  await connection.end();
}

async function migrate() {
  try {
    await createDatabase();
    await createTables();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();