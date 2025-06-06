import { MdAdd, MdClose, MdUpdate } from 'react-icons/md';
import TiptapEditor from '../DashboardLayout/Editor/TiptapEditor';

interface BlogFormModalProps {
  isOpen: boolean;
  isUpdateMode: boolean;
  formData: {
    title: string;
    content: string;
    categoryId: string;
    thumbnail: File | null;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormDataChange: (data: { title?: string; content?: string; categoryId?: string; thumbnail?: File | null }) => void;
  onImageUpload: (file: File) => Promise<string>;
  categoryOptions: { value: string; label: string; }[];
}

const BlogFormModal = ({
  isOpen,
  isUpdateMode,
  formData,
  onClose,
  onSubmit,
  onFormDataChange,
  onImageUpload,
  categoryOptions
}: BlogFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
      <div className="bg-gray-50 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-7xl transform transition-all duration-300 ease-in-out max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {isUpdateMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Blog Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({ title: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors text-gray-900 text-sm sm:text-base bg-white"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Blog Content
            </label>
            <div className="border border-gray-400 text-gray-900 rounded-lg overflow-hidden bg-white">
              <TiptapEditor
                content={formData.content}
                onChange={(content) => onFormDataChange({ content })}
                onImageUpload={onImageUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Thumbnail Image {!isUpdateMode && <span className="text-red-600">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFormDataChange({ thumbnail: e.target.files?.[0] || null })}
              className="w-full px-3 sm:px-4 text-gray-900 py-2 sm:py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors text-sm sm:text-base bg-white"
              required={!isUpdateMode}
            />
            {formData.thumbnail && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected file: {formData.thumbnail.name}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => onFormDataChange({ categoryId: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border  border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors text-sm sm:text-base  text-gray-900 placeholder:text-gray-900"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value} className='text-gray-900'>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isUpdateMode ? (
                <>
                  <MdUpdate className="w-4 h-4 sm:w-5 sm:h-5" />
                  Update Post
                </>
              ) : (
                <>
                  <MdAdd className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal; 