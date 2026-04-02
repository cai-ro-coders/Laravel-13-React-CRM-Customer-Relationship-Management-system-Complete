import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
    Plus,
    Search,
    FileText,
    DollarSign,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    Pencil,
    Trash2,
    Send,
    Download,
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
    contact?: { first_name: string; last_name: string; company: string | null };
}

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    tax: number;
    total: number;
    status: string;
    issue_date: string;
    due_date: string;
    paid_at: string | null;
    deal: Deal | null;
    notes: string | null;
    created_at: string;
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
};

export default function Billing() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
    });

    const [formData, setFormData] = useState({
        deal_id: '',
        amount: '',
        tax: '',
        issue_date: '',
        due_date: '',
        notes: '',
    });

    const fetchInvoices = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page: page.toString() });
                if (filters.search) params.append('search', filters.search);
                if (filters.status && filters.status !== 'all')
                    params.append('status', filters.status);

                const res = await fetch(`/api/invoices?${params}`);
                const json = await res.json();
                setInvoices(json.data);
                setPagination({
                    current_page: json.current_page,
                    last_page: json.last_page,
                });
            } catch (error) {
                console.error('Failed to fetch invoices:', error);
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

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/invoices?all=true');
            const json = await res.json();
            const allInvoices = json.data || [];

            const total = allInvoices.reduce(
                (sum: number, inv: Invoice) => sum + Number(inv.total || 0),
                0,
            );
            const paid = allInvoices
                .filter((inv: Invoice) => inv.status === 'paid')
                .reduce(
                    (sum: number, inv: Invoice) => sum + Number(inv.total || 0),
                    0,
                );
            const pending = allInvoices
                .filter((inv: Invoice) =>
                    ['draft', 'sent'].includes(inv.status),
                )
                .reduce(
                    (sum: number, inv: Invoice) => sum + Number(inv.total || 0),
                    0,
                );
            const overdue = allInvoices
                .filter((inv: Invoice) => inv.status === 'overdue')
                .reduce(
                    (sum: number, inv: Invoice) => sum + Number(inv.total || 0),
                    0,
                );

            setStats({ total, paid, pending, overdue });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
        fetchDeals();
        fetchStats();
    }, [fetchInvoices, fetchDeals, fetchStats]);

    const openModal = (invoice?: Invoice) => {
        const formatDate = (dateStr: string | null) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        };

        if (invoice) {
            setEditingInvoice(invoice);
            setFormData({
                deal_id: invoice.deal?.id?.toString() || '',
                amount: invoice.amount?.toString() || '',
                tax: invoice.tax?.toString() || '',
                issue_date: formatDate(invoice.issue_date),
                due_date: formatDate(invoice.due_date),
                notes: invoice.notes || '',
            });
        } else {
            setEditingInvoice(null);
            const today = new Date().toISOString().split('T')[0];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);
            setFormData({
                deal_id: '',
                amount: '',
                tax: '',
                issue_date: today,
                due_date: dueDate.toISOString().split('T')[0],
                notes: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingInvoice
            ? `/api/invoices/${editingInvoice.id}`
            : '/api/invoices';
        const method = editingInvoice ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    deal_id: parseInt(formData.deal_id),
                    amount: parseFloat(formData.amount),
                    tax: formData.tax ? parseFloat(formData.tax) : 0,
                }),
            });
            setIsModalOpen(false);
            fetchInvoices(pagination.current_page);
            fetchStats();
        } catch (error) {
            console.error('Failed to save invoice:', error);
        }
    };

    const handleDelete = async (invoiceId: number) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' });
            fetchInvoices(pagination.current_page);
            fetchStats();
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        }
    };

    const handleStatusChange = async (invoiceId: number, status: string) => {
        try {
            await fetch(`/api/invoices/${invoiceId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchInvoices(pagination.current_page);
            fetchStats();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = (invoice: Invoice) => {
        if (invoice.status === 'paid' || invoice.status === 'cancelled')
            return false;
        return new Date(invoice.due_date) < new Date();
    };

    return (
        <>
            <Head title="Billing" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Billing & Invoices</h1>
                    <Button onClick={() => openModal()}>
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Invoiced
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.total)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Paid
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.paid)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {formatCurrency(stats.pending)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Overdue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(stats.overdue)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search invoices..."
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
                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, status: value })
                                }
                            >
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="overdue">
                                        Overdue
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-pulse text-muted-foreground">
                                    Loading...
                                </div>
                            </div>
                        ) : invoices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <p>No invoices found</p>
                                <Button
                                    variant="link"
                                    onClick={() => openModal()}
                                >
                                    Create your first invoice
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left text-sm text-muted-foreground">
                                            <th className="pb-3 font-medium">
                                                Invoice #
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Customer
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Amount
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Issue Date
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Due Date
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Status
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {
                                                                invoice.invoice_number
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    {invoice.deal?.contact ? (
                                                        <div>
                                                            <p className="text-sm">
                                                                {
                                                                    invoice.deal
                                                                        .contact
                                                                        .first_name
                                                                }{' '}
                                                                {
                                                                    invoice.deal
                                                                        .contact
                                                                        .last_name
                                                                }
                                                            </p>
                                                            {invoice.deal
                                                                .contact
                                                                .company && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        invoice
                                                                            .deal
                                                                            .contact
                                                                            .company
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <span className="font-medium">
                                                        {formatCurrency(
                                                            invoice.total,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-sm text-muted-foreground">
                                                    {formatDate(
                                                        invoice.issue_date,
                                                    )}
                                                </td>
                                                <td
                                                    className={`py-3 text-sm ${isOverdue(invoice) ? 'text-red-500' : 'text-muted-foreground'}`}
                                                >
                                                    {formatDate(
                                                        invoice.due_date,
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <Select
                                                        value={invoice.status}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleStatusChange(
                                                                invoice.id,
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-6 w-[120px] text-xs">
                                                            <Badge
                                                                className={`${statusColors[invoice.status]} hover:${statusColors[invoice.status]}`}
                                                            >
                                                                {
                                                                    statusLabels[
                                                                        invoice
                                                                            .status
                                                                    ]
                                                                }
                                                            </Badge>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="draft">
                                                                Draft
                                                            </SelectItem>
                                                            <SelectItem value="sent">
                                                                Sent
                                                            </SelectItem>
                                                            <SelectItem value="paid">
                                                                Paid
                                                            </SelectItem>
                                                            <SelectItem value="overdue">
                                                                Overdue
                                                            </SelectItem>
                                                            <SelectItem value="cancelled">
                                                                Cancelled
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                openModal(
                                                                    invoice,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-600"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    invoice.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                            fetchInvoices(
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
                                            fetchInvoices(
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
                                {editingInvoice
                                    ? 'Edit Invoice'
                                    : 'Create Invoice'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingInvoice
                                    ? 'Update invoice details below.'
                                    : 'Fill in the details to create a new invoice.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="deal">
                                        Deal / Customer
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
                                            {deals.map((deal) => (
                                                <SelectItem
                                                    key={deal.id}
                                                    value={deal.id.toString()}
                                                >
                                                    {deal.title}
                                                    {deal.contact?.company &&
                                                        ` - ${deal.contact.company}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">
                                            Amount ($)
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    amount: e.target.value,
                                                })
                                            }
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tax">Tax ($)</Label>
                                        <Input
                                            id="tax"
                                            type="number"
                                            value={formData.tax}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    tax: e.target.value,
                                                })
                                            }
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="issue_date">
                                            Issue Date
                                        </Label>
                                        <Input
                                            id="issue_date"
                                            type="date"
                                            value={formData.issue_date}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    issue_date: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="due_date">
                                            Due Date
                                        </Label>
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
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">
                                        Notes (Optional)
                                    </Label>
                                    <Input
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                notes: e.target.value,
                                            })
                                        }
                                        placeholder="Additional notes..."
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
                                    {editingInvoice
                                        ? 'Save Changes'
                                        : 'Create Invoice'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Billing.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Billing', href: '/billing' },
    ],
};
