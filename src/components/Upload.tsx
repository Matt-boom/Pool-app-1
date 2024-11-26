import React, { useState } from 'react';
import axios from 'axios';

const UploadFile: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        
        if (selectedFile) {
            // Validate file type (Excel files)
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                'application/vnd.ms-excel'
            ];
            
            // Validate file size (e.g., max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please upload an Excel file (.xlsx, .xls)');
                setFile(null);
                return;
            }

            if (selectedFile.size > maxSize) {
                setError('File is too large. Maximum file size is 5MB.');
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Leagues created successfully');
            console.log(response.data);
            setError(null);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) 
                ? error.response?.data?.error || 'Error uploading file'
                : 'An unexpected error occurred';
            
            setError(errorMessage);
            console.error(error);
        }
    };

    return (
        <div>
            <input 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={handleFileChange} 
            />
            <button 
                onClick={handleUpload} 
                disabled={!file}
            >
                Upload
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default UploadFile;

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Leagues created successfully');
            console.log(response.data);
            setError(null);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) 
                ? error.response?.data?.error || 'Error uploading file'
                : 'An unexpected error occurred';
            
            setError(errorMessage);
            console.error(error);
        }
    };



    import pandas as pd
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB file size limit

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_excel():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only Excel files are allowed.'}), 400

    try:
        # Secure filename
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save file temporarily
        file.save(filepath)

        # Read Excel file
        data = pd.read_excel(filepath)
        
        # Validate columns
        required_columns = ['Team Name', 'League']
        if not all(col in data.columns for col in required_columns):
            os.remove(filepath)
            return jsonify({'error': 'Invalid file format. Missing required columns.'}), 400

        # Validate all teams have leagues
        if data['League'].isnull().any():
            os.remove(filepath)
            return jsonify({'error': 'All teams must have a league assigned.'}), 400

        # Process data
        leagues = data.groupby('League')['Team Name'].apply(list).to_dict()

        # Optional: Clean up temporary file
        os.remove(filepath)

        return jsonify({'success': 'Leagues created', 'leagues': leagues}), 200

    except Exception as e:
        # Clean up file in case of error
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

    return (
        <div>
            <input 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={handleFileChange} 
            />
            <button 
                onClick={handleUpload} 
                disabled={!file}
            >
                Upload
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default UploadFile;