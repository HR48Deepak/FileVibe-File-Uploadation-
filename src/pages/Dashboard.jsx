import { MdDashboardCustomize } from "react-icons/md";
import { FaFileSignature, FaHistory, FaTimes } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { FcWorkflow } from "react-icons/fc";
import { HiMenuAlt1 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken, fetchProfilePic, uploadProfilePic, setloading } from "../redux/userSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import useSWR from 'swr';

const fetcher = (url) => axios.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
}).then(res => res.data);

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { fullname, email, profilePic } = useSelector((state) => state.user);

    const isGoogleUser = localStorage.getItem("authType") === "google";

   
    const { data: filesData, 
        isLoading: filesLoading, 
        error: fileError } = useSWR(!isGoogleUser ? 'https://file-system-xi.vercel.app/api/file' : null, fetcher, { revalidateOnFocus: false });

    const { data: historyData, 
        isLoading: historyLoading, 
        error: historyError } = useSWR(!isGoogleUser ? 'https://file-system-xi.vercel.app/api/share' : null, fetcher, { revalidateOnFocus: false });

    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/");
            return;
        }
        // dispatch(verifyToken()).unwrap().catch(() => navigate("/"));
        // dispatch(fetchProfilePic());
    }, [ navigate]);

    useEffect(() => {
        dispatch(setloading(filesLoading || historyLoading));
    }, [filesLoading, historyLoading, fileError, historyError, dispatch]);

    useEffect(() => {
        const authType = localStorage.getItem("authType");

        if (authType === "google") {
            // Just fetch the profile pic (which now handles Google locally)
            dispatch(fetchProfilePic());
        } else {
            // Standard flow for regular users
            dispatch(verifyToken());
            dispatch(fetchProfilePic());
        }
    }, [dispatch]);

    const stats = {
        recentFiles: (filesData || []).slice(0, 4),
        recentShared: (historyData || []).slice(0, 4)
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dispatch(uploadProfilePic(file))
            .unwrap()
            .then(() => toast.success("Profile updated!"))
            .catch((err) => toast.error(err));
    };

    return (
        <div className='min-h-screen bg-slate-600 w-full flex overflow-x-hidden relative'>
            {isSidebarVisible && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarVisible(false)} />
            )}

            <div className={`bg-slate-400 min-h-screen transition-all duration-300 ease-in-out z-50 ${isSidebarVisible ? "w-80 translate-x-0 relative" : "w-0 overflow-hidden"}`}>
                <div className="flex justify-end p-4 lg:hidden">
                    <FaTimes className="text-white text-2xl cursor-pointer" onClick={() => setIsSidebarVisible(false)} />
                </div>
                <div className="w-80 flex flex-col items-center pt-10">

                    <div className="relative cursor-pointer group" onClick={() => inputRef.current.click()}>
                        <img
                            id="pic"
                            className='w-40 h-40 rounded-full object-cover border-4 border-slate-500 bg-white'
                            src={profilePic || "src/assets/avt.png"}
                            alt="User Avatar"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs text-center font-bold">Change Image</span>
                        </div>
                    </div>

                    <input type="file" ref={inputRef} onChange={handleImgChange} accept="image/*" className="hidden" />

                    <h1 className='text-xl text-white font-bold mt-4 px-4 text-center'>
                        {fullname?.toUpperCase() || "LOADING..."}
                    </h1>
                    <h3 className='text-slate-100'>{email}</h3>

                    <div className='flex flex-col gap-6 px-6 items-center mt-7'>
                        <Link to="/Dashboard" className="text-white flex gap-2 bg-slate-600 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105 ">
                            <MdDashboardCustomize className="mt-1.25" />Dashboard
                        </Link>
                        <Link to="/my-files" className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                            <FaFileSignature className="mt-1.25 ml-4" />My Files
                        </Link>
                        <Link to="/History" className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                            <FaHistory className="mt-1.25 ml-4" />History
                        </Link>
                        <Link to="/" onClick={() => localStorage.removeItem('token')} className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                            <AiOutlineLogout className="mt-1.25 ml-4" />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-slate-200 px-6 py-4 flex justify-between items-center h-20 shadow-md">
                    <div className="flex items-center gap-2">
                        <FcWorkflow className="h-10 w-10" />
                        <h2 className="text-2xl font-bold italic text-slate-800">FileVibe</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => localStorage.removeItem('token')} className="bg-slate-300 p-3 rounded-lg hover:bg-slate-400 cursor-pointer"><AiOutlineLogout /></button>
                        <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="bg-slate-300 p-3 rounded-lg hover:bg-slate-400 cursor-pointer"><HiMenuAlt1 /></button>
                    </div>
                </header>

                <main className="p-8">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Welcome {fullname?.split(' ')[0].toUpperCase() || "USER"}!
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/90 p-6 rounded-2xl shadow-xl border-b-5 border-blue-700">
                            <h3 className="text-lg font-bold border-b pb-3 mb-4 text-slate-700">Recent Uploads</h3>
                            {stats.recentFiles.length > 0 ? (
                                <ul className="space-y-3">
                                    {stats.recentFiles.map((file) => (
                                        <li key={file._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                            <span className="text-sm font-medium truncate w-40">📄 {file.filename}</span>
                                            <span className="text-xs px-2 py-1 text-slate-400">{new Date(file.createdAt).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-slate-400 text-center py-5 italic">No files uploaded.</p>}
                        </div>

                        <div className="bg-white/90 p-6 rounded-2xl shadow-xl border-b-5 border-blue-700">
                            <h3 className="text-lg font-bold border-b pb-3 mb-4 text-slate-700">Recent Shared</h3>
                            {stats.recentShared.length > 0 ? (
                                <ul className="space-y-3">
                                    {stats.recentShared.map((item) => (
                                        <li key={item._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                            <span className="text-sm font-medium truncate w-40">🔗 {item.file?.filename || "Shared File"}</span>
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold">SHARED</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-slate-400 text-center py-5 italic">No shared history.</p>}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;