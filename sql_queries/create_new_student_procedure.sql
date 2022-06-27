DROP PROCEDURE IF EXISTS NEW_STUDENT;
DELIMITER $$
CREATE PROCEDURE NEW_STUDENT(
	student_Name varchar(50), uhid varchar(50), sex varchar(10), date_form date, photo varchar(255), present_addr varchar(250), phone varchar(15), permanent_addr varchar(255),
    father_name varchar(50), father_occupation varchar(50), mother_name varchar(50), mother_occupation varchar(50), income INT unsigned, claim varchar(1), 
    dob date, aadhar varchar(16), email varchar(50), student_phone varchar(15), category varchar(10), board varchar(30), school_roll varchar(20), 
    passout int unsigned, program varchar(10), honours_sub VARCHAR(25)
)
BEGIN
	START TRANSACTION;
		INSERT INTO student_profile (UHID, STUDENT_NAME,SEX,DATE_FORM_SUB,PHOTO_URL,PRESENT_ADDRESS,PHONE_NO,PERMANENT_ADDRESS, 
		FATHER_NAME,FATHER_OCCUPATION, MOTHER_NAME,MOTHER_OCCUPATION,ANNUAL_INCOME,CLAIM_FEE_EXEMPTION,DOB,AADHAR_NO,EMAIL_ID,STUDENT_MOBILE,
		CATEGORY, CLASS12_BOARD, CLASS12_ROLL,PASSOUT_YEAR,COURSE,SUB) 
		VALUES (uhid, student_Name, sex, date_form, photo, present_addr,phone,permanent_addr, father_name, father_occupation, mother_name, mother_occupation, income, claim, dob,
		aadhar,email,student_phone,category,board,school_roll,passout,program,honours_sub);
		SET @_LID = LAST_INSERT_ID();
		INSERT INTO student_semester (STUDENT_PROFILE_ID,SEM_YEAR,SEMESTER,DSC,DSE) VALUES (@_LID,YEAR(curdate()),1,honours_sub,honours_sub);
        SET @SEM_LID = LAST_INSERT_ID();
        INSERT INTO academic_record (ACADEMIC_YEAR,STUDENT_SEMESTER_ID,COURSE,PAPER,SUB_CODE) 
			SELECT sem.SEM_YEAR, @SEM_LID,"CORE", p.PAPER, p.SUB_CODE FROM student_semester sem, papers p 
				WHERE p.COURSE = "CORE" AND p.SUB = honours_sub AND p.SEMESTER = 1 AND sem.ID = @SEM_LID;
		INSERT INTO student_fee (STUDENT_PROFILE_ID,STUDENT_SEMESTER_ID,ADM_FEE,EXM_FEE) VALUES (@_LID,@SEM_LID,"PAID","UNPAID");
	COMMIT;
    SELECT ID FROM student_profile WHERE ID = @_LID;
END $$
DELIMITER ;
