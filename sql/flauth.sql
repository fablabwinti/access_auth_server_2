-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 08. Jun 2018 um 17:01
-- Server-Version: 10.0.32-MariaDB
-- PHP-Version: 5.6.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `flauth`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `articles`
--

CREATE TABLE `articles` (
  `aid` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `min_periods` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `articles`
--

INSERT INTO `articles` (`aid`, `title`, `description`, `url`, `price`, `uid`, `min_periods`, `createdAt`, `updatedAt`) VALUES
(1, 'Sperrholz 3mm', 'Sperrholz Pappel\r\n600 x 400 x 4 mm', '', '5.00', 1, 1, '2017-01-01 00:00:00', '2018-05-04 17:57:17'),
(2, 'MDF 3mm', 'MDF\r\n600 x 400 x 3 mm', '', '2.50', 1, 1, '2018-04-30 11:29:00', '2018-05-04 17:58:17'),
(3, 'Acryl klar (600x400)', 'Acrylglas (PMMA) klar\r\n600 x 400 x 3 mm', '', '24.00', 1, 1, '2018-04-30 11:29:00', '2018-05-04 17:58:17'),
(4, 'Acryl klar (400x300)', 'Acrylglas (PMMA) klar\r\n400 x 300 x 3 mm', '', '12.00', 1, 1, '2018-05-01 11:42:44', '2018-05-04 17:58:17'),
(50, 'Ausdruck/Kopie A4 (sw, einseitig)', 'Ausdruck/Kopie A4 (einseitig, schwarz/weiss)', '', '0.15', 1, 1, '2018-05-04 17:12:24', '2018-05-04 17:58:17'),
(51, 'Ausdruck/Kopie A4 (sw, doppelseitig)', 'Ausdruck/Kopie A4 (doppelseitig, schwarz/weiss)', '', '0.30', 1, 1, '2018-05-04 17:16:28', '2018-05-04 17:58:17'),
(52, 'Ausdruck/Kopie A4 (farbig, einseitig)', 'Ausdruck/Kopie A4 (einseitig, farbig)', '', '0.50', 1, 1, '2018-05-04 17:13:42', '2018-05-04 17:58:17'),
(53, 'Ausdruck/Kopie A4 (farbig, doppelseitig)', 'Ausdruck/Kopie A4 (doppelseitig, farbig)', '', '1.00', 1, 1, '2018-05-04 17:16:56', '2018-05-04 17:58:17'),
(100, 'Fidget Spinner', 'Kit: Fidget Spinner', '', '8.00', 1, 1, '2018-05-04 16:30:03', '2018-05-04 17:58:17'),
(101, 'Bristlebot', 'Kit: Bristlebot', '', '10.00', 1, 1, '2018-05-04 16:31:05', '2018-05-04 17:58:17'),
(102, 'GetInLine', 'Kit: GetInLine Robot', '', '18.00', 1, 1, '2018-05-04 16:31:53', '2018-05-04 17:58:17'),
(103, 'Gartenlaterne (ungelötet)', 'Kit: Solar-Gartenlaterne (ungelötet)', '', '18.00', 1, 1, '2018-05-04 16:32:34', '2018-05-04 17:58:17'),
(104, 'Gartenlaterne (gelötet)', 'Kit: Solar-Gartenlaterne (SMD gelötet)', '', '22.00', 1, 1, '2018-05-04 16:33:51', '2018-05-04 17:58:17'),
(105, 'Senso', 'Kit: Senso', '', '30.00', 1, 1, '2018-05-04 16:35:48', '2018-05-04 17:58:17'),
(106, '3x5 LED-Matrix', 'Kit: 3x5 LED-Matrix', '', '30.00', 1, 1, '2018-05-04 16:36:21', '2018-05-04 17:58:17'),
(200, 'Getränk 5dl PET', 'Getränk 5dl PET (Mineral, Cola, Fanta, Eistee, Shorley...)', '', '2.50', 1, 1, '2018-05-04 16:27:37', '2018-05-04 17:58:17'),
(201, 'Bier', 'Bier', '', '4.00', 1, 1, '2018-05-04 16:28:26', '2018-05-04 17:58:17'),
(203, 'Kaffee', 'Kaffee (Kapsel)', '', '1.00', 1, 1, '2018-05-04 16:29:16', '2018-05-04 17:58:17'),
(300, 'Lagerschublade', 'Lagerschublade unter Laser \r\nfür 1 Woche', '', '2.50', 5, 1, '2018-05-01 11:42:44', '2018-05-04 16:56:57'),
(301, 'Lagerbox', 'Lagerbox im weissen Regal \r\nfür 4 Wochen', '', '1.00', 5, 4, '2018-05-01 11:42:44', '2018-05-04 16:56:26');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `events`
--

CREATE TABLE `events` (
  `eid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `events`
--

INSERT INTO `events` (`eid`, `name`) VALUES
(1, 'Machine started'),
(2, 'Machine start error'),
(3, 'Machine shutdown'),
(4, 'Tag login'),
(5, 'Tag logout'),
(6, 'Tag error'),
(7, 'Manual correction'),
(8, 'Product Sale');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `invoices`
--

CREATE TABLE `invoices` (
  `iid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `total` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payedAt` datetime DEFAULT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `invoices`
--

INSERT INTO `invoices` (`iid`, `tid`, `name`, `total`, `createdAt`, `updatedAt`, `payedAt`, `uid`) VALUES
(1, 1, 'Claudio Prezzi', '29.00', '2018-05-01 23:08:13', '2018-06-08 16:16:52', '2018-06-08 16:16:03', 1),
(4, 1, 'Claudio Prezzi', '9.00', '2018-05-04 18:34:08', '2018-05-04 18:34:08', NULL, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `logs`
--

CREATE TABLE `logs` (
  `lid` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mid` int(11) DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `tid` int(11) DEFAULT NULL,
  `eid` int(11) NOT NULL,
  `remarks` text,
  `iid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `logs`
--

INSERT INTO `logs` (`lid`, `timestamp`, `mid`, `aid`, `tid`, `eid`, `remarks`, `iid`) VALUES
(1, '2017-06-08 20:24:15', 3, NULL, 1, 4, NULL, 1),
(2, '2017-06-08 21:15:00', 3, NULL, 1, 5, NULL, 1),
(3, '2018-01-21 14:15:00', 1, NULL, 0, 1, '', NULL),
(4, '2018-04-30 14:00:00', 6, NULL, 1, 4, '', 1),
(5, '2018-04-30 14:37:00', 6, NULL, 1, 5, '', 1),
(6, '2018-05-04 14:40:12', NULL, 1, 1, 8, NULL, 4),
(7, '2018-05-04 14:54:16', NULL, 301, 1, 8, NULL, 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `machines`
--

CREATE TABLE `machines` (
  `mid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `config` varchar(100) DEFAULT NULL,
  `price` decimal(5,2) NOT NULL,
  `period` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `min_periods` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `machines`
--

INSERT INTO `machines` (`mid`, `name`, `config`, `price`, `period`, `uid`, `min_periods`) VALUES
(1, 'Lasersaur', '', '6.00', 15, 2, 1),
(2, 'Laser klein', '', '1.00', 15, 2, 1),
(3, 'CNC-Fräse', '', '6.00', 15, 2, 1),
(4, 'Drehbank gr', '', '4.00', 15, 2, 1),
(5, 'Drehbank kl', '', '4.00', 15, 2, 1),
(6, 'UM Einstein', '', '1.25', 15, 2, 4),
(7, 'UM Newton', '', '1.25', 15, 2, 4),
(8, 'UM Hawking', '', '1.25', 15, 2, 4),
(9, 'X400', '', '2.00', 15, 2, 4),
(10, 'Solidoodle', '', '1.50', 15, 2, 4),
(11, 'p3Steel', '', '1.25', 15, 2, 4),
(12, 'Rostock Delta', '', '2.00', 15, 2, 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `price_units`
--

CREATE TABLE `price_units` (
  `uid` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `price_units`
--

INSERT INTO `price_units` (`uid`, `name`) VALUES
(1, 'Stk.'),
(2, 'Min.'),
(3, 'Std.'),
(4, 'Tag'),
(5, 'Woche'),
(6, 'Monat'),
(7, 'Jahr');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rights`
--

CREATE TABLE `rights` (
  `rid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `rights`
--

INSERT INTO `rights` (`rid`, `tid`, `mid`, `start`, `end`) VALUES
(1, 1, 1, '2017-06-01', '2019-01-01'),
(2, 1, 2, '2017-06-01', '2019-01-01'),
(3, 1, 3, '2017-06-01', '2019-01-01'),
(4, 2, 1, '2017-06-19', '2020-01-01'),
(5, 2, 2, '2017-06-24', '2020-01-01');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `table_status`
--

CREATE TABLE `table_status` (
  `id` int(11) NOT NULL,
  `table` varchar(45) NOT NULL,
  `last_change` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rec_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `table_status`
--

INSERT INTO `table_status` (`id`, `table`, `last_change`, `rec_count`) VALUES
(1, 'tags', '2017-08-12 16:41:55', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tags`
--

CREATE TABLE `tags` (
  `tid` int(11) NOT NULL,
  `uid` varchar(10) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Daten für Tabelle `tags`
--

INSERT INTO `tags` (`tid`, `uid`, `name`) VALUES
(1, '0856898896', 'Claudio Prezzi'),
(2, '0079830412', 'Admin'),
(3, '0599013477', 'Tag 1'),
(4, '0598580901', 'Tag 2'),
(5, '0597799173', 'Tag 3'),
(6, '0599314549', 'Tag 4'),
(7, '0599455413', 'Tag 5');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`uid`, `username`, `password_hash`, `name`, `role`) VALUES
(1, 'info@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'FabLab Admin', 1),
(2, 'claudio.prezzi@fablabwinti.ch', '52a824bf40498497cf2d14b0f687c3e5', 'Claudio Prezzi', 2),
(3, 'andreas.bachmann@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'Andreas Bachmann', 2),
(4, 'damian.schneider@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'Damian Schneider', 2),
(5, 'patrick.gubelmann@fablabwinti.ch', 'a57b647e8c19ff326a561c4bd31505d4', 'Patrick Gubelmann', 2);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`aid`);

--
-- Indizes für die Tabelle `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eid`);

--
-- Indizes für die Tabelle `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`iid`);

--
-- Indizes für die Tabelle `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`lid`);

--
-- Indizes für die Tabelle `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`mid`) USING BTREE;

--
-- Indizes für die Tabelle `price_units`
--
ALTER TABLE `price_units`
  ADD PRIMARY KEY (`uid`);

--
-- Indizes für die Tabelle `rights`
--
ALTER TABLE `rights`
  ADD PRIMARY KEY (`rid`);

--
-- Indizes für die Tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indizes für die Tabelle `table_status`
--
ALTER TABLE `table_status`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tid`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `articles`
--
ALTER TABLE `articles`
  MODIFY `aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;
--
-- AUTO_INCREMENT für Tabelle `events`
--
ALTER TABLE `events`
  MODIFY `eid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT für Tabelle `invoices`
--
ALTER TABLE `invoices`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT für Tabelle `logs`
--
ALTER TABLE `logs`
  MODIFY `lid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT für Tabelle `machines`
--
ALTER TABLE `machines`
  MODIFY `mid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT für Tabelle `price_units`
--
ALTER TABLE `price_units`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT für Tabelle `rights`
--
ALTER TABLE `rights`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT für Tabelle `table_status`
--
ALTER TABLE `table_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `tags`
--
ALTER TABLE `tags`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
