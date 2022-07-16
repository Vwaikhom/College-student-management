import { 
    Button, 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogContentText, 
    DialogActions,
    TextField
} 
from '@mui/material';
import { useState, useContext } from 'react';
import React from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../hooks/useAuth';

export const MUIMarks = (props) => {

    const year = localStorage.getItem("currentYear");

    const [open, setOpen] = useState(false);
    const [subject,setSubject] = useState([]);
    //const [updateSubject,setUpdateSubject] = useState([]);
    //const [updateData, setUpdateData] = useState({});
    const { auth } = useAuth();

    const axiosPrivate = useAxiosPrivate();
   


    const handleConfirm = async() =>{
        console.log(subject,props.data.ID);
        const data = {};

        data.subjects = subject;
        data.ID = props.data.ID;
        //console.log(data);
        const result = await axiosPrivate.post(`/AcademicRecords/studentWise/${props.data.year}/${props.data.sem}/${props.data.ID}`,
            {data: data}
        );

        console.log(result);
        setOpen(false);

        if(result.data.message==="Done"){
        toast.success('Updated Successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }
    }

    const handleChange = (sub) => (e) => {
        const newMarks = subject.map(ele => ele.SUB_CODE === sub.SUB_CODE ? { ...ele, [e.target.name] : e.target.value } : ele);
        setSubject(newMarks);
    }

    const handleOpen = () => {
        setOpen(true);
        setSubject(props.data.student.SUBJECTS);
        //setUpdateSubject(props.data.student.SUBJECTS);
    }

    const handleClose = () => {
        setOpen(false);
        setSubject([]);
    }

    return(
        <>
        <Button color='warning' disabled={auth.role !== "Admin"} onClick={handleOpen}>Update</Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby='dialog-title' aria-describedby='dialog-description'>
            <DialogTitle id='dialog-title'>Update Student's Academic Record</DialogTitle>
            <DialogContent>
                <DialogContentText id='dialog-description'><strong>{props.data.student.STUDENT_NAME}</strong></DialogContentText>
                <br />
                {subject.map((sub,index) => (
                    <>       
                    <strong>{sub.SUB_CODE}</strong>     
                    <br />          
                    <TextField  
                        onChange={handleChange(sub)}
                        autoFocus
                        margin='dense'
                        id={sub.IA}
                        name='IA'
                        label='IA'
                        value={sub.IA}
                        type='text'
                        variant="standard"
                        /> 
                    <TextField  
                        onChange={handleChange(sub)}
                        autoFocus
                        margin='dense'
                        id={sub.EA}
                        name='EA'
                        label='EA'
                        value={sub.EA}
                        type='text'
                        variant="standard"
                        /> 
                    <TextField  
                        onChange={handleChange(sub)}
                        autoFocus
                        margin='dense'
                        id={sub.RESULT}
                        name='RESULT'
                        label='Result'
                        value={sub.RESULT}
                        type='text'
                        variant="standard"
                        /> 
                        <br />
                        <br />
                    </>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm}>Submit</Button>
            </DialogActions>
        </Dialog>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </>
    )
}