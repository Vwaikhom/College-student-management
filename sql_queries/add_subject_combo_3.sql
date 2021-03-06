DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ADD_SUBJECT_COMBO_3`(
	gec1 VARCHAR(25), vac5 VARCHAR(25), STUDENT_ID INT
)
BEGIN
	START TRANSACTION;
			SET @LAST_UPDATED_ID := 0;
			UPDATE student_semester SET GEC = gec1,VAC1 = vac5, ID = (SELECT @LAST_UPDATED_ID := ID) WHERE STUDENT_PROFILE_ID = STUDENT_ID AND SEMESTER = 3;
                     
            INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) VALUES (YEAR(curdate()),@LAST_UPDATED_ID,"GEC1",1,gec1) 
			ON DUPLICATE KEY UPDATE SUB_CODE = VALUES(SUB_CODE);
			INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) VALUES (YEAR(curdate()),@LAST_UPDATED_ID,"VAC5",1,vac5) 
			ON DUPLICATE KEY UPDATE SUB_CODE = VALUES(SUB_CODE);
            
	COMMIT;
END$$
DELIMITER ;
