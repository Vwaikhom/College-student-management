-- UPDATE STUDENT PROFILE--
DROP PROCEDURE IF EXISTS UPDATE_STUDENT_HONOURS_SUB;
DELIMITER $$
CREATE PROCEDURE UPDATE_STUDENT_HONOURS_SUB(
	honours_sub VARCHAR(25), student_id INT
)
BEGIN
	START TRANSACTION;
			SET @LAST_UPDATED_ID := 0;
			UPDATE student_profile SET SUB = honours_sub WHERE ID = student_id;
			UPDATE student_semester SET DSC = honours_sub, DSE = honours_sub, ID = (SELECT @LAST_UPDATED_ID := ID) WHERE STUDENT_PROFILE_ID = student_id AND SEMESTER = 1;
			DELETE FROM academic_record WHERE STUDENT_SEMESTER_ID = @LAST_UPDATED_ID AND COURSE = "CORE";
			INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,SUB_CODE) 
				SELECT sem.SEM_YEAR, @LAST_UPDATED_ID,"CORE", p.PAPER FROM student_semester sem, papers p WHERE p.COURSE = "CORE" AND p.SUB = honours_sub AND p.SEMESTER = 1 AND sem.ID = @LAST_UPDATED_ID;
	COMMIT;
END $$

DELIMITER ;