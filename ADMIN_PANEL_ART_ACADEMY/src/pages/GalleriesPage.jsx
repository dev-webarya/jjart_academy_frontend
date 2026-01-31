import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Button, Input, Select, Textarea } from '../components/ui/FormComponents';
import { useToast } from '../components/ui/Toast';
import api, { getPaginated } from '../api/apiService';
import { API_ENDPOINTS } from '../api/endpoints';

const GalleriesPage = () => {
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
        location: '',
        imageUrl: '',
        openingHours: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
    });
    const [formLoading, setFormLoading] = useState(false);

    const loadCategories = useCallback(async () => {
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_GALLERIES_CATEGORIES.GET_ALL, { size: 100 });
            setCategories(response.content || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }, []);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_GALLERIES.GET_ALL, { page, size: 20 });
            setItems(response.content || []);
            setPagination({
                number: response.number || 0,
                size: response.size || 20,
                totalElements: response.totalElements || 0,
                totalPages: response.totalPages || 1,
            });
        } catch (error) {
            toast.error('Failed to load galleries');
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
                location: item.location || '',
                imageUrl: item.imageUrl || '',
                openingHours: item.openingHours || '',
                contactEmail: item.contactEmail || '',
                contactPhone: item.contactPhone || '',
                website: item.website || '',
            });
        } else if (mode === 'create') {
            setFormData({ name: '', description: '', categoryId: '', location: '', imageUrl: '', openingHours: '', contactEmail: '', contactPhone: '', website: '' });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const requestData = { ...formData };
            if (modalMode === 'create') {
                await api.post(API_ENDPOINTS.ART_GALLERIES.CREATE, requestData);
                toast.success('Gallery created');
            } else {
                await api.put(API_ENDPOINTS.ART_GALLERIES.UPDATE(selectedItem.id), requestData);
                toast.success('Gallery updated');
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
        if (!confirm('Delete this gallery?')) return;
        try {
            await api.delete(API_ENDPOINTS.ART_GALLERIES.DELETE(id));
            toast.success('Gallery deleted');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const columns = [
        { key: 'imageUrl', label: 'Image', render: (val) => val ? <img src={val} alt="" className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" /> },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'categoryName', label: 'Category', render: (val) => val || '-' },
        { key: 'location', label: 'Location', render: (val) => val || '-' },
        { key: 'contactEmail', label: 'Email', render: (val) => val || '-' },
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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Art Galleries</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage partner galleries and venues</p>
            </div>

            <DataTable columns={columns} data={items} loading={loading} pagination={pagination} onPageChange={setPage} actions={<Button onClick={() => openModal('create')}><FaPlus /> Add Gallery</Button>} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Gallery' : modalMode === 'edit' ? 'Edit Gallery' : 'Gallery Details'} size="lg" footer={modalMode !== 'view' && (<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} loading={formLoading}>{modalMode === 'create' ? 'Create' : 'Update'}</Button></>)}>
                {modalMode === 'view' ? (
                    <div className="space-y-3">
                        {selectedItem?.imageUrl && <img src={selectedItem.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
                        <div><strong>Name:</strong> {selectedItem?.name}</div>
                        <div><strong>Category:</strong> {selectedItem?.categoryName || '-'}</div>
                        <div><strong>Location:</strong> {selectedItem?.location || '-'}</div>
                        <div><strong>Opening Hours:</strong> {selectedItem?.openingHours || '-'}</div>
                        <div><strong>Email:</strong> {selectedItem?.contactEmail || '-'}</div>
                        <div><strong>Phone:</strong> {selectedItem?.contactPhone || '-'}</div>
                        <div><strong>Website:</strong> {selectedItem?.website ? <a href={selectedItem.website} target="_blank" rel="noopener noreferrer" className="text-purple-500">{selectedItem.website}</a> : '-'}</div>
                        <div><strong>Description:</strong> {selectedItem?.description || '-'}</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Select label="Category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} options={categoryOptions} placeholder="Select category..." required />
                        <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        <Input label="Opening Hours" value={formData.openingHours} onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })} placeholder="e.g., Mon-Fri 9am-5pm" />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Contact Email" type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                            <Input label="Contact Phone" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                        </div>
                        <Input label="Website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." />
                        <Input label="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                        <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default GalleriesPage;
