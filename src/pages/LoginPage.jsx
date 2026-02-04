import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FcWorkflow } from 'react-icons/fc';
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { type, value } = e.target;

    if (error)
      setError('');
    setFormData(prev => ({ ...prev, [type]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields before signing in.');
      return;
    }

    try {
      const response = await fetch("https://file-system-xi.vercel.app/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // if (data.user) {
        //             localStorage.setItem("userName", data.user.fullname || data.user.name);
        //             localStorage.setItem("userEmail", data.user.email);
        //         }
        navigate('/Dashboard');

      } else {
        setError(data.message || 'Login failed')
      }
    }
    catch (err) {
      setError('connection error')
    }

  }
  
  const handleGoogleSignin = async () => {
    // debugger
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // const user = result.user;
      // console.log("Logged in:", user.email);
      // const token = await user.getIdToken();
      
      // localStorage.setItem("token", token);
      // localStorage.setItem("userName", user.displayName);
      // localStorage.setItem("userEmail", user.email)
      // localStorage.setItem("userPic", user.photoURL);
      // localStorage.setItem("authType", "google"); 

      // console.log("Logged in:", user.email);
      navigate("/Google")

    } catch (error) {
      console.error(error.message);
      setError("Failed");
    }

  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 ">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-[bounce_3s_ease-out_1]  ">

        <div className="text-center">
          <div className="mx-auto h-12 w-12  rounded-xl flex items-center justify-center">
            <FcWorkflow className="text-white" size={60} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">FileVibe</h2>
          <p className="mt-2 text-sm text-gray-600">Please enter your details to sign in</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-shake">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">

            {/* Email Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all ${error && !formData.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="name@gmail.com"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all ${error && !formData.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]"
          >
            Sign in
          </button>
        </form>
        <button
          type='button'
          onClick={handleGoogleSignin}
          className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold  text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]"
        >
          Continue with <FcGoogle className='size-6 ml-2' />
        </button>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          {/* <button className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</button> */}
          <Link to="/Signup" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"> Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
