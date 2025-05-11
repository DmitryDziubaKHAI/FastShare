import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';

interface FileInfo {
  id: number;
  filename: string;
  uploaded_at: string;
}

interface MyFilesModalProps {
  open: boolean;
  onClose: () => void;
}

const MyFilesModal: React.FC<MyFilesModalProps> = ({ open, onClose }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      fetch('http://localhost:3000/my-files', {
        credentials: 'include',
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch files');
          const data = await res.json();
          setFiles(data.files);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>My Uploaded Files</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : files.length === 0 ? (
          <Typography>No files uploaded yet.</Typography>
        ) : (
          <List>
            {files.map((file) => (
              <ListItem key={file.id} divider>
                <ListItemText
                  primary={file.filename}
                  secondary={new Date(file.uploaded_at).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyFilesModal; 