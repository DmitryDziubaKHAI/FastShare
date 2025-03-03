
import { MutableRefObject } from 'react';
import * as React from "react";

type HandleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => void;
type HandleAddClick = (fileInputRef: MutableRefObject<HTMLInputElement | null>) => void;
type HandleUploadClick = (
    files: File[], 
    password: string, 
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
) => Promise<void>;
type HandleDeleteFile = (index: number, files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>>) => void;
type TruncateFileName = (name: string, maxLength: number) => string;

const handleFileChange: HandleFileChange = (event, setFiles) => {
    if (event.target.files) {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
};

const handleAddClick: HandleAddClick = (fileInputRef) => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
};

const handleUploadClick: HandleUploadClick = async (files, password, setFiles) => {
    if (files.length === 0) {
        alert("No files selected");
        return;
    }

    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        
        if (password) {
            formData.append('password', password);
        }

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const result = await response.json();

        if (result.success) {
            alert(`Successfully uploaded ${files.length} files!`);
            setFiles([]);
        } else {
            alert(`Upload failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload files. Please try again.');
    }
};

const handleDeleteFile: HandleDeleteFile = (index, files, setFiles) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
};

const truncateFileName: TruncateFileName = (name, maxLength) => {
    if (name.length > maxLength) {
        return `${name.substring(0, maxLength)}...`;
    }
    return name;
};

const handleDownloadClick = async (fileId: string, password?: string) => {
    try {
        const response = await fetch(`/download/${fileId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            const error = await response.text();
            alert(error || 'Failed to download file');
        }
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download file');
    }
};

export { 
    handleFileChange, 
    handleAddClick, 
    handleUploadClick, 
    handleDeleteFile, 
    truncateFileName, 
    handleDownloadClick 
};