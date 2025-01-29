import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface DeleteDependentModalProps {
    open: boolean;
    handleClose: () => void;
    handleDelete: () => void
}

const DeleteDependentModal: React.FC<DeleteDependentModalProps> = ({ open, handleClose, handleDelete }) => {


  return (

    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this member? Health data realted to this member will be deleted permanantly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default DeleteDependentModal