
-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `uid` varchar(255),
  `name` varchar(255),
  `avatarUrl` varchar(255),
  `sex` int(5),
  `city` varchar(255),
  `language` varchar(255),
  `isVip` int(2),
  `province` varchar(255),
  `country` varchar(255),
  `privilege` varchar(255),
  `unionid` varchar(255),
  `gem` int(11) NOT NULL,
  `ip` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into users set id=100000,gem=0;

-- ----------------------------
-- Table structure for `room_competition`
-- ----------------------------
DROP TABLE IF EXISTS `room_competition`;
CREATE TABLE `room_competition` (
  `id` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `roomId` INT(10) NOT NULL,
  `id1` INT(10) NOT NULL,
  `id2` INT(10) NOT NULL,
  `id3` INT(10) NOT NULL,
  `id4` INT(10) NOT NULL,
  `data` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `agent`
-- ----------------------------
DROP TABLE IF EXISTS `agent`;
CREATE TABLE `agent` (
  `id` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `phone` VARCHAR(60) NOT NULL,
  `wechat` VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
