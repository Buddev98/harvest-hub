

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  userId?: string;
  children:React.ReactNode
}

const GenericModal = ({ isOpen, onClose, handleSubmit,children}: ModalProps) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
       
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 ms-2 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>
              Submit
            </button>
          </div>
      </div>
    </div>
  );
};

export default GenericModal;