DELIMITER $$
CREATE TRIGGER MANAGE_ID
	BEFORE INSERT
	ON test_profile FOR EACH ROW 
BEGIN
	DECLARE bsc_counter INT default 0;
    DECLARE ba_counter INT default 0;
	IF NEW.COURSE = 'BS' THEN
		SET bsc_counter = (SELECT COUNT(*) FROM test_profile WHERE COURSE = 'BS') + 1;
		SET NEW.ID = CONCAT('BS22',LPAD((bsc_counter),3,0));
	ELSEIF NEW.COURSE = 'BA' THEN
		SET ba_counter = (SELECT COUNT(*) FROM test_profile WHERE COURSE = 'BA') + 1;
		-- INSERT INTO test_profile(ID)
        SET NEW.ID = CONCAT('BA22',LPAD((ba_counter),3,0));
	END IF;
END$$
DELIMITER ;

