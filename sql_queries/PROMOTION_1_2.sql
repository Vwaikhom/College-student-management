DROP PROCEDURE IF EXISTS PROMOTE_SEM_1_2;
DELIMITER $$
CREATE PROCEDURE PROMOTE_SEM_1_2()
BEGIN
	START TRANSACTION;
			INSERT INTO student_semester (STUDENT_PROFILE_ID, SEM_YEAR, SEMESTER, DSC, DSE, PROMOTED) 
				SELECT f.STUDENT_PROFILE_ID, sem.SEM_YEAR, 2 AS SEMESTER, sem.DSC,sem.DSE, "Y" FROM 
				student_semester sem 
				JOIN student_fee f ON f.STUDENT_SEMESTER_ID = sem.ID AND sem.SEMESTER = 1 AND f.TYPE = "ADM FEE" AND f.PAID = "Y"
				JOIN student_fee f1 ON f1.STUDENT_SEMESTER_ID = sem.ID AND sem.SEMESTER = 1 AND f1.TYPE = "EXM FEE" AND f1.PAID = "Y"; 
			INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) 
				SELECT sem.SEM_YEAR,sem.ID,"CORE",p.PAPER,p.SUB_CODE FROM student_semester sem, papers p WHERE p.COURSE = "CORE" AND p.SUB = sem.DSC AND p.SEMESTER = 2 AND sem.SEMESTER = 2;
	COMMIT;
END $$

DELIMITER ;