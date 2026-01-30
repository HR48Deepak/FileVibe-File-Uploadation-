import { MdDashboardCustomize, MdDeleteForever } from "react-icons/md";
import { FaFileSignature, FaHistory, FaTimes, FaShare } from "react-icons/fa";
import { AiOutlineLogout, AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import { FcWorkflow } from "react-icons/fc";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoMdDownload } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { verifyToken, fetchProfilePic, uploadProfilePic, setloading } from "../redux/userSlice";
import useSWR, { useSWRConfig } from 'swr';

const fetcher = (url) => fetch(url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(res => res.json());

const MyFiles = () => {
    const { mutate } = useSWRConfig();
    const [menuVisible, setMenuVisible] = useState(true);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [shareModal, setShareModal] = useState({ isOpen: false, file: null, email: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, publicId: null });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { fullname, email, profilePic } = useSelector((state) => state.user);

    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const {
        data: file = [],
        isLoading,
        error } = useSWR('https://file-system-xi.vercel.app/api/file', fetcher);

    useEffect(() => {
        dispatch(setloading(isLoading));
    }, [isLoading, error, dispatch]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFiles = file.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(file.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/");
            return;
        }
        dispatch(verifyToken()).unwrap().catch(() => navigate("/"));
        if (!profilePic) {
            dispatch(fetchProfilePic());
        }
    }, [dispatch, navigate, profilePic]);

    const handleInputChange = (e) => {
        const selectedFile = e.target.files[0];
        setUploadError("");
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                setUploadError("File size must be less than 10MB");
                return;
            }
            setUploadFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!uploadFile) { setUploadError("Please select a file first!"); return; }
        setLoading(true); setUploadError("");
        const formData = new FormData();
        formData.append('file', uploadFile);

        try {
            const response = await fetch('https://file-system-xi.vercel.app/api/file', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            });
            if (response.ok) {
                setShowSuccess(true);
                setUploadFile(null);
                setFileName("");
                mutate('https://file-system-xi.vercel.app/api/file');
                setTimeout(() =>
                    setShowSuccess(false), 3000);
            } else {
                const errorData = await response.json();
                setUploadError(errorData.message || "Upload failed");
            }
        } catch (error) {
            setUploadError("Network error.");

        }
        finally { setLoading(false); }
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        dispatch(uploadProfilePic(file)).unwrap()
            .then(() => toast.success("Profile updated!"))
            .catch((err) => toast.error(err));
    };

    const confirmDelete = async () => {
        const { id, publicId } = deleteModal;
        const response = await fetch(`https://file-system-xi.vercel.app/api/file?id=${id}&public_id=${publicId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            mutate('https://file-system-xi.vercel.app/api/file');
            setDeleteModal({ isOpen: false, id: null, publicId: null });
            toast.success("File deleted successfully");
        }
    };

    const confirmShare = async () => {
        const { file: selectedFile, email } = shareModal;
        if (!email) return toast.error("Please enter an email");
        setLoading(true);
        try {
            const response = await fetch('https://file-system-xi.vercel.app/api/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({
                    email: email,
                    file_url: selectedFile.file_url || selectedFile.url,
                    fileId: selectedFile._id
                })
            });
            if (response.ok) {
                toast.success(`Successfully shared with ${email}`);
                setShareModal({ isOpen: false, file: null, email: '' });
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Could not share file');
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (file_Id, filename) => {
        try {
            const response = await fetch(`https://file-system-xi.vercel.app/api/file/download/${file_Id}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || 'file_download');
            document.body.appendChild(link); link.click(); link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); toast.success("Download started", { id: 'download' });
        } catch (error) { 
            toast.error("Could not download the file.", { id: 'download' }); }
    };

    return (
        <>
            <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff', borderRadius: '10px' }, success: { style: { background: '#059669' } }, error: { style: { background: '#dc2626' } } }} />
            <div className='min-h-screen bg-slate-600 w-full flex overflow-x-hidden relative font-sans'>
                {menuVisible && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMenuVisible(false)} />)}
                <div className={`bg-slate-400 min-h-screen transition-all duration-300 ease-in-out z-50 ${menuVisible ? "w-80 translate-x-0 relative" : "w-0 -translate-x-full absolute"}`}>
                    <div className={`w-80 ${menuVisible ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-200`}>
                        <div className="flex justify-end p-4 lg:hidden"> <FaTimes className="text-white text-2xl cursor-pointer" onClick={() => setMenuVisible(false)} /> </div>
                        <div className="flex flex-col items-center pt-10">
                            <div className="relative cursor-pointer group" onClick={() => inputRef.current.click()}>
                                <img id="pic" className='w-40 h-40 rounded-full object-cover border-4 border-slate-500 bg-white' src={profilePic || "src/assets/avt.png"} alt="User Avatar" />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"> <span className="text-white text-xs text-center font-bold">Change Image</span> </div>
                            </div>
                            <input type="file" ref={inputRef} onChange={handleImgChange} accept="image/*" className="hidden" />
                            <h1 className='text-xl text-white font-bold mt-4 px-4 text-center'>{fullname.toUpperCase() || "loading"}</h1>
                            <h3 className='text-white'>{email}</h3>
                        </div>
                        <div className='flex flex-col gap-6 px-6 items-center mt-7'>
                            <Link to="/Dashboard" className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105"> <MdDashboardCustomize className="mt-1.25" />Dashboard </Link>
                            <Link to="/my-files" className="text-white flex bg-slate-600 gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105"> <FaFileSignature className="mt-1.25 ml-4" />My Files </Link>
                            <Link to="/History" className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105"> <FaHistory className="mt-1.25 ml-4" />History </Link>
                            <Link to="/" onClick={() => localStorage.removeItem('token')} className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105"> <AiOutlineLogout className="mt-1.25 ml-4" /> Logout </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="bg-slate-200 px-6 py-4 w-full shadow-lg flex justify-between items-center h-20">
                        <div className="flex items-center gap-2"> <FcWorkflow className="h-10 w-10" /> <h2 className="text-2xl font-bold italic text-slate-800">FileVibe</h2> </div>
                        <div className="flex gap-3">
                            <button onClick={() => { localStorage.removeItem('token'); navigate("/") }} className="bg-slate-300 p-3 rounded cursor-pointer hover:bg-slate-400 transition-colors"> <AiOutlineLogout /> </button>
                            <button onClick={() => setMenuVisible(!menuVisible)} className="bg-slate-300 p-3 rounded hover:bg-slate-400 transition-colors"> <HiMenuAlt1 /> </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-3xl font-bold text-white">My Files</h2>
                            <div className="bg-white/95 p-6 rounded-xl shadow-lg border-b-4 border-blue-500">
                                <form className="flex flex-col md:flex-row items-end gap-4" onSubmit={handleUploadSubmit}>
                                    <div className="flex-1 w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select File (Max 10MB)</label>
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-3 hover:border-blue-500 transition-colors bg-slate-50">
                                            <input type="file" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <p className="text-sm text-slate-600 text-center truncate"> {uploadFile ? `Selected: ${uploadFile.name}` : "Click to browse or drag and drop"} </p>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                                        <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter file name" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                    </div>
                                    <button type="submit" disabled={loading || showSuccess} className={`w-full md:w-40 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer ${loading || showSuccess ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}> {loading ? "..." : showSuccess ? "Uploaded!" : "Upload"} </button>
                                </form>
                                {uploadError && <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200"> {uploadError} </div>}
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white/90 rounded-xl shadow-md ">
                            <table className="w-full text-left">
                                <thead className="text-lg font-bold border-b pb-3 mb-4 text-slate-700 ">
                                    <tr className="bg-slate-200 divide-x">
                                        <th className="px-8 py-4">Name</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Size</th><th className="px-6 py-4">Created</th><th className="px-8 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentFiles.length > 0 ? (
                                        currentFiles.map((f) => (
                                            <tr key={f._id} className="border-b hover:bg-slate-50 truncate transition-colors divide-x overflow-x-auto">
                                                <td className="px-4 py-4 ">{f.filename}</td><td className="px-4 py-4 ">{f.type}</td><td className="px-4 py-4 ">{(f.size / 1024).toFixed(2)} KB</td><td className="px-4 py-4 ">{new Date(f.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex gap-4 ">
                                                        <button title="Delete" onClick={() => setDeleteModal({ isOpen: true, id: f._id, publicId: f.public_id })} className="text-red-500 hover:text-red-700 "> <MdDeleteForever size={22} /> </button>
                                                        <button title="Share" onClick={() => setShareModal({ isOpen: true, file: f, email: '' })} className="text-green-600 hover:text-green-800"> <FaShare size={20} /> </button>
                                                        <button title="Download" onClick={() => handleDownload(f._id, f.filename)} className="text-blue-600 hover:text-blue-800"> <IoMdDownload size={22} /> </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr><td colSpan="5" className="text-center py-10 text-gray-400">No files found.</td></tr>)}
                                </tbody>
                            </table>
                            {file.length > itemsPerPage && (
                                <div className="p-4 bg-slate-50 rounded-b-xl border-t">
                                    <Pagination currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showSuccess && (
                    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-100 animate-bounce">
                        <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                            <AiOutlineCheckCircle size={24} /> <span className="font-bold">File Uploaded Successfully!</span>
                        </div>
                    </div>
                )}

                {shareModal.isOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h3 className="text-xl font-bold mb-2">Share File</h3>
                            <p className="text-sm text-gray-500 mb-4">Sharing: <span className="text-slate-800 font-semibold">{shareModal.file?.filename}</span></p>
                            <input type="email" placeholder="Recipient email" className="w-full p-3 border border-gray-300 rounded-lg outline-none mb-6" value={shareModal.email} onChange={(e) => setShareModal({ ...shareModal, email: e.target.value })} />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShareModal({ isOpen: false, file: null, email: '' })} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button onClick={confirmShare} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg"> {loading ? "Sharing..." : "Share"} </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <MdDeleteForever className="text-red-600 size-10" /> </div>
                            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
                            <p className="text-gray-500 mb-6">This will permanently remove the file.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModal({ isOpen: false, id: null, publicId: null })} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
export default MyFiles;