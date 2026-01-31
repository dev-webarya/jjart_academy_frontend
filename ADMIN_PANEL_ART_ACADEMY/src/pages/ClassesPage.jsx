import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Button, Input, Select, Textarea } from '../components/ui/FormComponents';
import { useToast } from '../components/ui/Toast';
import api, { getPaginated } from '../api/apiService';
import { API_ENDPOINTS, SCHEDULE_OPTIONS } from '../api/endpoints';

const ClassesPage = () => {
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
        instructorName: '',
        level: '',
        duration: '',
        maxStudents: '',
        price: '',
        schedule: '',
        imageUrl: '',
    });
    const [formLoading, setFormLoading] = useState(false);

    const loadCategories = useCallback(async () => {
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_CLASSES_CATEGORIES.GET_ALL, { size: 100 });
            setCategories(response.content || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }, []);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPaginated(API_ENDPOINTS.ART_CLASSES.GET_ALL, { page, size: 20 });
            setItems(response.content || []);
            setPagination({
                number: response.number || 0,
                size: response.size || 20,
                totalElements: response.totalElements || 0,
                totalPages: response.totalPages || 1,
            });
        } catch (error) {
            toast.error('Failed to load classes');
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
                title: item.title || item.name || '',
                description: item.description || '',
                categoryId: item.categoryId || '',
                instructorName: item.instructorName || '',
                level: item.level || '',
                duration: item.duration || '',
                maxStudents: item.maxStudents || '',
                price: item.price || '',
                schedule: item.schedule || '',
                imageUrl: item.imageUrl || '',
            });
        } else if (mode === 'create') {
            setFormData({ title: '', description: '', categoryId: '', instructorName: '', level: '', duration: '', maxStudents: '', price: '', schedule: '', imageUrl: '' });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const requestData = {
                title: formData.title,
                description: formData.description,
                categoryId: formData.categoryId,
                instructorName: formData.instructorName,
                level: formData.level,
                duration: formData.duration,
                maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : null,
                price: formData.price ? parseFloat(formData.price) : null,
                schedule: formData.schedule,
                imageUrl: formData.imageUrl,
            };
            if (modalMode === 'create') {
                await api.post(API_ENDPOINTS.ART_CLASSES.CREATE, requestData);
                toast.success('Class created');
            } else {
                await api.put(API_ENDPOINTS.ART_CLASSES.UPDATE(selectedItem.id), requestData);
                toast.success('Class updated');
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
        if (!confirm('Delete this class?')) return;
        try {
            await api.delete(API_ENDPOINTS.ART_CLASSES.DELETE(id));
            toast.success('Class deleted');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const columns = [
        { key: 'imageUrl', label: 'Image', render: (val) => val ? <img src={val} alt="" className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" /> },
        { key: 'title', label: 'Title', sortable: true, render: (val, row) => val || row.name || '-' },
        { key: 'categoryName', label: 'Category', render: (val) => val || '-' },
        { key: 'instructorName', label: 'Instructor', render: (val) => val || '-' },
        { key: 'level', label: 'Level', render: (val) => val || '-' },
        { key: 'price', label: 'Price', render: (val) => val ? `$${parseFloat(val).toFixed(2)}` : '-' },
        { key: 'maxStudents', label: 'Capacity', render: (val) => val || '-' },
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
    const levelOptions = [
        { value: 'BEGINNER', label: 'Beginner' },
        { value: 'INTERMEDIATE', label: 'Intermediate' },
        { value: 'ADVANCED', label: 'Advanced' },
        { value: 'ALL_LEVELS', label: 'All Levels' },
    ];
    const scheduleOptions = SCHEDULE_OPTIONS.map(s => ({ value: s, label: s.replace(/_/g, ' ') }));

    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Art Classes</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage art classes available for enrollment</p>
            </div>

            <DataTable columns={columns} data={items} loading={loading} pagination={pagination} onPageChange={setPage} actions={<Button onClick={() => openModal('create')}><FaPlus /> Add Class</Button>} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Class' : modalMode === 'edit' ? 'Edit Class' : 'Class Details'} size="lg" footer={modalMode !== 'view' && (<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} loading={formLoading}>{modalMode === 'create' ? 'Create' : 'Update'}</Button></>)}>
                {modalMode === 'view' ? (
                    <div className="space-y-3">
                        {selectedItem?.imageUrl && <img src={selectedItem.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
                        <div><strong>Title:</strong> {selectedItem?.title || selectedItem?.name}</div>
                        <div><strong>Category:</strong> {selectedItem?.categoryName || '-'}</div>
                        <div><strong>Instructor:</strong> {selectedItem?.instructorName || '-'}</div>
                        <div><strong>Level:</strong> {selectedItem?.level || '-'}</div>
                        <div><strong>Duration:</strong> {selectedItem?.duration || '-'}</div>
                        <div><strong>Schedule:</strong> {selectedItem?.schedule?.replace(/_/g, ' ') || '-'}</div>
                        <div><strong>Max Students:</strong> {selectedItem?.maxStudents || '-'}</div>
                        <div><strong>Price:</strong> {selectedItem?.price ? `$${selectedItem.price}` : '-'}</div>
                        <div><strong>Description:</strong> {selectedItem?.description || '-'}</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        <Select label="Category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} options={categoryOptions} placeholder="Select category..." required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Instructor Name" value={formData.instructorName} onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })} />
                            <Select label="Level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} options={levelOptions} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="Duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 2 hours" />
                            <Input label="Max Students" type="number" value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })} />
                            <Input label="Price ($)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <Select label="Schedule" value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} options={scheduleOptions} />
                        <Input label="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                        <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default ClassesPage;
