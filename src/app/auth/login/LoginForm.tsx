import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import Link from "next/link";

function LoginForm({ onSubmit, formData, handleChange}: any) {
    return (<>
         <form className="animate-slideDown max-w-md w-full bg-primary-300 border border-slate-500 text-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={onSubmit}>
            <div>
                <h3 className="flex justify-center items-center text-3xl mb-5">Login</h3>
            </div>
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
            <FormButton text="Submit" type="submit" />
            <div className="flex items-center mt-10">
                <p>Don&#39;t have an account yet? <Link className="text-blue-400" href="/auth/register">Register</Link></p>
            </div>
        </form>
    </>);
}
export default LoginForm;