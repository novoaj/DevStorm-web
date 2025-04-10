import FormInput from "@/components/common/FormInput";
import * as Dialog from "@radix-ui/react-dialog";
import Cross from "../components/Cross";
import ButtonWhite from "../components/ButtonWhite";
interface ProfileFormProps {
    formData: {
      username: string;
      oldPassword: string;
      newPassword: string;
      newPassword2: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onDelete: () => void;
  }

const EditProfilePopup : React.FC<ProfileFormProps> = ({ formData, onChange, onSave, onDelete }) => {
 return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="w-1/2 py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-full transition duration-300">Edit Profile</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-75 fixed inset-0"/>
                <Dialog.Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                    <Dialog.Title className="m-0 font-semibold text-xl">Edit Profile</Dialog.Title>
                    <Dialog.Description className="mt-3 mb-6 text-md text-slate-300">
                        Change your username or password here. Click save when you're done if you want changes to persist (to change username, enter your current password)
                    </Dialog.Description>
                    <fieldset className="items-center mb-2">
                        <FormInput 
                            id="username"
                            label="Username"
                            type="text"
                            placeholder="(Optional)"
                            value={formData.username}
                            onChange={onChange}
                        />
                    </fieldset>
                    <fieldset className="items-center mb-2">
                        <FormInput 
                            id="old-password"
                            label="Password"
                            type="password"
                            placeholder="Current Password"
                            value={formData.oldPassword}
                            onChange={onChange}
                        />
                    </fieldset>
                    <fieldset className="items-center mb-2">
                        <FormInput 
                            id="new-password1"
                            label="New Password (Optional)"
                            type="password"
                            placeholder="New Password (Optional)"
                            value={formData.newPassword}
                            onChange={onChange}
                        />
                    </fieldset>
                    <fieldset className="items-center mb-2">
                        <FormInput 
                            id="new-password2"
                            label="Re-enter New Password"
                            type="password"
                            placeholder="New Password"
                            value={formData.newPassword2}
                            onChange={onChange}
                        />
                    </fieldset>
                    <div className="flex flex-end justify-between mt-5">
                        <Dialog.Close asChild>
                            <button 
                                className="h-fit w-fit p-2 px-4 flex flex-center items-center justify-center hover:border border-primary-200 bg-secondary-100 hover:bg-secondary-200 rounded-full ml-5" 
                                aria-label="Delete account"
                                onClick={onDelete}
                            >
                                Delete Acccount
                            </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <ButtonWhite value={"Save Changes"} onClick={onSave}/>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className="h-5 w-5 inline-flex items-center justify-center absolute top-5 right-5 hover:border border-primary-200 rounded" aria-label="Close">
                            <Cross />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
        )   
}
export default EditProfilePopup;