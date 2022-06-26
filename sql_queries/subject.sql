SELECT s.STUDENT_NAME, s.ID, p.PAPER, ac.IA, ac.EA FROM student_profile s 
LEFT JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID
LEFT JOIN academic_record ac ON sem.ID = ac.STUDENT_SEMESTER_ID
LEFT JOIN papers p ON ac.PAPER_ID = p.PAPER_ID WHERE sem.DSC = "PHC";