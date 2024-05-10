import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Box, styled, Snackbar, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MuiAlert from '@mui/material/Alert';

const Input = styled('input')({
  display: 'none',
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UploadImageForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileName(file?.name);
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setToastMessage('Please select an image file.');
      setToastSeverity('warning');
      setOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setToastMessage('Image uploaded successfully!');
      setToastSeverity('success');
      setOpen(true);
      window.location.reload(); // Reload the page after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setToastMessage('Error uploading file.');
      setToastSeverity('error');
      setOpen(true);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 2, maxWidth: 360, width: '100%', mx: 'auto' }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Upload Image 
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Input accept="image/*" id="file-input" type="file" onChange={handleFileChange} />
          <label htmlFor="file-input">
            <StyledButton variant="outlined" component="span" startIcon={<CloudUploadIcon />} fullWidth>
              {fileName || "Choose Image"}
            </StyledButton>
          </label>
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            Upload
          </StyledButton>
        </form>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => handleClose('close')}>
        <Alert onClose={() => handleClose('close')} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadImageForm;
