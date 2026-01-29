import { MdDashboardCustomize } from "react-icons/md";
import { FaFileSignature, FaHistory, FaTimes } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { FcWorkflow } from "react-icons/fc";
import { HiMenuAlt1 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { verifyToken, fetchProfilePic, uploadProfilePic, setloading } from "../redux/userSlice";

const History = () => {
    const [menuVisible, setMenuVisible] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fullname, email, profilePic } = useSelector((state) => state.user);
    const inputRef = useRef(null);

    const [historyData, setHistoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(historyData.length / itemsPerPage);

    useEffect(() => {
        const fetchHistory = async () => {
            dispatch(setloading(true));
            try {
                const response = await fetch('https://file-system-xi.vercel.app/api/share', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data)
                    setHistoryData(data.sharedFiles || data || []);
                     dispatch(setloading(false));
                }
            } catch (error) {
                console.error("Failed", error);
            }
           
        };

        fetchHistory();
        dispatch(setloading(false));

    }, [dispatch])


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/");
            return;
        }
        dispatch(verifyToken())
            .unwrap()
            .catch(() => navigate("/"));

        if (!profilePic) {
            dispatch(fetchProfilePic());
        }

        // fetchFiles(); 
    }, [dispatch, navigate, profilePic]);


    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dispatch(uploadProfilePic(file))
            .unwrap()
            .then(() => toast.success("Profile updated!"))
            .catch((err) => toast.error(err));
    };

    return (
        <>
            <div className='min-h-screen bg-slate-600 w-full flex overflow-x-hidden relative'>


                {menuVisible && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMenuVisible(false)}
                    />
                )}
                <div className={`
                    bg-slate-400 min-h-screen transition-all duration-300 ease-in-out z-50
                    ${menuVisible ? "w-80 translate-x-0 relative" : "w-0 -translate-x-full absolute"}
                `}>

                    <div className={`w-80 ${menuVisible ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-200`}>

                        <div className="flex justify-end p-4 lg:hidden">
                            <FaTimes
                                className="text-white text-2xl cursor-pointer"
                                onClick={() => setMenuVisible(false)}
                            />
                        </div>

                        <div className="flex flex-col items-center pt-10">
                            {/* <img className='w-40 h-40 p-6' src="src/assets/avt.png" alt="Avatar" /> */}
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

                            <h1 className='text-xl text-white font-bold mt-4 px-4 text-center'>{fullname.toUpperCase() || "loading"}</h1>
                            <h3 className=' text-white'>{email}</h3>
                        </div>

                        <div className='flex flex-col gap-6 px-6 items-center mt-7'>
                            <Link to="/Dashboard" className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                                <MdDashboardCustomize className="mt-1.25" />Dashboard
                            </Link>
                            <Link to="/my-files" className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                                <FaFileSignature className="mt-1.25 ml-4" />My Files
                            </Link>
                            <Link to="/History" className="text-white flex bg-slate-600 gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                                <FaHistory className="mt-1.25 ml-4" />History
                            </Link>
                            <Link to="/" onClick={() => localStorage.removeItem('token')} className="text-white flex gap-2 flex-row border-2 rounded-lg p-2 cursor-pointer w-32.5 hover:scale-105">
                                <AiOutlineLogout className="mt-1.25 ml-4" />
                                Logout
                            </Link>

                        </div>
                    </div>
                </div>


                <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">

                    {/* Navbar */}
                    <div className="bg-slate-200 px-6 py-4 w-full shadow-lg flex justify-between items-center h-20">
                        {/* <div className="flex items-center ml-2 lg:ml-5 gap-2"> */}
                        <div className="flex items-center gap-2">
                            <FcWorkflow className="h-10 w-10" />
                            <h2 className="text-2xl font-bold italic text-slate-800">FileVibe</h2>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => {
                                localStorage.removeItem('token');
                                navigate("/")
                            }}
                                className="bg-slate-300 p-3 rounded cursor-pointer hover:bg-slate-400 transition-colors">
                                <AiOutlineLogout />
                            </button>

                            <button onClick={() => setMenuVisible(!menuVisible)}
                                className="bg-slate-300 p-3 rounded cursor-pointer hover:bg-slate-400 transition-colors">
                                <HiMenuAlt1 />
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="p-6 space-y-4 ">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-white mb-8">History</h2>
                        </div>

                        <div className="overflow-x-auto bg-white/90 rounded-lg shadow-md">
                            <table className="w-full">
                                <thead className="text-lg font-bold border-b pb-3 mb-4 text-slate-700 ">
                                    <tr className="text-black text-left bg-slate-200 divide-x">
                                        <th className="font-medium py-4 px-6">File Name</th>
                                        <th className="font-medium py-4 px-8">Email</th>
                                        <th className="font-medium py-4 px-8">Datetime</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50 divide-x overflow-x-auto ">
                                                <td className="py-4 px-6 truncate ">{item?.file?.filename || "_______________"}</td>
                                                <td className="truncate px-6">{item.receiverEmail || "NA"}</td>
                                                {/* <td>{new Date(item.createdAt).toLocaleString()}</td> */}
                                                <td className="truncate px-6">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>

                                            <td colSpan="3" className="text-center py-4 text-gray-500">No history found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {/* <Pagination/> */}
                            <div className="p-4 border-t">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default History;