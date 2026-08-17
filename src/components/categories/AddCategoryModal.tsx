import CategoryFormModal, {type CategoryFormValue} from "./CategoryFormModal";
interface Props { open: boolean; onClose: () => void; onSave: (category: CategoryFormValue) => void | Promise<void>; }
export default function AddCategoryModal({open, onClose, onSave}: Props) { return <CategoryFormModal open={open} title="Add a category" submitLabel="Create category" onClose={onClose} onSave={onSave}/>; }
