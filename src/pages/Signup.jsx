import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, UserPen, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FcWorkflow } from 'react-icons/fc';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    contact: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (error)
      setError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      contact: formData.contact,
      fullname: formData.fullname,
      password: formData.password
    };
    try {
      const response = await fetch("https://file-system-xi.vercel.app/api/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");

      }
      else {
        const data = await response.json()
        setError(data.message || "Signup Failed")
      }
    }
    catch (err) {
      setError("connection error")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 ">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-[bounce_3s_ease-out_1] ">

        <div className="text-center">
          <div className="mx-auto h-12 w-12  rounded-xl flex items-center justify-center">
            <FcWorkflow className="text-white" size={60} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">FileVibe</h2>
          <p className="mt-2 text-sm text-gray-600">Please enter your details to sign up</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-shake">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6"onSubmit={handleSignup}>
          <div className="space-y-4">

            {/* Full Name */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPen className="h-5 w-5 text-gray-400" />

                </div>
                <input
                  name='fullname'
                  type="text"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all ${error && !formData.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="FullName"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* phone */}

            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Contact No.</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />

                </div>
                <input
                  name='contact'
                  type="number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin]:appearance-none outline-none transition-all ${error && !formData.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Number"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name='email'
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center ">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name='password'
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

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] cursor-pointer"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          {/* <button className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</button> */}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
