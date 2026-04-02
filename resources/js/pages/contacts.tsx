import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    Pencil,
    Trash2,
    MoreHorizontal,
    Mail,
    Phone,
    Building,
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

interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    position: string | null;
    source: string;
    status: string;
    created_at: string;
}

const statusColors: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    prospect:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    customer:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    churned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const sourceLabels: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    social: 'Social',
    cold_call: 'Cold Call',
    other: 'Other',
};

export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        source: '',
        user_id: '',
    });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        source: 'other',
        status: 'lead',
    });

    const fetchContacts = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page: page.toString() });
                if (filters.search) params.append('search', filters.search);
                if (filters.status && filters.status !== 'all')
                    params.append('status', filters.status);
                if (filters.source && filters.source !== 'all')
                    params.append('source', filters.source);
                if (filters.user_id) params.append('user_id', filters.user_id);

                const res = await fetch(`/api/contacts?${params}`);
                const json = await res.json();
                setContacts(json.data);
                setPagination({
                    current_page: json.current_page,
                    last_page: json.last_page,
                });
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleSearch = (value: string) => {
        setFilters({ ...filters, search: value });
    };

    const openModal = (contact?: Contact) => {
        if (contact) {
            setEditingContact(contact);
            setFormData({
                first_name: contact.first_name,
                last_name: contact.last_name,
                email: contact.email || '',
                phone: contact.phone || '',
                company: contact.company || '',
                position: contact.position || '',
                source: contact.source,
                status: contact.status,
            });
        } else {
            setEditingContact(null);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                company: '',
                position: '',
                source: 'other',
                status: 'lead',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingContact
            ? `/api/contacts/${editingContact.id}`
            : '/api/contacts';
        const method = editingContact ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setIsModalOpen(false);
            fetchContacts(pagination.current_page);
        } catch (error) {
            console.error('Failed to save contact:', error);
        }
    };

    const handleDelete = async (contactId: number) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' });
            fetchContacts(pagination.current_page);
        } catch (error) {
            console.error('Failed to delete contact:', error);
        }
    };

    const handleStatusChange = async (contactId: number, status: string) => {
        try {
            await fetch(`/api/contacts/${contactId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchContacts(pagination.current_page);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <>
            <Head title="Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Contacts</h1>
                    <Button onClick={() => openModal()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Contact
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search contacts..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
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
                                        <SelectItem value="lead">
                                            Lead
                                        </SelectItem>
                                        <SelectItem value="prospect">
                                            Prospect
                                        </SelectItem>
                                        <SelectItem value="customer">
                                            Customer
                                        </SelectItem>
                                        <SelectItem value="churned">
                                            Churned
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.source}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            source: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Sources
                                        </SelectItem>
                                        <SelectItem value="website">
                                            Website
                                        </SelectItem>
                                        <SelectItem value="referral">
                                            Referral
                                        </SelectItem>
                                        <SelectItem value="social">
                                            Social
                                        </SelectItem>
                                        <SelectItem value="cold_call">
                                            Cold Call
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
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
                        ) : contacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <p>No contacts found</p>
                                <Button
                                    variant="link"
                                    onClick={() => openModal()}
                                >
                                    Create your first contact
                                </Button>
                            </div>
                        ) : (
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
                                                Company
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Status
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Source
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((contact) => (
                                            <tr
                                                key={contact.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="py-3">
                                                    <div>
                                                        <p className="font-medium">
                                                            {contact.first_name}{' '}
                                                            {contact.last_name}
                                                        </p>
                                                        {contact.position && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    contact.position
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    {contact.email ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                                            {contact.email}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {contact.company ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Building className="h-3 w-3 text-muted-foreground" />
                                                            {contact.company}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <Select
                                                        value={contact.status}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleStatusChange(
                                                                contact.id,
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-6 w-[120px] text-xs">
                                                            <Badge
                                                                className={`${statusColors[contact.status]} hover:${statusColors[contact.status]}`}
                                                            >
                                                                {contact.status}
                                                            </Badge>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="lead">
                                                                Lead
                                                            </SelectItem>
                                                            <SelectItem value="prospect">
                                                                Prospect
                                                            </SelectItem>
                                                            <SelectItem value="customer">
                                                                Customer
                                                            </SelectItem>
                                                            <SelectItem value="churned">
                                                                Churned
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-3 text-sm text-muted-foreground">
                                                    {sourceLabels[
                                                        contact.source
                                                    ] || contact.source}
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                openModal(
                                                                    contact,
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
                                                                    contact.id,
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
                                            fetchContacts(
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
                                            fetchContacts(
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
                                {editingContact
                                    ? 'Edit Contact'
                                    : 'Add New Contact'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingContact
                                    ? 'Update contact details below.'
                                    : 'Fill in the details to create a new contact.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">
                                            First Name
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={formData.first_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    first_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={formData.last_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    last_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                position: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="source">Source</Label>
                                        <Select
                                            value={formData.source}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    source: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="website">
                                                    Website
                                                </SelectItem>
                                                <SelectItem value="referral">
                                                    Referral
                                                </SelectItem>
                                                <SelectItem value="social">
                                                    Social
                                                </SelectItem>
                                                <SelectItem value="cold_call">
                                                    Cold Call
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Other
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
                                                <SelectItem value="lead">
                                                    Lead
                                                </SelectItem>
                                                <SelectItem value="prospect">
                                                    Prospect
                                                </SelectItem>
                                                <SelectItem value="customer">
                                                    Customer
                                                </SelectItem>
                                                <SelectItem value="churned">
                                                    Churned
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                    {editingContact
                                        ? 'Save Changes'
                                        : 'Create Contact'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Contacts.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contacts', href: '/contacts' },
    ],
};
