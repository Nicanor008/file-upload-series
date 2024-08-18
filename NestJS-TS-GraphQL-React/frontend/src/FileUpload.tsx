import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const LOCAL_FILE_UPLOAD_MUTATION = gql`
  mutation LocalfileUpload($file: Upload!) {
    LocalfileUpload(file: $file)
  }
`;

const CLOUDINARY_FILE_UPLOAD_MUTATION = gql`
  mutation CloudinaryfileUpload($file: Upload!) {
    CloudinaryfileUpload(file: $file)
  }
`;

const AWS_FILE_UPLOAD_MUTATION = gql`
  mutation AWSfileUpload($file: Upload!) {
    AWSfileUpload(file: $file)
  }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
//   const [LocalfileUpload, { data, loading, error }] = useMutation(LOCAL_FILE_UPLOAD_MUTATION);
  const [CloudinaryfileUpload, { data, loading, error }] = useMutation(CLOUDINARY_FILE_UPLOAD_MUTATION);
//   const [AWSfileUpload, { data, loading, error }] = useMutation(AWS_FILE_UPLOAD_MUTATION);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
    //   const response = await LocalfileUpload({
      const response = await CloudinaryfileUpload({
        variables: { file },
      });

      console.log('File uploaded successfully:', response.data.localfileUpload);
    } catch (err:any) {
      console.error('Error uploading file:', err.message);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file || loading}>
        Upload File
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>File uploaded successfully!</p>}
    </div>
  );
};

export default FileUpload;
