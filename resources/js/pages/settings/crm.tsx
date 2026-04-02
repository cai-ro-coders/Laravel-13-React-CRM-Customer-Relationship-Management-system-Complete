import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
    Plus,
    Settings,
    Users,
    GitBranch,
    Pencil,
    Trash2,
    Save,
    X,
    GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Stage {
    id: number;
    name: string;
    color: string;
    order: number;
    is_win: boolean;
    is_loss: boolean;
    deals_count?: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export default function SettingsCrm() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pipeline');
    const [isStageModalOpen, setIsStageModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<Stage | null>(null);
    const [stageFormData, setStageFormData] = useState({
        name: '',
        color: '#6366f1',
        is_win: false,
        is_loss: false,
    });

    const fetchStages = useCallback(async () => {
        try {
            const res = await fetch('/api/settings/pipeline');
            const json = await res.json();
            setStages(json.stages || []);
        } catch (error) {
            console.error('Failed to fetch stages:', error);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/settings/users');
            const json = await res.json();
            setUsers(json);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchStages(), fetchUsers()]);
            setLoading(false);
        };
        loadData();
    }, [fetchStages, fetchUsers]);

    const openStageModal = (stage?: Stage) => {
        if (stage) {
            setEditingStage(stage);
            setStageFormData({
                name: stage.name,
                color: stage.color,
                is_win: stage.is_win,
                is_loss: stage.is_loss,
            });
        } else {
            setEditingStage(null);
            setStageFormData({
                name: '',
                color: '#6366f1',
                is_win: false,
                is_loss: false,
            });
        }
        setIsStageModalOpen(true);
    };

    const handleStageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingStage
            ? `/api/settings/pipeline/stages/${editingStage.id}`
            : '/api/settings/pipeline/stages';
        const method = editingStage ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stageFormData),
            });
            setIsStageModalOpen(false);
            fetchStages();
        } catch (error) {
            console.error('Failed to save stage:', error);
        }
    };

    const handleDeleteStage = async (stageId: number) => {
        if (!confirm('Are you sure you want to delete this stage?')) return;

        try {
            const res = await fetch(
                `/api/settings/pipeline/stages/${stageId}`,
                {
                    method: 'DELETE',
                },
            );
            const json = await res.json();
            if (json.error) {
                alert(json.error);
            } else {
                fetchStages();
            }
        } catch (error) {
            console.error('Failed to delete stage:', error);
        }
    };

    const handleReorderStages = async (newStages: Stage[]) => {
        const reorderedData = newStages.map((stage, index) => ({
            id: stage.id,
            order: index,
        }));

        try {
            await fetch('/api/settings/pipeline/stages/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stages: reorderedData }),
            });
            setStages(newStages);
        } catch (error) {
            console.error('Failed to reorder stages:', error);
        }
    };

    const moveStage = (index: number, direction: 'up' | 'down') => {
        const newStages = [...stages];
        if (direction === 'up' && index > 0) {
            [newStages[index - 1], newStages[index]] = [
                newStages[index],
                newStages[index - 1],
            ];
        } else if (direction === 'down' && index < newStages.length - 1) {
            [newStages[index], newStages[index + 1]] = [
                newStages[index + 1],
                newStages[index],
            ];
        }
        handleReorderStages(newStages);
    };

    const colorOptions = [
        '#6366f1',
        '#8b5cf6',
        '#ec4899',
        '#f59e0b',
        '#10b981',
        '#22c55e',
        '#3b82f6',
        '#ef4444',
        '#14b8a6',
        '#a855f7',
    ];

    if (loading) {
        return (
            <>
                <Head title="CRM Settings" />
                <div className="flex h-full items-center justify-center p-4">
                    <div className="animate-pulse text-muted-foreground">
                        Loading settings...
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="CRM Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">CRM Settings</h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="pipeline">
                            <GitBranch className="mr-2 h-4 w-4" /> Pipeline
                            Stages
                        </TabsTrigger>
                        <TabsTrigger value="users">
                            <Users className="mr-2 h-4 w-4" /> Users & Roles
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pipeline" className="mt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Pipeline Stages</CardTitle>
                                        <CardDescription>
                                            Configure the stages in your sales
                                            pipeline
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => openStageModal()}>
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        Stage
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {stages.map((stage, index) => (
                                        <div
                                            key={stage.id}
                                            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() =>
                                                            moveStage(
                                                                index,
                                                                'up',
                                                            )
                                                        }
                                                        disabled={index === 0}
                                                        className="rounded p-1 hover:bg-muted disabled:opacity-50"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            moveStage(
                                                                index,
                                                                'down',
                                                            )
                                                        }
                                                        disabled={
                                                            index ===
                                                            stages.length - 1
                                                        }
                                                        className="rounded p-1 hover:bg-muted disabled:opacity-50"
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                                <div
                                                    className="h-4 w-4 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            stage.color,
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {stage.name}
                                                    </p>
                                                    <div className="mt-1 flex gap-2">
                                                        {stage.is_win && (
                                                            <Badge className="bg-green-100 text-xs text-green-800">
                                                                Win
                                                            </Badge>
                                                        )}
                                                        {stage.is_loss && (
                                                            <Badge className="bg-red-100 text-xs text-red-800">
                                                                Loss
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openStageModal(stage)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() =>
                                                        handleDeleteStage(
                                                            stage.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {stages.length === 0 && (
                                        <div className="py-8 text-center text-muted-foreground">
                                            No stages configured. Add your first
                                            stage to get started.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="mt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Users & Roles</CardTitle>
                                        <CardDescription>
                                            Manage users and their roles in the
                                            CRM
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-left text-sm text-muted-foreground">
                                                <th className="pb-3 font-medium">
                                                    Name
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Email
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Joined
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b last:border-0 hover:bg-muted/50"
                                                >
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                                                                {user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <span className="font-medium">
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-muted-foreground">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-3 text-muted-foreground">
                                                        {new Date(
                                                            user.created_at,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Edit Role
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {users.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No users found.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog
                    open={isStageModalOpen}
                    onOpenChange={setIsStageModalOpen}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingStage ? 'Edit Stage' : 'Add New Stage'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingStage
                                    ? 'Update stage configuration below.'
                                    : 'Fill in the details to create a new stage.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleStageSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Stage Name</Label>
                                    <Input
                                        id="name"
                                        value={stageFormData.name}
                                        onChange={(e) =>
                                            setStageFormData({
                                                ...stageFormData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Enter stage name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Stage Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`h-8 w-8 rounded-full border-2 ${
                                                    stageFormData.color ===
                                                    color
                                                        ? 'border-black dark:border-white'
                                                        : 'border-transparent'
                                                }`}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                onClick={() =>
                                                    setStageFormData({
                                                        ...stageFormData,
                                                        color,
                                                    })
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={stageFormData.is_win}
                                            onChange={(e) =>
                                                setStageFormData({
                                                    ...stageFormData,
                                                    is_win: e.target.checked,
                                                    is_loss: e.target.checked
                                                        ? false
                                                        : stageFormData.is_loss,
                                                })
                                            }
                                            className="rounded"
                                        />
                                        This is a "Won" stage
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Deals moved to this stage will be marked
                                        as won
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={stageFormData.is_loss}
                                            onChange={(e) =>
                                                setStageFormData({
                                                    ...stageFormData,
                                                    is_loss: e.target.checked,
                                                    is_win: e.target.checked
                                                        ? false
                                                        : stageFormData.is_win,
                                                })
                                            }
                                            className="rounded"
                                        />
                                        This is a "Lost" stage
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Deals moved to this stage will be marked
                                        as lost
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsStageModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingStage
                                        ? 'Save Changes'
                                        : 'Create Stage'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

SettingsCrm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'CRM Settings', href: '/settings/crm' },
    ],
};
