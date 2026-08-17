import type { Category } from "../../types/Category";
import CategoryFormModal from "./CategoryFormModal";
interface Props { open: boolean; category: Category | null; onClose: () => void; onSave: (category: Category) => void | Promise<void>; }
export default function EditCategoryModal({open, category, onClose, onSave}: Props) { if (!category) return null; return <CategoryFormModal open={open} title="Edit category" submitLabel="Save changes" initialValue={{name: category.name, description: category.description, status: category.status}} onClose={onClose} onSave={(value) => onSave({...category, ...value})}/>; }
