import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../components/ui/DataTable';
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
        brand: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
        sku: '',
    });
    const [formLoading, setFormLoading] = useState(false);

    // Load categories
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
                brand: item.brand || '',
                price: item.price || '',
                stockQuantity: item.stockQuantity || '',
                imageUrl: item.imageUrl || '',
                sku: item.sku || '',
            });
        } else if (mode === 'create') {
            setFormData({ name: '', description: '', categoryId: '', brand: '', price: '', stockQuantity: '', imageUrl: '', sku: '' });
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
                brand: formData.brand,
                price: formData.price ? parseFloat(formData.price) : null,
                stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
                imageUrl: formData.imageUrl,
                sku: formData.sku,
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

    const columns = [
        {
            key: 'imageUrl',
            label: 'Image',
            render: (val) => val ? <img src={val} alt="" className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'categoryName', label: 'Category', render: (val) => val || '-' },
        { key: 'brand', label: 'Brand', render: (val) => val || '-' },
        { key: 'price', label: 'Price', render: (val) => val ? `$${parseFloat(val).toFixed(2)}` : '-' },
        { key: 'stockQuantity', label: 'Stock', render: (val) => val ?? 0 },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button onClick={() => openModal('view', row)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FaEye /></button>
                    <button onClick={() => openModal('edit', row)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"><FaEdit /></button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FaTrash /></button>
                </div>
            ),
        },
    ];

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Art Materials</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage art supplies and materials for sale</p>
            </div>

            <DataTable columns={columns} data={items} loading={loading} pagination={pagination} onPageChange={setPage} actions={<Button onClick={() => openModal('create')}><FaPlus /> Add Material</Button>} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Material' : modalMode === 'edit' ? 'Edit Material' : 'Material Details'} size="lg" footer={modalMode !== 'view' && (<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} loading={formLoading}>{modalMode === 'create' ? 'Create' : 'Update'}</Button></>)}>
                {modalMode === 'view' ? (
                    <div className="space-y-3">
                        {selectedItem?.imageUrl && <img src={selectedItem.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
                        <div><strong>Name:</strong> {selectedItem?.name}</div>
                        <div><strong>Category:</strong> {selectedItem?.categoryName || '-'}</div>
                        <div><strong>Brand:</strong> {selectedItem?.brand || '-'}</div>
                        <div><strong>SKU:</strong> {selectedItem?.sku || '-'}</div>
                        <div><strong>Price:</strong> {selectedItem?.price ? `$${selectedItem.price}` : '-'}</div>
                        <div><strong>Stock:</strong> {selectedItem?.stockQuantity ?? 0}</div>
                        <div><strong>Description:</strong> {selectedItem?.description || '-'}</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Select label="Category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} options={categoryOptions} placeholder="Select category..." required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                            <Input label="SKU" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Price ($)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                            <Input label="Stock Quantity" type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} required />
                        </div>
                        <Input label="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                        <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default MaterialsPage;
