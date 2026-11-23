CREATE DATABASE  IF NOT EXISTS `ticketforge_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ticketforge_db`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ticketforge_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `artist_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,'Stray Kids'),(3,'NEONIX'),(5,'Aurora Lights'),(6,'Coldplay');
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cast_members`
--

DROP TABLE IF EXISTS `cast_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cast_members` (
  `cast_member_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`cast_member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cast_members`
--

LOCK TABLES `cast_members` WRITE;
/*!40000 ALTER TABLE `cast_members` DISABLE KEYS */;
INSERT INTO `cast_members` VALUES (1,'Mateo Ríos (Hamlet)'),(3,'Valentina Cruz (Ofelia)'),(6,'Camila Torres (Narda)'),(7,'Sebastián Mora (Guardián del Bosque)'),(8,'Camila Torres (Narda)'),(9,'Sebastián Mora (Guardián del Bosque)');
/*!40000 ALTER TABLE `cast_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concert_artists`
--

DROP TABLE IF EXISTS `concert_artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `concert_artists` (
  `event_id` int NOT NULL,
  `artist_id` int NOT NULL,
  `presentation_time` time DEFAULT NULL,
  PRIMARY KEY (`event_id`,`artist_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `concert_artists_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `concert_details` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `concert_artists_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert_artists`
--

LOCK TABLES `concert_artists` WRITE;
/*!40000 ALTER TABLE `concert_artists` DISABLE KEYS */;
INSERT INTO `concert_artists` VALUES (2,1,'21:00:00'),(2,3,'20:00:00'),(6,5,'19:00:00'),(6,6,'20:30:00');
/*!40000 ALTER TABLE `concert_artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concert_details`
--

DROP TABLE IF EXISTS `concert_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `concert_details` (
  `event_id` int NOT NULL,
  `presentation_schedule` varchar(255) NOT NULL,
  PRIMARY KEY (`event_id`),
  CONSTRAINT `concert_details_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert_details`
--

LOCK TABLES `concert_details` WRITE;
/*!40000 ALTER TABLE `concert_details` DISABLE KEYS */;
INSERT INTO `concert_details` VALUES (2,'Presentación de artistas'),(6,'Aurora Lights: 19:00. Coldplay: 20:30.'),(11,'Horario pendiente');
/*!40000 ALTER TABLE `concert_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `location` varchar(150) NOT NULL,
  `date_time` datetime NOT NULL,
  `category` enum('concert','sports','theater') NOT NULL,
  `min_price` decimal(10,2) NOT NULL,
  `max_price` decimal(10,2) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'Stray Kids - StrayCity','Bogota','2027-09-09 20:00:00','concert',50000.00,120000.00,'Evento creado para probar la compra de boletos en TicketForge.','/images/event-1794743534925-442617656.jpg'),(3,'Hamlet','Bogota','2026-12-20 18:00:00','theater',30000.00,80000.00,'Obra creada para probar el elenco y los intermedios.','/images/hamlet.jpg'),(4,'Junior vs. Jaguares','Bogota','2026-12-22 18:00:00','sports',40000.00,100000.00,'Evento deportivo creado para probar los equipos y el marcador.','/images/junior-vs-jaguares.jpg'),(6,'Coldplay - Music of the Spheres','Bogota','2027-05-20 19:00:00','concert',55000.00,130000.00,'Evento actualizado para probar el endpoint PUT.','/images/coldplay.jpg'),(7,'Narda La Niña Guardiana','Bogota','2027-05-20 19:00:00','theater',50000.00,120000.00,'Prueba de validación.','/images/narda.jpg'),(9,'Santa Fe vs. Millonarios','Bogota','2027-06-15 00:00:00','sports',40000.00,100000.00,'Evento deportivo creado para probar los detalles deportivos.','/images/santa-fe-vs-millonarios.jpg'),(10,'La última función','Teatro Colón, Bogotá','2026-10-15 19:00:00','theater',40000.00,85000.00,'Una compañía teatral se prepara para presentar su última obra. Entre secretos, despedidas y decisiones inesperadas, los actores descubrirán que la función más importante de sus vidas está a punto de comenzar.','/images/la-ultima-funcion.jpg'),(11,'Neon Dreams Glow Festival 2027','Movistar Arena, Bogotá','2027-03-20 18:30:00','concert',85000.00,250000.00,'Festival de música electrónica con artistas nacionales e internacionales, espectáculos de luces y experiencias audiovisuales en vivo.','/images/event-1794784621262-814987154.jpg'),(13,'Festival Rock Legends','Movistar Arena, Bogotá','2025-08-15 19:00:00','concert',120000.00,250000.00,'Un festival musical con grandes bandas de rock y una noche llena de música.','/images/festival-rock-legends.jpg'),(14,'Final Copa de Campeones','Estadio El Campín, Bogotá','2025-09-20 17:00:00','sports',80000.00,180000.00,'Una emocionante final de fútbol entre dos grandes equipos.','/images/final-copa-campeones.jpg');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_tags`
--

DROP TABLE IF EXISTS `review_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_tags` (
  `review_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`review_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `review_tags_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`) ON DELETE CASCADE,
  CONSTRAINT `review_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_tags`
--

LOCK TABLES `review_tags` WRITE;
/*!40000 ALTER TABLE `review_tags` DISABLE KEYS */;
INSERT INTO `review_tags` VALUES (5,1),(5,3),(5,4);
/*!40000 ALTER TABLE `review_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `seat_quality` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,2,2,5,'Excelente evento, muy buena organización.','Excelente'),(5,2,10,5,'Excelente obra de teatro. Los actores realizaron una presentación increíble.','Muy cómoda y con buena visibilidad del escenario.');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sport_details`
--

DROP TABLE IF EXISTS `sport_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_details` (
  `event_id` int NOT NULL,
  `home_team` varchar(100) NOT NULL,
  `away_team` varchar(100) NOT NULL,
  `scoreboard` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  CONSTRAINT `sport_details_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sport_details`
--

LOCK TABLES `sport_details` WRITE;
/*!40000 ALTER TABLE `sport_details` DISABLE KEYS */;
INSERT INTO `sport_details` VALUES (4,'Junior','Jaguares','Por jugar'),(9,'Santa Fe','Millonarios','Por jugar');
/*!40000 ALTER TABLE `sport_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (3,'Buen ambiente'),(2,'Buen sonido'),(4,'Buena actuación'),(1,'Buena organización');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theater_cast`
--

DROP TABLE IF EXISTS `theater_cast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theater_cast` (
  `event_id` int NOT NULL,
  `cast_member_id` int NOT NULL,
  PRIMARY KEY (`event_id`,`cast_member_id`),
  KEY `cast_member_id` (`cast_member_id`),
  CONSTRAINT `theater_cast_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `theater_details` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `theater_cast_ibfk_2` FOREIGN KEY (`cast_member_id`) REFERENCES `cast_members` (`cast_member_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theater_cast`
--

LOCK TABLES `theater_cast` WRITE;
/*!40000 ALTER TABLE `theater_cast` DISABLE KEYS */;
INSERT INTO `theater_cast` VALUES (3,1),(3,3),(10,7),(7,8),(3,9),(7,9);
/*!40000 ALTER TABLE `theater_cast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theater_details`
--

DROP TABLE IF EXISTS `theater_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theater_details` (
  `event_id` int NOT NULL,
  `intermissions` text NOT NULL,
  PRIMARY KEY (`event_id`),
  CONSTRAINT `theater_details_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theater_details`
--

LOCK TABLES `theater_details` WRITE;
/*!40000 ALTER TABLE `theater_details` DISABLE KEYS */;
INSERT INTO `theater_details` VALUES (3,'Primer intermedio: 30 minutos. Segundo intermedio: 15 minutos.'),(7,'Primer intermedio: 15 minutos.'),(10,'Intermedios pendientes de definir');
/*!40000 ALTER TABLE `theater_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `purchase_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `paid_price` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `ticket_type` varchar(100) DEFAULT NULL,
  `seat_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `uq_event_type_seat` (`event_id`,`ticket_type`,`seat_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (2,2,2,'2026-11-03 21:10:07',85000.00,'upcoming',NULL,NULL),(5,2,3,'2026-11-05 22:24:24',50000.00,'upcoming',NULL,NULL),(7,2,4,'2026-11-14 19:22:02',100000.00,'upcoming',NULL,NULL),(8,2,6,'2026-11-14 20:29:44',130000.00,'upcoming','Platea VIP','S-4763'),(9,2,10,'2026-11-14 20:56:56',40000.00,'completed','General Preferencial','S-TEST01'),(10,2,7,'2026-11-14 21:30:16',50000.00,'upcoming','General Preferencial','S-4459'),(11,2,11,'2026-11-15 06:06:13',250000.00,'upcoming','Platea VIP','S-2445'),(12,2,9,'2026-11-15 08:01:09',100000.00,'upcoming','Platea VIP','S-8445'),(13,2,13,'2025-08-10 14:30:00',120000.00,'completed','General Preferencial','A-101'),(14,2,14,'2025-09-15 16:00:00',80000.00,'completed','General Preferencial','B-205'),(15,15,3,'2026-11-15 11:37:02',80000.00,'upcoming','Platea VIP','S-231');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Maria Perez','juan@gmail.com','$2b$12$Pwjt5pp2CaLQ6ydKr9cVXuD.yE0h94DAgjYwr2ez3rUF64PF0gAzy','user'),(4,'Maria Lopez','maria@gmail.com','$2b$12$SUa7raVY6osGvdQ8cPmZj.KtBnw/PUBs8QJuZJowvbwZ8KCzosm2q','admin'),(10,'Marco Puli','marco@gmail.com','$2b$12$Tf9wR40n7PBykiyP1pH52eGCspXt8jM43KBnypGu/xizZ9o6tTzq.','user'),(12,'Usuario Bcrypt','bcrypt.test@gmail.com','$2b$12$jsGihBuARa52uRqcMOCl4uKFgZAC1c2Wuo7p4BGvf6O0HWBYR8N56','user'),(13,'Usuario nuevoX','bcrypt.test2@gmail.com','$2b$12$X/ZCrOG8.cbbHUZV/EgXrOn2BVSQdYDA904qpm0jOqwv/S1NuG0A6','user'),(14,'johana lopez','lopez@gmail.com','$2b$12$b69F9akaF7o1lamz9.D7IOi8zt4ERwubPKBiOC8LuyVV82xpLRl.u','user'),(15,'Ana martinez','ana@gmail.com','$2b$12$ClP3vH9FRd09XOa9lm7QyueIA1wJqGrPP5L3jIxGzVg75bzqzZqmK','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-15 19:15:34
