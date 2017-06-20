-- phpMyAdmin SQL Dump
-- version 4.6.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 20. Jun 2017 um 17:20
-- Server-Version: 5.5.54-MariaDB
-- PHP-Version: 5.6.30

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
-- Tabellenstruktur für Tabelle `logs`
--

CREATE TABLE `logs` (
  `lid` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tid` int(11) DEFAULT NULL,
  `mid` int(11) DEFAULT NULL,
  `event` int(11) NOT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `logs`
--

INSERT INTO `logs` (`lid`, `timestamp`, `tid`, `mid`, `event`, `remarks`) VALUES
(1, '2017-06-08 20:24:15', 1, 3, 1, 'Machine login');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `machines`
--

CREATE TABLE `machines` (
  `mid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `machines`
--

INSERT INTO `machines` (`mid`, `name`) VALUES
(1, 'Lasersaur'),
(2, 'Laser klein'),
(3, 'CNC-Fräse'),
(4, 'Drehbank gross'),
(5, 'Drehbank klein'),
(6, '3d-Drucker Einstein'),
(7, '3d-Drucker Newton'),
(8, '3d-Drucker Hawking'),
(9, '3d-Drucker X400'),
(10, '3d-Drucker Solidoodle'),
(11, '3d-Drucker p3Steel');

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
(1, 1, 1, '2017-06-01', '2018-01-01'),
(2, 1, 2, '2017-06-01', '2018-01-01'),
(3, 1, 3, '2017-06-01', '2018-01-11'),
(4, 2, 1, '2017-06-20', '2018-01-01'),
(5, 2, 2, '2017-06-25', '2017-07-01');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tags`
--

CREATE TABLE `tags` (
  `tid` int(11) NOT NULL,
  `uid` varchar(10) NOT NULL,
  `owner` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Daten für Tabelle `tags`
--

INSERT INTO `tags` (`tid`, `uid`, `owner`) VALUES
(1, '0856898896', 'Claudio Prezzi'),
(2, '0079830412', 'Admin');

--
-- Indizes der exportierten Tabellen
--

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
-- Indizes für die Tabelle `rights`
--
ALTER TABLE `rights`
  ADD PRIMARY KEY (`rid`);

--
-- Indizes für die Tabelle `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tid`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `logs`
--
ALTER TABLE `logs`
  MODIFY `lid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `machines`
--
ALTER TABLE `machines`
  MODIFY `mid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT für Tabelle `rights`
--
ALTER TABLE `rights`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT für Tabelle `tags`
--
ALTER TABLE `tags`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
