import { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineCheckCircle } from "react-icons/ai";

const AddFileDrawer = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setFile(null);
      setFileName("");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");
    
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://file-system-xi.vercel.app/api/file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (response.ok) {
  
        setShowSuccess(true);
        onUploadSuccess();
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);

      } else {
        const errorData = await response.json();
        setError(errorData.message || "Upload failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-100 animate-bounce">
          <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <AiOutlineCheckCircle size={24} />
            <span className="font-bold">File Uploaded Successfully!</span>
          </div>
        </div>
      )}

      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-100 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800">Add New File</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
              <AiOutlineClose size={24} />
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File (Max 5MB)</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-500 transition-colors">
                <input 
                  type="file" 
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    {file ? `Selected: ${file.name}` : "Click to browse or drag and drop"}
                  </p>
                </div>
              </div>
            </div>

            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 animate-shake">
                {error}
              </div>
            )}

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input 
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            
            <button 
              type="submit" 
              disabled={loading || showSuccess}
              className={`w-full text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer 
                ${loading || showSuccess ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : showSuccess ? "Done!" : "Upload File"}
            </button>
          </form>

          {/* Tips */}
          {/* <div className="mt-10 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Note:</strong> Supported formats include PDF, DOCX, Images, and Text files. Files are encrypted before storage.
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AddFileDrawer;