-- --------------------------------------------------------
-- Host:                         192.168.1.5
-- Server version:               10.9.3-MariaDB-1:10.9.3+maria~ubu2204 - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table flauth.articles
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
  PRIMARY KEY (`aid`),
  KEY `FK_article_uid_users` (`uid`),
  CONSTRAINT `FK_article_uid_users` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.documents
CREATE TABLE IF NOT EXISTS `documents` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `datatype` varchar(20) DEFAULT NULL COMMENT 'MIME datatype of document',
  `content` mediumblob DEFAULT NULL COMMENT 'data URL',
  PRIMARY KEY (`did`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Can contain documents or photos';

-- Data exporting was unselected.

-- Dumping structure for table flauth.events
CREATE TABLE IF NOT EXISTS `events` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.invoices
CREATE TABLE IF NOT EXISTS `invoices` (
  `iid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payedAt` datetime DEFAULT NULL,
  `uid` int(11) NOT NULL,
  `pid` int(11) DEFAULT NULL,
  PRIMARY KEY (`iid`),
  KEY `FK_invoices_pid` (`pid`),
  CONSTRAINT `FK_invoices_pid` FOREIGN KEY (`pid`) REFERENCES `paymodes` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.knowledge
CREATE TABLE IF NOT EXISTS `knowledge` (
  `kid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`kid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `mid` int(11) DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `quantity` int(11) unsigned DEFAULT NULL,
  `tid` int(11) DEFAULT NULL,
  `eid` int(11) NOT NULL,
  `remarks` text DEFAULT NULL,
  `iid` int(11) DEFAULT NULL,
  `err` int(11) DEFAULT NULL,
  PRIMARY KEY (`lid`),
  KEY `FK_logs_mid_machine` (`mid`),
  KEY `FK_logs_aid_article` (`aid`),
  KEY `FK_logs_eid_events` (`eid`),
  KEY `FK_logs_tid_tags` (`tid`),
  CONSTRAINT `FK_logs_aid_article` FOREIGN KEY (`aid`) REFERENCES `articles` (`aid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_logs_eid_events` FOREIGN KEY (`eid`) REFERENCES `events` (`eid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_logs_mid_machine` FOREIGN KEY (`mid`) REFERENCES `machines` (`mid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_logs_tid_tags` FOREIGN KEY (`tid`) REFERENCES `tags` (`tid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.logs_bkp_20211013
CREATE TABLE IF NOT EXISTS `logs_bkp_20211013` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `mid` int(11) DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `tid` int(11) DEFAULT NULL,
  `eid` int(11) NOT NULL,
  `remarks` text DEFAULT NULL,
  `iid` int(11) DEFAULT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.machines
CREATE TABLE IF NOT EXISTS `machines` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `config` varchar(100) DEFAULT NULL,
  `price` decimal(5,2) NOT NULL,
  `period` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `min_periods` int(11) NOT NULL,
  `minp_price` decimal(5,2) DEFAULT NULL,
  `offdelay` int(11) NOT NULL DEFAULT 0,
  `watchdog` int(11) NOT NULL DEFAULT 15,
  PRIMARY KEY (`mid`) USING BTREE,
  KEY `FK_uid_users_uid` (`uid`),
  CONSTRAINT `FK_uid_users_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.paymodes
CREATE TABLE IF NOT EXISTS `paymodes` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `commission` decimal(2,2) DEFAULT NULL COMMENT 'percent',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.price_units
CREATE TABLE IF NOT EXISTS `price_units` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.queries
CREATE TABLE IF NOT EXISTS `queries` (
  `qid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `query` blob DEFAULT NULL,
  PRIMARY KEY (`qid`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='database queries: Stores queries that shall be executed with parameters named as §1, §2 etc.';

-- Data exporting was unselected.

-- Dumping structure for table flauth.rights
CREATE TABLE IF NOT EXISTS `rights` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.table_status
CREATE TABLE IF NOT EXISTS `table_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(45) NOT NULL,
  `last_change` timestamp NULL DEFAULT current_timestamp(),
  `rec_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(10) DEFAULT NULL COMMENT 'Tag Card ID number(Not user id!)',
  `name` varchar(50) DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `blocked` tinyint(4) NOT NULL DEFAULT 0,
  `repl_by_uid` varchar(10) NOT NULL DEFAULT '' COMMENT 'Replaced by Card ID Number',
  `repl_for_uid` varchar(10) NOT NULL DEFAULT '' COMMENT 'Replacement for Card ID Number',
  `replDate` datetime DEFAULT NULL COMMENT 'Replacement Date and Time',
  `labmgr_uid` int(11) DEFAULT NULL COMMENT 'Reference to controlling Labmanager',
  PRIMARY KEY (`tid`),
  UNIQUE KEY `uid` (`uid`),
  KEY `index1` (`uid`),
  KEY `index2` (`name`),
  KEY `FK_labmgr_uid_users_uid` (`labmgr_uid`),
  CONSTRAINT `FK_labmgr_uid_users_uid` FOREIGN KEY (`labmgr_uid`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table flauth.users
CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password_hash` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `rid` int(11) DEFAULT NULL,
  `did` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.user_kn
CREATE TABLE IF NOT EXISTS `user_kn` (
  `ukid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `kid` int(11) NOT NULL,
  PRIMARY KEY (`ukid`),
  KEY `FK_user_kn_users` (`uid`),
  KEY `FK_user_kn_knowledge` (`kid`),
  CONSTRAINT `FK_user_kn_knowledge` FOREIGN KEY (`kid`) REFERENCES `knowledge` (`kid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_kn_users` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table flauth.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `urid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  PRIMARY KEY (`urid`),
  KEY `FK_user_roles_users` (`uid`),
  KEY `FK_user_roles_roles` (`rid`),
  CONSTRAINT `FK_user_roles_roles` FOREIGN KEY (`rid`) REFERENCES `roles` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_roles_users` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
