import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

interface ConfirmActionModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "error" | "warning" | "success";
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error",
  handleClose,
  handleConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-action-title"
      aria-describedby="confirm-action-description"
    >
      <DialogTitle id="confirm-action-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-action-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} color={confirmColor} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionModal;
