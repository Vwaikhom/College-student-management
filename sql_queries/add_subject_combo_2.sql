DROP PROCEDURE IF EXISTS ADD_SUBJECT_COMBO_2;
DELIMITER $$
CREATE PROCEDURE ADD_SUBJECT_COMBO_2(
	aecc2 VARCHAR(25), sec2 VARCHAR(25), vac3 VARCHAR(25), vac4 VARCHAR(25), STUDENT_ID INT
)
BEGIN
	START TRANSACTION;
			SET @LAST_UPDATED_ID := 0;
			UPDATE student_semester SET AECC = aecc2,SEC = sec2,VAC1 = vac3, VAC2 = vac4, ID = (SELECT @LAST_UPDATED_ID := ID) WHERE STUDENT_PROFILE_ID = STUDENT_ID AND SEMESTER = 2;
                     
            INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) VALUES (YEAR(curdate()),@LAST_UPDATED_ID,"AECC",1,aecc2) 
			ON DUPLICATE KEY UPDATE SUB_CODE = VALUES(SUB_CODE);
			INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) VALUES (YEAR(curdate()),@LAST_UPDATED_ID,"SEC",1,sec2) 
			ON DUPLICATE KEY UPDATE SUB_CODE = VALUES(SUB_CODE);
			INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) VALUES (YEAR(curdate()),@LAST_UPDATED_ID,"VAC3",1,vac3) 
			ON DUPLICATE KEY UPDATE SUB_CODE = VALUES(SUB_CODE);
			INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) VALUES (YEAR(curdate()),@LAST_UPDATED_ID,"VAC4",2,vac4) 
			ON DUPLICATE KEY UPDATE SUB_CODE = VALUES(SUB_CODE);
            
	COMMIT;
END $$

DELIMITER ;