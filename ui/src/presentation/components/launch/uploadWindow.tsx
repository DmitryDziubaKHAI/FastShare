 // src/launch/uploadWindow.tsx
import {
  Box, Button, TextField, IconButton,
  List, ListItem, ListItemText
} from '@mui/material';
import Grid from '@mui/material/Grid';

import './file_container.css';
import './addBtn.css';

import { useRef, useState } from 'react';
import CloudUploadIcon     from '@mui/icons-material/CloudUpload';
import AddIcon             from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon          from '@mui/icons-material/Delete';
import GetAppIcon          from '@mui/icons-material/GetApp';
import DeleteSweepIcon     from '@mui/icons-material/DeleteSweep';
import UndoIcon            from '@mui/icons-material/Undo';

import MyFilesModal        from './MyFilesModal';

interface UploadedWindowProps {
  onBack: () => void;
}

const UploadedWindow: React.FC<UploadedWindowProps> = ({ onBack }) => {
  /* ------------------------------------------------------------------ state */
  const [files,     setFiles]     = useState<File[]>([]);
  const [password,  setPassword]  = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------------------------------------------------- handlers */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleDeleteFile = (idx: number) =>
    setFiles(prev => prev.filter((_, i) => i !== idx));

  /* ------------------------------------------- upload / download / delete */
  const uploadFiles = async () => {
    if (!files.length || !password.trim()) {
      return alert('Please select files and enter a password.');
    }

    const fd = new FormData();
    fd.append('password', password.trim());
    files.forEach(f => fd.append('files', f));

    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body  : fd,
      credentials: 'include'
    });

    if (!res.ok) {
      console.error(await res.text());
      return alert('Upload failed');
    }

    alert('Files uploaded!');
    setFiles([]); setPassword('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadFiles = async () => {
    if (!password.trim()) return alert('Enter password first');

    const res = await fetch('http://localhost:3000/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.trim() }),
      credentials: 'include'
    });

    if (!res.ok) {
      console.error(await res.text());
      return alert('No files found or error occurred.');
    }

    const ct = res.headers.get('Content-Type');
    /* ≥2 файлів — бек повертає JSON із base64; 1 файл — octet-stream */
    if (ct?.includes('application/json')) {
      const list: { filename: string; file: string }[] = await res.json();
      list.forEach(f => saveBlob(
        new Blob([Uint8Array.from(atob(f.file), c => c.charCodeAt(0))]),
        f.filename
      ));
    } else {
      const blob = await res.blob();
      const cd   = res.headers.get('Content-Disposition') ?? '';
      const name = cd.split('filename=')[1]?.replace(/"/g, '') || 'download';
      saveBlob(blob, name);
    }
  };

  const deleteFilesByPassword = async () => {
    if (!password.trim()) return;
    if (!window.confirm(
      'Delete ALL files with this password?\nThis cannot be undone!'
    )) return;

    const res = await fetch('http://localhost:3000/files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.trim() }),
      credentials: 'include'
    });

    if (!res.ok) {
      console.error(await res.text());
      return alert('Delete failed');
    }

    const { count } = await res.json();
    alert(`Deleted ${count} files from server`);
    setPassword('');
  };

  /* -------------------------------------------------------------- helpers */
  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.append(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------------------------------------- render */
  return (
    <Box className="file-container">
      <Grid container spacing={1} sx={{ p: 2, width: '100%', height: '100%', justifyContent: 'center' }}>
        {/* ------------------------------ left column (inputs & buttons) */}
        <Grid item container spacing={1} xs={5}>
          {/* add / my files */}
          <Grid item xs={12} container spacing={1}>
            <Grid item>
              <IconButton className="wave-button" onClick={() => fileInputRef.current?.click()}>
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{ height: 40 }} onClick={() => setModalOpen(true)}>
                My&nbsp;Files
              </Button>
            </Grid>
          </Grid>

          {/* hidden input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* password */}
          <Grid item xs={12}>
            <TextField
              label="Password for files"
              type="password"
              variant="filled"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>

          {/* action buttons */}
          <Grid item container spacing={1} xs={12}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
                onClick={uploadFiles}
              >
                Upload files
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<GetAppIcon />}
                fullWidth
                onClick={downloadFiles}
              >
                Download files
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                fullWidth
                onClick={deleteFilesByPassword}
              >
                Clear {password && '& Delete'} Files
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* ------------------------------ right column (selected files) */}
        <Grid item container xs={7} sx={{ height: '100%' }}>
          <Grid item xs={12} sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List>
              {files.map((f, i) => (
                <Box key={i} sx={{ borderRadius: 1, boxShadow: 1, mb: 1, '&:hover': { boxShadow: 3 } }}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDeleteFile(i)} sx={{ '&:hover': { color: 'error.main' } }}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <InsertDriveFileIcon sx={{ mr: 2 }} />
                    <ListItemText
                      primary={f.name}
                      secondary={`${(f.size / 1024).toFixed(2)} KB`}
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
            <IconButton onClick={onBack}><UndoIcon /></IconButton>
          </Grid>
        </Grid>
      </Grid>

      {/* modal with user files */}
      <MyFilesModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default UploadedWindow;
