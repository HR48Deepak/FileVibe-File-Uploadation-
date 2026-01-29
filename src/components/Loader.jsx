import { useSelector } from 'react-redux';

const Loader = () => {
    const loading = useSelector((state) => state.user.loading);

    if (!loading) return null;
    
    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-200">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-slate-700 font-bold text-lg animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;