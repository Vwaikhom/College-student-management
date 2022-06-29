import { 
    Button, 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogContentText, 
    DialogActions
} 
from '@mui/material';
import { useState, useContext } from 'react';
import React from 'react';
import axios from "../../apis/api"
import { AcademicYearContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MUIDialog = (props) => {

    const state = useContext(AcademicYearContext);

    const [open, setOpen] = useState(false);

    const handleConfirm = async() =>{
        console.log(props.data.student.ID, state.year, props.data.sem);
        const result = await axios.delete(`/profile/${state.year}/${props.data.sem}/${props.data.student.ID}`);
        console.log(result);
        setOpen(false);
        if(result.statusText==="OK"){
        toast.success('Deleted Successfully!', {
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

    return(
        <>
        <Button color='warning' onClick={() => setOpen(true)}>Delete</Button>
        <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='dialog-title' aria-describedby='dialog-description'>
            <DialogTitle id='dialog-title'>Confirm</DialogTitle>
            <DialogContent>
                <DialogContentText id='dialog-description'>Are you sure?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
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