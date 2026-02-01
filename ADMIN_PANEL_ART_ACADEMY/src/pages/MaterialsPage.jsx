import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBoxOpen, FaTag, FaLayerGroup } from 'react-icons/fa';
import Modal from '../components/ui/Modal';
import { Button, Input, Select, Textarea } from '../components/ui/FormComponents';
import { useToast } from '../components/ui/Toast';
import api, { getPaginated } from '../api/apiService';
import { API_ENDPOINTS } from '../api/endpoints';

const MaterialsPage = () => {
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        basePrice: '',
        discount: '',
        stock: '',
        variants: [],
        imageUrl: '',
        active: true,
    });
    const [formLoading, setFormLoading] = useState(false);

    const loadCategories = useCallback(async () => {
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_MATERIALS_CATEGORIES.GET_ALL, { size: 100 });
            setCategories(response.content || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }, []);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_MATERIALS.GET_ALL, { page, size: 20 });
            setItems(response.content || []);
            setPagination({
                number: response.number || 0,
                size: response.size || 20,
                totalElements: response.totalElements || 0,
                totalPages: response.totalPages || 1,
            });
        } catch (error) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    }, [page, toast]);

    useEffect(() => {
        loadCategories();
        loadItems();
    }, [loadCategories, loadItems]);

    const openModal = (mode, item = null) => {
        setModalMode(mode);
        setSelectedItem(item);
        if (mode === 'edit' && item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                categoryId: item.categoryId || '',
                basePrice: item.basePrice || '',
                discount: item.discount || 0,
                stock: item.stock || 0,
                variants: item.variants || [],
                imageUrl: item.imageUrl || '',
                active: item.active ?? true,
            });
        } else if (mode === 'create') {
            setFormData({
                name: '',
                description: '',
                categoryId: '',
                basePrice: '',
                discount: 0,
                stock: '',
                variants: [],
                imageUrl: '',
                active: true,
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const requestData = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                basePrice: parseFloat(formData.basePrice),
                discount: parseFloat(formData.discount || 0),
                stock: parseInt(formData.stock || 0),
                variants: formData.variants, // Sending variants back as-is for now
                imageUrl: formData.imageUrl,
                active: formData.active,
            };

            if (modalMode === 'create') {
                await api.post(API_ENDPOINTS.ART_MATERIALS.CREATE, requestData);
                toast.success('Material created');
            } else {
                await api.put(API_ENDPOINTS.ART_MATERIALS.UPDATE(selectedItem.id), requestData);
                toast.success('Material updated');
            }
            setModalOpen(false);
            loadItems();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this material?')) return;
        try {
            await api.delete(API_ENDPOINTS.ART_MATERIALS.DELETE(id));
            toast.success('Material deleted');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <div className="animate-fadeIn p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Art Materials</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage art supplies inventory</p>
                </div>
                <Button onClick={() => openModal('create')}>
                    <FaPlus /> Add Material
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                            {/* Image Header */}
                            <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/300?text=Material'}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                {item.discount > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                        -{item.discount}%
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs font-semibold shadow-sm text-gray-800 dark:text-gray-200">
                                    {item.categoryName}
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1" title={item.name}>
                                        {item.name}
                                    </h3>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">
                                    {item.description}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-center">
                                        <div className="text-gray-500 text-xs">Price</div>
                                        <div className="font-bold text-gray-800 dark:text-white">${item.basePrice}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-center">
                                        <div className="text-gray-500 text-xs">Stock</div>
                                        <div className={`font-bold ${item.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                            {item.stock}
                                        </div>
                                    </div>
                                </div>

                                {item.variants?.length > 0 && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaLayerGroup /> {item.variants.length} Variants available
                                    </div>
                                )}

                                <div className="flex justify-end pt-2 gap-2 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => openModal('edit', item)}
                                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'create' ? 'Create Material' : 'Edit Material'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} loading={formLoading}>{modalMode === 'create' ? 'Create' : 'Save Changes'}</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Select
                        label="Category"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        options={categoryOptions}
                        placeholder="Select Category"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Base Price ($)"
                            type="number"
                            step="0.01"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                            required
                        />
                        <Input
                            label="Stock Quantity"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Discount (%)"
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />

                    <Input
                        label="Image URL"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />

                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                    />

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                </form>
            </Modal>
        </div>
    );
};

export default MaterialsPage;
