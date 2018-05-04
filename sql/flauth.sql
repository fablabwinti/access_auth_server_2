CREATE DATABASE  IF NOT EXISTS `flauth` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `flauth`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: flauth
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articles` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'Sperrholz 3mm','Sperrholz Pappel\r\n600 x 400 x 4 mm',5.00,'',1,'2017-01-01 00:00:00','2018-05-01 15:28:08'),(2,'MDF 3mm','MDF\r\n600 x 400 x 3 mm',2.50,'',1,'2018-04-30 11:29:00','2018-05-01 15:28:14'),(3,'Acryl klar (600x400)','Acrylglas (PMMA) klar\r\n600 x 400 x 3 mm',24.00,'',1,'2018-04-30 11:29:00','2018-05-01 15:28:19'),(4,'Acryl klar (400x300)','Acrylglas (PMMA) klar\r\n400 x 300 x 3 mm',12.00,'',1,'2018-05-01 11:42:44','2018-05-01 15:15:12'),(5,'Lagerschublade','Lagerplatz in Schublade unter Laser',2.50,'',4,'2018-05-01 11:42:44','2018-05-01 15:27:49'),(6,'Lagerbox','Lagerbox im weissen Regal\r\n300 x 300 x 300 mm',1.00,'',4,'2018-05-01 11:42:44','2018-05-01 15:15:12');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Machine started'),(2,'Machine start error'),(3,'Machine shutdown'),(4,'Tag login'),(5,'Tag logout'),(6,'Manual correction');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `iid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `total` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payedAt` datetime DEFAULT NULL,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,1,'Claudio Prezzi',29.00,'2018-05-01 23:08:13','2018-05-01 23:08:25','2018-05-01 23:08:25',1);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mid` int(11) DEFAULT NULL,
  `tid` int(11) DEFAULT NULL,
  `eid` int(11) NOT NULL,
  `remarks` text,
  `iid` int(11) DEFAULT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,'2017-06-08 20:24:15',3,1,4,NULL,1),(2,'2017-06-08 21:15:00',3,1,5,NULL,1),(3,'2018-01-21 14:15:00',1,0,1,'',NULL),(4,'2018-04-30 14:00:00',6,1,4,'',1),(5,'2018-04-30 14:37:00',6,1,5,'',1);
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `machines`
--

DROP TABLE IF EXISTS `machines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `machines` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `config` varchar(100) DEFAULT NULL,
  `price` decimal(5,2) NOT NULL,
  `period` int(11) NOT NULL,
  `min_periods` int(11) NOT NULL,
  PRIMARY KEY (`mid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machines`
--

LOCK TABLES `machines` WRITE;
/*!40000 ALTER TABLE `machines` DISABLE KEYS */;
INSERT INTO `machines` VALUES (1,'Lasersaur','',6.00,15,1),(2,'Laser klein','',1.00,15,1),(3,'CNC-Fräse','',6.00,15,1),(4,'Drehbank gr','',4.00,15,1),(5,'Drehbank kl','',4.00,15,1),(6,'UM Einstein','',1.25,15,4),(7,'UM Newton','',1.25,15,4),(8,'UM Hawking','',1.25,15,4),(9,'X400','',2.00,15,4),(10,'Solidoodle','',1.50,15,4),(11,'p3Steel','',1.25,15,4);
/*!40000 ALTER TABLE `machines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_units`
--

DROP TABLE IF EXISTS `price_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `price_units` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_units`
--

LOCK TABLES `price_units` WRITE;
/*!40000 ALTER TABLE `price_units` DISABLE KEYS */;
INSERT INTO `price_units` VALUES (1,'Stk.'),(2,'h'),(3,'Tag'),(4,'Woche'),(5,'Monat'),(6,'Jahr');
/*!40000 ALTER TABLE `price_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rights`
--

DROP TABLE IF EXISTS `rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rights` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rights`
--

LOCK TABLES `rights` WRITE;
/*!40000 ALTER TABLE `rights` DISABLE KEYS */;
INSERT INTO `rights` VALUES (1,1,1,'2017-06-01','2019-01-01'),(2,1,2,'2017-06-01','2019-01-01'),(3,1,3,'2017-06-01','2019-01-01'),(4,2,1,'2017-06-19','2020-01-01'),(5,2,2,'2017-06-24','2020-01-01');
/*!40000 ALTER TABLE `rights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `table_status`
--

DROP TABLE IF EXISTS `table_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `table_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(45) NOT NULL,
  `last_change` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rec_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `table_status`
--

LOCK TABLES `table_status` WRITE;
/*!40000 ALTER TABLE `table_status` DISABLE KEYS */;
INSERT INTO `table_status` VALUES (1,'tags','2017-08-12 16:41:55',0);
/*!40000 ALTER TABLE `table_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(10) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'0856898896','Claudio Prezzi'),(2,'0079830412','Admin');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` int(11) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'info@fablabwinti.ch','a57b647e8c19ff326a561c4bd31505d4','FabLab Admin',1),(2,'claudio.prezzi@fablabwinti.ch','949a6bf1501f74e475cc98fb651e05c6','Claudio Prezzi',2),(3,'andreas.bachmann@fablabwinti.ch','a57b647e8c19ff326a561c4bd31505d4','Andreas Bachmann',2),(4,'damian.schneider@fablabwinti.ch','a57b647e8c19ff326a561c4bd31505d4','Damian Schneider',2),(5,'patrick.gubelmann@fablabwinti.ch','a57b647e8c19ff326a561c4bd31505d4','Patrick Gubelmann',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'flauth'
--

--
-- Dumping routines for database 'flauth'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-04 12:38:03
