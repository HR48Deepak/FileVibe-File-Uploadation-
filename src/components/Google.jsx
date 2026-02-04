import { useNavigate } from "react-router-dom"

const Google = () => {

const navigate = useNavigate()    

const handleLogout = ()=>{
    navigate("/")
}

    return (

        <div className="bg-slate-600 min-h-screen">
            <div className="text-center ">
                <h1 className="text-6xl font-bold text-zinc-400 p-15">Welcome, Buddy</h1>
                <h2 className="text-4xl text-zinc-300 italic">Google Signup</h2>

            </div>
            <div className="flex justify-center p-3">
                <img src="src\assets\avt.png" alt="" />
            </div>
            <div className="flex justify-center p-3">

            <button className=" p-3 px-7 rounded-xl bg-amber-800 cursor-pointer hover:scale-110" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )
}

export default Google
