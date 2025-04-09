import api from "../api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userddata: any
}

const FormModel = ({ isOpen, onClose,userId, userddata }: ModalProps) => {

  if (!isOpen) return null;

  const initialValues = {
    userId: '',
  };

  const validationSchema = Yup.object({
    userId: Yup.string().required('Required'),
  });
  const onFormSubmit = async(values: { userId: string }) => {
    try {
      let value = values.userId
      console.log("santhusannnn",values.userId,userddata)
      const bookedResponse = await api.post(`/assign/${userId}/${value}`);
      console.log("API Response:", bookedResponse.data);
      onClose();
    } catch (error) {
      console.error("Error assigning user:", error);
    }
   
  };
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          <Form>
            <div className="form-group ">
              <p className="block text-sm font-medium">Select Patient</p>
              <Field as="select" name="userId" id="userId"  className="w-full p-2 border rounded">
                <option value="" label="Select patient" />
                {userddata.map((user: any) => (
                  <option key={user._id} value={user._id} label={`${user.username} - ${user._id}`} />
                ))}
              </Field>
              <ErrorMessage name="userId" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 ms-2 py-2 bg-blue-500 text-white rounded">
                Submit
              </button>
            </div>
          </Form>

        </Formik>
      </div>
    </div>
  );
};

export default FormModel;