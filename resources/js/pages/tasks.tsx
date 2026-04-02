import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
    Plus,
    Search,
    Calendar,
    User,
    CheckCircle,
    Circle,
    Clock,
    AlertCircle,
    Pencil,
    Trash2,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Deal {
    id: number;
    title: string;
    contact?: { first_name: string; last_name: string };
}

interface User {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    due_date: string | null;
    completed_at: string | null;
    deal: Deal | null;
    user: User | null;
    created_at: string;
}

const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    in_progress:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const priorityLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deal_id: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
    });

    const fetchTasks = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page: page.toString() });
                if (filters.search) params.append('search', filters.search);
                if (filters.status && filters.status !== 'all')
                    params.append('status', filters.status);
                if (filters.priority && filters.priority !== 'all')
                    params.append('priority', filters.priority);

                const res = await fetch(`/api/tasks?${params}`);
                const json = await res.json();
                setTasks(json.data);
                setPagination({
                    current_page: json.current_page,
                    last_page: json.last_page,
                });
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    const fetchDeals = useCallback(async () => {
        try {
            const res = await fetch('/api/deals');
            const json = await res.json();
            setDeals(json);
        } catch (error) {
            console.error('Failed to fetch deals:', error);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
        fetchDeals();
    }, [fetchTasks, fetchDeals]);

    const openModal = (task?: Task) => {
        const formatDate = (dateStr: string | null) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        };

        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title,
                description: task.description || '',
                deal_id: task.deal?.id?.toString() || '',
                priority: task.priority,
                status: task.status,
                due_date: formatDate(task.due_date),
            });
        } else {
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                deal_id: '',
                priority: 'medium',
                status: 'pending',
                due_date: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
        const method = editingTask ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    deal_id: formData.deal_id
                        ? parseInt(formData.deal_id)
                        : null,
                }),
            });
            setIsModalOpen(false);
            fetchTasks(pagination.current_page);
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    const handleDelete = async (taskId: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            fetchTasks(pagination.current_page);
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleStatusChange = async (taskId: number, status: string) => {
        try {
            await fetch(`/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchTasks(pagination.current_page);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = (task: Task) => {
        if (
            !task.due_date ||
            task.status === 'completed' ||
            task.status === 'cancelled'
        )
            return false;
        return new Date(task.due_date) < new Date();
    };

    return (
        <>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    <Button onClick={() => openModal()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            search: e.target.value,
                                        })
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.priority}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            priority: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Priority
                                        </SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-pulse text-muted-foreground">
                                    Loading...
                                </div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <p>No tasks found</p>
                                <Button
                                    variant="link"
                                    onClick={() => openModal()}
                                >
                                    Create your first task
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 ${
                                            isOverdue(task)
                                                ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex flex-1 items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    handleStatusChange(
                                                        task.id,
                                                        task.status ===
                                                            'completed'
                                                            ? 'pending'
                                                            : 'completed',
                                                    )
                                                }
                                                className="flex-shrink-0"
                                            >
                                                {task.status === 'completed' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-muted-foreground hover:text-green-500" />
                                                )}
                                            </button>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className={`font-medium ${task.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
                                                    >
                                                        {task.title}
                                                    </p>
                                                    <Badge
                                                        className={
                                                            priorityColors[
                                                                task.priority
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            priorityLabels[
                                                                task.priority
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>
                                                {task.description && (
                                                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                                    {task.deal && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {
                                                                task.deal
                                                                    .contact
                                                                    ?.first_name
                                                            }{' '}
                                                            {
                                                                task.deal
                                                                    .contact
                                                                    ?.last_name
                                                            }
                                                        </span>
                                                    )}
                                                    {task.due_date && (
                                                        <span
                                                            className={`flex items-center gap-1 ${isOverdue(task) ? 'text-red-500' : ''}`}
                                                        >
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(
                                                                task.due_date,
                                                            )}
                                                            {isOverdue(
                                                                task,
                                                            ) && (
                                                                <AlertCircle className="h-3 w-3" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={
                                                    statusColors[task.status]
                                                }
                                            >
                                                {statusLabels[task.status]}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => openModal(task)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pagination.last_page > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.current_page} of{' '}
                                    {pagination.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.current_page === 1}
                                        onClick={() =>
                                            fetchTasks(
                                                pagination.current_page - 1,
                                            )
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            pagination.current_page ===
                                            pagination.last_page
                                        }
                                        onClick={() =>
                                            fetchTasks(
                                                pagination.current_page + 1,
                                            )
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingTask
                                    ? 'Update task details below.'
                                    : 'Fill in the details to create a new task.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Task Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Enter task title"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Optional description"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="deal">
                                        Related Deal (Optional)
                                    </Label>
                                    <Select
                                        value={formData.deal_id}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                deal_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a deal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                No Deal
                                            </SelectItem>
                                            {deals.map((deal) => (
                                                <SelectItem
                                                    key={deal.id}
                                                    value={deal.id.toString()}
                                                >
                                                    {deal.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">
                                            Priority
                                        </Label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    priority: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    status: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="in_progress">
                                                    In Progress
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                due_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingTask
                                        ? 'Save Changes'
                                        : 'Create Task'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Tasks.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tasks', href: '/tasks' },
    ],
};
