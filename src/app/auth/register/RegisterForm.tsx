import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import Link from "next/link";

function RegisterForm({onSubmit, formData, handleChange} : any){
    return (<>
            <form className="animate-slideDown max-w-md w-full bg-primary-300 border border-slate-500 text-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4" 
                onSubmit={onSubmit}>
                <div>
                    <h3 className="flex justify-center items-center text-3xl mb-5">Register</h3>
                </div>
                <FormInput 
                    id = "email" 
                    label="Email"
                    type="text" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}/>
                <FormInput
                    id="username"
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <FormInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <FormInput
                    id="password2"
                    label="Re-enter password"
                    type="password"
                    placeholder="Enter your password again"
                    value={formData.password2}
                    onChange={handleChange}
                />
                <div className="flex items-center justify-between mt-10">
                    <FormButton text="Continue" type="submit"/>
                </div>
                <div className="flex items-center mt-10">
                    <p>Already have an account? <Link className="text-blue-400" href="/auth/login">Login</Link></p>
                </div>
            </form>
    </>)
}

export default RegisterForm;