import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
} from '@hello-pangea/dnd';
import {
    Plus,
    X,
    Calendar,
    DollarSign,
    User,
    MoreHorizontal,
    Pencil,
    Trash2,
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

interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company: string | null;
}

interface Deal {
    id: number;
    title: string;
    value: number;
    status: string;
    expected_close_date: string | null;
    contact: Contact | null;
    user: { name: string } | null;
    stage_id: number;
}

interface Stage {
    id: number;
    name: string;
    color: string;
    order: number;
    deals: Deal[];
}

interface PipelineData {
    pipeline: { id: number; name: string };
    stages: Stage[];
    contacts: Contact[];
}

export default function Pipeline() {
    const [data, setData] = useState<PipelineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        value: '',
        contact_id: '',
        stage_id: '',
        expected_close_date: '',
    });

    const fetchPipeline = useCallback(async () => {
        try {
            const res = await fetch('/api/pipeline');
            const json = await res.json();
            if (json.stages) {
                setData(json);
            }
        } catch (error) {
            console.error('Failed to fetch pipeline:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPipeline();
    }, [fetchPipeline]);

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceStage = data?.stages.find(
            (s) => s.id.toString() === source.droppableId,
        );
        const destStage = data?.stages.find(
            (s) => s.id.toString() === destination.droppableId,
        );

        if (!sourceStage || !destStage) return;

        const deal = sourceStage.deals.find(
            (d) => d.id.toString() === draggableId,
        );
        if (!deal) return;

        const newStages = data?.stages.map((stage) => {
            if (stage.id.toString() === source.droppableId) {
                return {
                    ...stage,
                    deals: stage.deals.filter(
                        (d) => d.id.toString() !== draggableId,
                    ),
                };
            }
            if (stage.id.toString() === destination.droppableId) {
                const newDeal = {
                    ...deal,
                    stage_id: parseInt(destination.droppableId),
                };
                const newDeals = [...stage.deals];
                newDeals.splice(destination.index, 0, newDeal);
                return { ...stage, deals: newDeals };
            }
            return stage;
        });

        if (newStages) {
            setData({ ...data!, stages: newStages });
        }

        try {
            await fetch(`/api/deals/${draggableId}/stage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stage_id: destination.droppableId }),
            });
        } catch (error) {
            console.error('Failed to update deal stage:', error);
            fetchPipeline();
        }
    };

    const openModal = (deal?: Deal, stageId?: number) => {
        const formatDate = (dateStr: string | null) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        };

        if (deal) {
            setEditingDeal(deal);
            setFormData({
                title: deal.title,
                value: deal.value?.toString() || '',
                contact_id: deal.contact?.id?.toString() || '',
                stage_id: deal.stage_id.toString(),
                expected_close_date: formatDate(deal.expected_close_date),
            });
        } else {
            setEditingDeal(null);
            setFormData({
                title: '',
                value: '',
                contact_id: '',
                stage_id:
                    stageId?.toString() || data?.stages[0]?.id.toString() || '',
                expected_close_date: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingDeal ? `/api/deals/${editingDeal.id}` : '/api/deals';
        const method = editingDeal ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    value: formData.value ? parseFloat(formData.value) : 0,
                    contact_id: parseInt(formData.contact_id),
                    stage_id: parseInt(formData.stage_id),
                }),
            });
            setIsModalOpen(false);
            fetchPipeline();
        } catch (error) {
            console.error('Failed to save deal:', error);
        }
    };

    const handleDelete = async (dealId: number) => {
        if (!confirm('Are you sure you want to delete this deal?')) return;

        try {
            await fetch(`/api/deals/${dealId}`, { method: 'DELETE' });
            fetchPipeline();
        } catch (error) {
            console.error('Failed to delete deal:', error);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <>
                <Head title="Pipeline" />
                <div className="flex h-full items-center justify-center p-4">
                    <div className="animate-pulse text-muted-foreground">
                        Loading pipeline...
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Pipeline" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {data?.pipeline?.name || 'Pipeline'}
                    </h1>
                    <Button onClick={() => openModal()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Deal
                    </Button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {data?.stages.map((stage) => (
                            <div key={stage.id} className="w-80 flex-shrink-0">
                                <Card className="h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            stage.color,
                                                    }}
                                                />
                                                {stage.name}
                                            </CardTitle>
                                            <span className="text-xs text-muted-foreground">
                                                {stage.deals.length}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Droppable
                                            droppableId={stage.id.toString()}
                                        >
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="min-h-[200px] space-y-2"
                                                >
                                                    {stage.deals.map(
                                                        (deal, index) => (
                                                            <Draggable
                                                                key={deal.id}
                                                                draggableId={deal.id.toString()}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={
                                                                            provided.innerRef
                                                                        }
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                                                                    >
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="truncate text-sm font-medium">
                                                                                    {
                                                                                        deal.title
                                                                                    }
                                                                                </p>
                                                                                {deal.contact && (
                                                                                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                                                        <User className="h-3 w-3" />
                                                                                        {
                                                                                            deal
                                                                                                .contact
                                                                                                .first_name
                                                                                        }{' '}
                                                                                        {
                                                                                            deal
                                                                                                .contact
                                                                                                .last_name
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        openModal(
                                                                                            deal,
                                                                                        )
                                                                                    }
                                                                                    className="rounded p-1 hover:bg-muted"
                                                                                >
                                                                                    <Pencil className="h-3 w-3 text-muted-foreground" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleDelete(
                                                                                            deal.id,
                                                                                        )
                                                                                    }
                                                                                    className="rounded p-1 hover:bg-muted"
                                                                                >
                                                                                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-2 flex items-center justify-between text-xs">
                                                                            <span className="font-medium text-green-600">
                                                                                {formatCurrency(
                                                                                    deal.value ||
                                                                                        0,
                                                                                )}
                                                                            </span>
                                                                            {deal.expected_close_date && (
                                                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                                                    <Calendar className="h-3 w-3" />
                                                                                    {formatDate(
                                                                                        deal.expected_close_date,
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ),
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 w-full text-muted-foreground"
                                            onClick={() =>
                                                openModal(undefined, stage.id)
                                            }
                                        >
                                            <Plus className="mr-1 h-4 w-4" />{' '}
                                            Add Deal
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </DragDropContext>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingDeal
                                    ? 'Update deal details below.'
                                    : 'Fill in the details to create a new deal.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Deal Name</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Enter deal name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Value ($)</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                value: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact">Contact</Label>
                                    <Select
                                        value={formData.contact_id}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                contact_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data?.contacts.map((contact) => (
                                                <SelectItem
                                                    key={contact.id}
                                                    value={contact.id.toString()}
                                                >
                                                    {contact.first_name}{' '}
                                                    {contact.last_name}
                                                    {contact.company &&
                                                        ` - ${contact.company}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stage">Stage</Label>
                                    <Select
                                        value={formData.stage_id}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                stage_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data?.stages.map((stage) => (
                                                <SelectItem
                                                    key={stage.id}
                                                    value={stage.id.toString()}
                                                >
                                                    {stage.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="expected_close_date">
                                        Expected Close Date
                                    </Label>
                                    <Input
                                        id="expected_close_date"
                                        type="date"
                                        value={formData.expected_close_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                expected_close_date:
                                                    e.target.value,
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
                                    {editingDeal
                                        ? 'Save Changes'
                                        : 'Create Deal'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Pipeline.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pipeline', href: '/pipeline' },
    ],
};
