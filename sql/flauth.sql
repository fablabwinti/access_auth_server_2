-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.2.8-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Exportiere Datenbank Struktur für flauth
CREATE DATABASE IF NOT EXISTS `flauth` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `flauth`;

-- Exportiere Struktur von Tabelle flauth.articles
DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `min_periods` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.articles: ~20 rows (ungefähr)
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT IGNORE INTO `articles` (`aid`, `title`, `description`, `url`, `price`, `uid`, `min_periods`, `createdAt`, `updatedAt`) VALUES
	(1, 'Sperrholz 3mm', 'Sperrholz Pappel\r\n600 x 400 x 4 mm', '', 5.00, 1, 1, '2017-01-01 00:00:00', '2018-05-04 17:57:17'),
	(2, 'MDF 3mm', 'MDF\r\n600 x 400 x 3 mm', '', 2.50, 1, 1, '2018-04-30 11:29:00', '2018-05-04 17:58:17'),
	(3, 'Acryl klar (600x400)', 'Acrylglas (PMMA) klar\r\n600 x 400 x 3 mm', '', 24.00, 1, 1, '2018-04-30 11:29:00', '2018-05-04 17:58:17'),
	(4, 'Acryl klar (400x300)', 'Acrylglas (PMMA) klar\r\n400 x 300 x 3 mm', '', 12.00, 1, 1, '2018-05-01 11:42:44', '2018-05-04 17:58:17'),
	(50, 'Ausdruck/Kopie A4 (sw, einseitig)', 'Ausdruck/Kopie A4 (einseitig, schwarz/weiss)', '', 0.15, 1, 1, '2018-05-04 17:12:24', '2018-05-04 17:58:17'),
	(51, 'Ausdruck/Kopie A4 (sw, doppelseitig)', 'Ausdruck/Kopie A4 (doppelseitig, schwarz/weiss)', '', 0.30, 1, 1, '2018-05-04 17:16:28', '2018-05-04 17:58:17'),
	(52, 'Ausdruck/Kopie A4 (farbig, einseitig)', 'Ausdruck/Kopie A4 (einseitig, farbig)', '', 0.50, 1, 1, '2018-05-04 17:13:42', '2018-05-04 17:58:17'),
	(53, 'Ausdruck/Kopie A4 (farbig, doppelseitig)', 'Ausdruck/Kopie A4 (doppelseitig, farbig)', '', 1.00, 1, 1, '2018-05-04 17:16:56', '2018-05-04 17:58:17'),
	(100, 'Fidget Spinner', 'Kit: Fidget Spinner', '', 8.00, 1, 1, '2018-05-04 16:30:03', '2018-05-04 17:58:17'),
	(101, 'Bristlebot', 'Kit: Bristlebot', '', 10.00, 1, 1, '2018-05-04 16:31:05', '2018-05-04 17:58:17'),
	(102, 'GetInLine', 'Kit: GetInLine Robot', '', 18.00, 1, 1, '2018-05-04 16:31:53', '2018-05-04 17:58:17'),
	(103, 'Gartenlaterne (ungelötet)', 'Kit: Solar-Gartenlaterne (ungelötet)', '', 18.00, 1, 1, '2018-05-04 16:32:34', '2018-05-04 17:58:17'),
	(104, 'Gartenlaterne (gelötet)', 'Kit: Solar-Gartenlaterne (SMD gelötet)', '', 22.00, 1, 1, '2018-05-04 16:33:51', '2018-05-04 17:58:17'),
	(105, 'Senso', 'Kit: Senso', '', 30.00, 1, 1, '2018-05-04 16:35:48', '2018-05-04 17:58:17'),
	(106, '3x5 LED-Matrix', 'Kit: 3x5 LED-Matrix', '', 30.00, 1, 1, '2018-05-04 16:36:21', '2018-05-04 17:58:17'),
	(200, 'Getränk 5dl PET', 'Getränk 5dl PET (Mineral, Cola, Fanta, Eistee, Shorley...)', '', 2.50, 1, 1, '2018-05-04 16:27:37', '2018-05-04 17:58:17'),
	(201, 'Bier', 'Bier', '', 4.00, 1, 1, '2018-05-04 16:28:26', '2018-05-04 17:58:17'),
	(203, 'Kaffee', 'Kaffee (Kapsel)', '', 1.00, 1, 1, '2018-05-04 16:29:16', '2018-05-04 17:58:17'),
	(300, 'Lagerschublade', 'Lagerschublade unter Laser \r\nfür 1 Woche', '', 2.50, 5, 1, '2018-05-01 11:42:44', '2018-05-04 16:56:57'),
	(301, 'Lagerbox', 'Lagerbox im weissen Regal \r\nfür 4 Wochen', '', 1.00, 5, 4, '2018-05-01 11:42:44', '2018-05-04 16:56:26');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.events
DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.events: ~8 rows (ungefähr)
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT IGNORE INTO `events` (`eid`, `name`) VALUES
	(1, 'Machine started'),
	(2, 'Machine start error'),
	(3, 'Machine shutdown'),
	(4, 'Tag login'),
	(5, 'Tag logout'),
	(6, 'Tag error'),
	(7, 'Manual correction'),
	(8, 'Product Sale');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.invoices
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `iid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `total` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payedAt` datetime DEFAULT NULL,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.invoices: ~1 rows (ungefähr)
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT IGNORE INTO `invoices` (`iid`, `tid`, `name`, `total`, `createdAt`, `updatedAt`, `payedAt`, `uid`) VALUES
	(1, 1, 'Claudio Prezzi', 29.00, '2018-05-01 23:08:13', '2018-05-01 23:08:25', '2018-05-01 23:08:25', 1),
	(4, 1, 'Claudio Prezzi', 9.00, '2018-05-04 18:34:08', '2018-05-04 18:34:08', NULL, 2);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.logs
DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `mid` int(11) DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `tid` int(11) DEFAULT NULL,
  `eid` int(11) NOT NULL,
  `remarks` text DEFAULT NULL,
  `iid` int(11) DEFAULT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.logs: ~7 rows (ungefähr)
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT IGNORE INTO `logs` (`lid`, `timestamp`, `mid`, `aid`, `tid`, `eid`, `remarks`, `iid`) VALUES
	(1, '2017-06-08 22:24:15', 3, NULL, 1, 4, NULL, 1),
	(2, '2017-06-08 23:15:00', 3, NULL, 1, 5, NULL, 1),
	(3, '2018-01-21 15:15:00', 1, NULL, 0, 1, '', NULL),
	(4, '2018-04-30 16:00:00', 6, NULL, 1, 4, '', 1),
	(5, '2018-04-30 16:37:00', 6, NULL, 1, 5, '', 1),
	(6, '2018-05-04 16:40:12', NULL, 1, 1, 8, NULL, 4),
	(7, '2018-05-04 16:54:16', NULL, 301, 1, 8, NULL, 4);
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.machines
DROP TABLE IF EXISTS `machines`;
CREATE TABLE IF NOT EXISTS `machines` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `config` varchar(100) DEFAULT NULL,
  `price` decimal(5,2) NOT NULL,
  `period` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `min_periods` int(11) NOT NULL,
  PRIMARY KEY (`mid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.machines: ~11 rows (ungefähr)
/*!40000 ALTER TABLE `machines` DISABLE KEYS */;
INSERT IGNORE INTO `machines` (`mid`, `name`, `config`, `price`, `period`, `uid`, `min_periods`) VALUES
	(1, 'Lasersaur', '', 6.00, 15, 2, 1),
	(2, 'Laser klein', '', 1.00, 15, 2, 1),
	(3, 'CNC-Fräse', '', 6.00, 15, 2, 1),
	(4, 'Drehbank gr', '', 4.00, 15, 2, 1),
	(5, 'Drehbank kl', '', 4.00, 15, 2, 1),
	(6, 'UM Einstein', '', 1.25, 15, 2, 4),
	(7, 'UM Newton', '', 1.25, 15, 2, 4),
	(8, 'UM Hawking', '', 1.25, 15, 2, 4),
	(9, 'X400', '', 2.00, 15, 2, 4),
	(10, 'Solidoodle', '', 1.50, 15, 2, 4),
	(11, 'p3Steel', '', 1.25, 15, 2, 4);
/*!40000 ALTER TABLE `machines` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.price_units
DROP TABLE IF EXISTS `price_units`;
CREATE TABLE IF NOT EXISTS `price_units` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.price_units: ~7 rows (ungefähr)
/*!40000 ALTER TABLE `price_units` DISABLE KEYS */;
INSERT IGNORE INTO `price_units` (`uid`, `name`) VALUES
	(1, 'Stk.'),
	(2, 'Min.'),
	(3, 'Std.'),
	(4, 'Tag'),
	(5, 'Woche'),
	(6, 'Monat'),
	(7, 'Jahr');
/*!40000 ALTER TABLE `price_units` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.rights
DROP TABLE IF EXISTS `rights`;
CREATE TABLE IF NOT EXISTS `rights` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.rights: ~5 rows (ungefähr)
/*!40000 ALTER TABLE `rights` DISABLE KEYS */;
INSERT IGNORE INTO `rights` (`rid`, `tid`, `mid`, `start`, `end`) VALUES
	(1, 1, 1, '2017-06-01', '2019-01-01'),
	(2, 1, 2, '2017-06-01', '2019-01-01'),
	(3, 1, 3, '2017-06-01', '2019-01-01'),
	(4, 2, 1, '2017-06-19', '2020-01-01'),
	(5, 2, 2, '2017-06-24', '2020-01-01');
/*!40000 ALTER TABLE `rights` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.sessions: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.table_status
DROP TABLE IF EXISTS `table_status`;
CREATE TABLE IF NOT EXISTS `table_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(45) NOT NULL,
  `last_change` timestamp NULL DEFAULT current_timestamp(),
  `rec_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.table_status: ~1 rows (ungefähr)
/*!40000 ALTER TABLE `table_status` DISABLE KEYS */;
INSERT IGNORE INTO `table_status` (`id`, `table`, `last_change`, `rec_count`) VALUES
	(1, 'tags', '2017-08-12 18:41:55', 0);
/*!40000 ALTER TABLE `table_status` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.tags
DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(10) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Exportiere Daten aus Tabelle flauth.tags: ~7 rows (ungefähr)
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT IGNORE INTO `tags` (`tid`, `uid`, `name`) VALUES
	(1, '0856898896', 'Claudio Prezzi'),
	(2, '0079830412', 'Admin'),
	(3, '0599013477', 'Tag 1'),
	(4, '0598580901', 'Tag 2'),
	(5, '0597799173', 'Tag 3'),
	(6, '0599314549', 'Tag 4'),
	(7, '0599455413', 'Tag 5');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle flauth.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` int(11) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle flauth.users: ~5 rows (ungefähr)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` (`uid`, `username`, `password_hash`, `name`, `role`) VALUES
	(1, 'info@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'FabLab Admin', 1),
	(2, 'claudio.prezzi@fablabwinti.ch', '52a824bf40498497cf2d14b0f687c3e5', 'Claudio Prezzi', 2),
	(3, 'andreas.bachmann@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'Andreas Bachmann', 2),
	(4, 'damian.schneider@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'Damian Schneider', 2),
	(5, 'patrick.gubelmann@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'Patrick Gubelmann', 2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
