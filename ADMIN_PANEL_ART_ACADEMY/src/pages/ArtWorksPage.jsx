import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Button, Input, Select, Textarea } from '../components/ui/FormComponents';
import { useToast } from '../components/ui/Toast';
import api, { getPaginated } from '../api/apiService';
import { API_ENDPOINTS } from '../api/endpoints';

const ArtWorksPage = () => {
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
        title: '',
        description: '',
        categoryId: '',
        artistName: '',
        medium: '',
        dimensions: '',
        yearCreated: '',
        price: '',
        imageUrl: '',
        isForSale: true,
        isFeatured: false,
    });
    const [formLoading, setFormLoading] = useState(false);

    // Load categories for dropdown
    const loadCategories = useCallback(async () => {
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_WORKS_CATEGORIES.GET_ALL, { size: 100 });
            setCategories(response.content || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }, []);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_WORKS.GET_ALL, { page, size: 20 });
            setItems(response.content || []);
            setPagination({
                number: response.number || 0,
                size: response.size || 20,
                totalElements: response.totalElements || 0,
                totalPages: response.totalPages || 1,
            });
        } catch (error) {
            toast.error('Failed to load art works');
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
                title: item.title || '',
                description: item.description || '',
                categoryId: item.categoryId || '',
                artistName: item.artistName || '',
                medium: item.medium || '',
                dimensions: item.dimensions || '',
                yearCreated: item.yearCreated || '',
                price: item.price || '',
                imageUrl: item.imageUrl || '',
                isForSale: item.isForSale ?? true,
                isFeatured: item.isFeatured ?? false,
            });
        } else if (mode === 'create') {
            setFormData({
                title: '',
                description: '',
                categoryId: '',
                artistName: '',
                medium: '',
                dimensions: '',
                yearCreated: '',
                price: '',
                imageUrl: '',
                isForSale: true,
                isFeatured: false,
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            // Build request following API schema
            const requestData = {
                title: formData.title,
                description: formData.description,
                categoryId: formData.categoryId,
                artistName: formData.artistName,
                medium: formData.medium,
                dimensions: formData.dimensions,
                yearCreated: formData.yearCreated ? parseInt(formData.yearCreated) : null,
                price: formData.price ? parseFloat(formData.price) : null,
                imageUrl: formData.imageUrl,
                isForSale: formData.isForSale,
                isFeatured: formData.isFeatured,
            };

            if (modalMode === 'create') {
                await api.post(API_ENDPOINTS.ART_WORKS.CREATE, requestData);
                toast.success('Art work created');
            } else {
                await api.put(API_ENDPOINTS.ART_WORKS.UPDATE(selectedItem.id), requestData);
                toast.success('Art work updated');
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
        if (!confirm('Delete this art work?')) return;
        try {
            await api.delete(API_ENDPOINTS.ART_WORKS.DELETE(id));
            toast.success('Art work deleted');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const columns = [
        {
            key: 'imageUrl',
            label: 'Image',
            render: (val) => val ? (
                <img src={val} alt="" className="w-12 h-12 object-cover rounded-lg" />
            ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            )
        },
        { key: 'title', label: 'Title', sortable: true },
        { key: 'categoryName', label: 'Category', render: (val) => val || '-' },
        { key: 'artistName', label: 'Artist', render: (val) => val || '-' },
        {
            key: 'price',
            label: 'Price',
            render: (val) => val ? `$${parseFloat(val).toFixed(2)}` : '-'
        },
        {
            key: 'isForSale',
            label: 'For Sale',
            render: (val) => val ? <span className="text-green-500">Yes</span> : <span className="text-gray-500">No</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button onClick={() => openModal('view', row)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <FaEye />
                    </button>
                    <button onClick={() => openModal('edit', row)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Art Works</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage art works and their categories</p>
            </div>

            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                pagination={pagination}
                onPageChange={setPage}
                actions={
                    <Button onClick={() => openModal('create')}>
                        <FaPlus /> Add Art Work
                    </Button>
                }
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'create' ? 'Add Art Work' : modalMode === 'edit' ? 'Edit Art Work' : 'Art Work Details'}
                size="lg"
                footer={
                    modalMode !== 'view' && (
                        <>
                            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} loading={formLoading}>{modalMode === 'create' ? 'Create' : 'Update'}</Button>
                        </>
                    )
                }
            >
                {modalMode === 'view' ? (
                    <div className="space-y-3">
                        {selectedItem?.imageUrl && <img src={selectedItem.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
                        <div><strong>Title:</strong> {selectedItem?.title}</div>
                        <div><strong>Category:</strong> {selectedItem?.categoryName || '-'}</div>
                        <div><strong>Artist:</strong> {selectedItem?.artistName || '-'}</div>
                        <div><strong>Medium:</strong> {selectedItem?.medium || '-'}</div>
                        <div><strong>Dimensions:</strong> {selectedItem?.dimensions || '-'}</div>
                        <div><strong>Year:</strong> {selectedItem?.yearCreated || '-'}</div>
                        <div><strong>Price:</strong> {selectedItem?.price ? `$${selectedItem.price}` : '-'}</div>
                        <div><strong>For Sale:</strong> {selectedItem?.isForSale ? 'Yes' : 'No'}</div>
                        <div><strong>Featured:</strong> {selectedItem?.isFeatured ? 'Yes' : 'No'}</div>
                        <div><strong>Views:</strong> {selectedItem?.viewsCount || 0}</div>
                        <div><strong>Likes:</strong> {selectedItem?.likesCount || 0}</div>
                        <div><strong>Description:</strong> {selectedItem?.description || '-'}</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        <Select
                            label="Category"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            options={categoryOptions}
                            placeholder="Select category..."
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Artist Name" value={formData.artistName} onChange={(e) => setFormData({ ...formData, artistName: e.target.value })} />
                            <Input label="Medium" value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value })} placeholder="e.g., Oil on Canvas" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="Dimensions" value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} placeholder="e.g., 24x36 in" />
                            <Input label="Year Created" type="number" value={formData.yearCreated} onChange={(e) => setFormData({ ...formData, yearCreated: e.target.value })} />
                            <Input label="Price ($)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <Input label="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.isForSale} onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })} className="w-4 h-4" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">For Sale</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                            </label>
                        </div>
                        <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default ArtWorksPage;
