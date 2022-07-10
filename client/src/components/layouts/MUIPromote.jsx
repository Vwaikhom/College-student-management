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
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../hooks/useAuth';

export const MUIPromote = (props) => {

    const year = localStorage.getItem("currentYear");

    const [open, setOpen] = useState(false);

    const { auth } = useAuth();

    const axiosPrivate = useAxiosPrivate();

    const confirmPromote = async () => {
        const response = await axiosPrivate.post(`/Promotion/${props.data.sem}/${year}/${props.data.student.ID}`, {data: props.data.student});
        if(response.statusText==="OK"){
            toast.success('Promoted Successfully!', {
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

    const back_subs = [];

    const checkBack = () => {
        if(props.data.student.BACK_SUBS === 0){
            confirmPromote();
        } else{ 
            setOpen(true);
        }
    }

    return(
        <>
            <Button color='warning' disabled={auth.role !== "Admin"} onClick={() => checkBack()}>Promote</Button>
            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='dialog-title' aria-describedby='dialog-description'>
                <DialogTitle id='dialog-title'>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id='dialog-description'>
                        Are you sure you want to promote? Student has <b>{props.data.student.BACK_SUBS}</b> back subject(s)  
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={confirmPromote}>Submit</Button>
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