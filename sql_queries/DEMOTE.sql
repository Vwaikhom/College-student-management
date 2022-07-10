DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DEMOTE`(
	SEM VARCHAR(25), YEAR VARCHAR(25), ID INT
)
BEGIN
	START TRANSACTION;
-- 			-- UPDATE student_semester SET PROMOTED = "Y" WHERE ID = ID;
--             SET @_SEM_ID = (SELECT ID FROM student_semester WHERE STUDENT_PROFILE_ID = ID AND SEMESTER = SEM AND SEM_YEAR = YEAR);
--             -- SET FOREIGN_KEY_CHECKS = 0;
--             DELETE FROM student_semester WHERE ID = @_SEM_ID;
--             DELETE FROM academic_record WHERE STUDENT_SEMESTER_ID = @_SEM_ID;
--             -- SET FOREIGN_KEY_CHECKS = 1;
--             UPDATE student_semester SET PROMOTED = "N" WHERE ID = ID;
			
			SET @_SEM_ID = (SELECT student_semester.ID FROM student_semester WHERE student_semester.STUDENT_PROFILE_ID = ID AND student_semester.SEMESTER = SEM AND student_semester.SEM_YEAR = YEAR);
            SET @_LAST_SEM = (SEM - 1);
			SET FOREIGN_KEY_CHECKS = 0;
			DELETE student_semester, academic_record 
				FROM student_semester 
				INNER JOIN academic_record ON student_semester.ID = academic_record.STUDENT_SEMESTER_ID
				WHERE student_semester.ID = @_SEM_ID;
			SET FOREIGN_KEY_CHECKS = 1;
            UPDATE student_semester SET PROMOTED = "N" WHERE student_semester.STUDENT_PROFILE_ID = ID AND student_semester.SEMESTER = @_LAST_SEM;
	COMMIT;
END$$
DELIMITER ;
