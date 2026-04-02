import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    DollarSign,
    Users,
    Clock,
    TrendingUp,
    Activity,
    UserPlus,
    FileText,
    CheckCircle,
    ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

interface Activity {
    id: number;
    type: string;
    title: string;
    description: string | null;
    user: string | null;
    deal: string | null;
    contact: string | null;
    created_at: string;
}

interface RevenueProjection {
    month: string;
    revenue: number;
}

interface DashboardData {
    totalRevenue: number;
    activeLeads: number;
    dealVelocity: number;
    revenueProjection: RevenueProjection[];
    activities: Activity[];
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { props } = usePage();

    useEffect(() => {
        fetch('/api/dashboard')
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'deal_created':
                return <FileText className="h-4 w-4 text-blue-500" />;
            case 'deal_won':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'deal_moved':
                return <ArrowRight className="h-4 w-4 text-yellow-500" />;
            case 'lead_created':
                return <UserPlus className="h-4 w-4 text-purple-500" />;
            case 'task_completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    const maxRevenue = data?.revenueProjection
        ? Math.max(...data.revenueProjection.map((p) => p.revenue), 1)
        : 1;

    if (loading) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="aspect-video animate-pulse rounded-xl border border-sidebar-border/70 bg-muted"
                            />
                        ))}
                    </div>
                    <div className="min-h-[400px] animate-pulse rounded-xl border border-sidebar-border/70 bg-muted" />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="CRM Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(data?.totalRevenue || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                From closed/won deals
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Leads
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.activeLeads || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                In pipeline stages
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Deal Velocity
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.dealVelocity || 0} days
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Average time to close
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Win Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">
                                Coming soon
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Revenue Projection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[250px] items-end justify-between gap-2">
                                {data?.revenueProjection.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div
                                            className="w-full rounded-t-md bg-primary transition-all hover:opacity-80"
                                            style={{
                                                height: `${(item.revenue / maxRevenue) * 200}px`,
                                                minHeight:
                                                    item.revenue > 0
                                                        ? '4px'
                                                        : '0',
                                            }}
                                        />
                                        <span className="origin-left translate-y-2 rotate-45 text-xs text-muted-foreground">
                                            {item.month.split(' ')[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Live Activity Feed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[250px] space-y-4 overflow-y-auto">
                                {data?.activities &&
                                data.activities.length > 0 ? (
                                    data.activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="mt-0.5">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-none font-medium">
                                                    {activity.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.user &&
                                                        `${activity.user} • `}
                                                    {formatDate(
                                                        activity.created_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">
                                            No recent activities
                                        </p>
                                        <p className="text-xs">
                                            Activities will appear here as they
                                            happen
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
